import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../../services/carrito.service';
import { AuthService } from '../../../services/auth.service';
import { VentaService } from '../../../services/venta.service';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  catalogoBicicletas: any[] = [];
  proveedoresDestacados: string[] = [
    'GW Colombia',
    'Sunday Bikes',
    'Trek',
    'Specialized',
    'Shimano',
  ];

  // --- VARIABLES DEL CARRITO ---
  itemsCarrito: any[] = [];
  totalCarrito: number = 0;

  // --- VARIABLES DE FILTRO ---
  filtroMarca: string = '';
  filtroModelo: string = '';
  filtroTipo: string = '';

  // --- VARIABLE ESTADO DE CARGA ---
  cargandoCatalogo: boolean = true;

  constructor(
    private http: HttpClient,
    public carritoService: CarritoService,
    private authService: AuthService,
    private ventaService: VentaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const timestamp = new Date().getTime();
    this.cargandoCatalogo = true;

    this.http.get<any[]>(`http://localhost:8080/api/bicicletas/catalogo?t=${timestamp}`).subscribe({
      next: (data) => {
        this.catalogoBicicletas = data;
        this.cargandoCatalogo = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando catálogo', err);
        this.cargandoCatalogo = false;
        this.cdr.detectChanges();
      },
    });

    this.carritoService.carrito$.subscribe((items) => {
      this.itemsCarrito = items;
      this.totalCarrito = this.carritoService.obtenerTotal();
    });
  }

  // ==========================================
  //      VALIDACIÓN DE ROL DE USUARIO
  // ==========================================
  get isCliente(): boolean {
    const usuario = this.authService.currentUserValue;
    if (!usuario) return false;
    return (usuario as any).rol === 'CLIENTE';
  }

  // ==========================================
  //      BUSCADOR Y FILTRO DE STOCK VIVO
  // ==========================================
  get bicicletasFiltradas() {
    return this.catalogoBicicletas.filter(bici => {

      // 🔥 NUEVA REGLA: Si el stock es 0 o nulo, la ocultamos inmediatamente 🔥
      const stockReal = bici.stock !== null ? bici.stock : 0;
      if (stockReal <= 0) {
        return false; // Esto saca la bicicleta de la lista visual
      }

      const coincideMarca = this.filtroMarca ? bici.marca.toLowerCase().includes(this.filtroMarca.toLowerCase()) : true;
      const coincideModelo = this.filtroModelo ? bici.modelo.toLowerCase().includes(this.filtroModelo.toLowerCase()) : true;
      const coincideTipo = this.filtroTipo ? bici.tipo.toLowerCase().includes(this.filtroTipo.toLowerCase()) : true;

      return coincideMarca && coincideModelo && coincideTipo;
    });
  }

  obtenerImagenBici(tipo: string): string {
    const tipoLower = tipo ? tipo.toLowerCase() : '';
    if (tipoLower.includes('mtb')) return 'assets/bikes/mtb.png';
    if (tipoLower.includes('ruta')) return 'assets/bikes/ruta.png';
    if (tipoLower.includes('urbano') || tipoLower.includes('urbana')) return 'assets/bikes/urbano.png';
    if (tipoLower.includes('bmx')) return 'assets/bikes/bmx.png';
    return 'assets/bikes/mtb.png';
  }

  scrollToCatalogo() {
    const elemento = document.getElementById('seccion-catalogo');
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // ==========================================
  //      MÉTODOS DEL CARRITO
  // ==========================================

  agregarAlCarrito(bici: any) {
    const usuarioActual = this.authService.currentUserValue;

    if (!usuarioActual) {
      this.router.navigate(['/login']);
      return;
    }

    this.carritoService.agregarBicicleta(bici);

    const panelElement = document.getElementById('panelCarrito');
    if (panelElement) {
      const bsOffcanvas = bootstrap.Offcanvas.getOrCreateInstance(panelElement);
      bsOffcanvas.show();
    }
  }

  aumentarCantidad(item: any) {
    // Validar que no pueda agregar más de lo que hay en stock
    if (item.cantidad >= item.stock) {
      alert(`No puedes agregar más. Solo quedan ${item.stock} unidades disponibles de este modelo.`);
      return;
    }
    this.carritoService.agregarBicicleta(item);
  }

  disminuirCantidad(codigo: string) {
    this.carritoService.disminuirCantidad(codigo);
  }

  eliminarDelCarrito(codigo: string) {
    this.carritoService.eliminarBicicleta(codigo);
  }

  // ==========================================
  //      LÓGICA DE PAGO Y CHECKOUT
  // ==========================================
  procesarPago() {
    const usuarioActual = this.authService.currentUserValue;

    if (!usuarioActual) {
      alert('Para finalizar tu compra, por favor inicia sesión o crea una cuenta.');
      this.router.navigate(['/login']);
      return;
    }

    const idDelCliente =
      (usuarioActual as any).id ||
      (usuarioActual as any).idUsuario ||
      (usuarioActual as any).usuarioId;

    if (!idDelCliente) {
      alert('Error de sesión: No pudimos identificar tu cuenta. Por favor, cierra sesión y vuelve a entrar.');
      return;
    }

    const peticionVenta = {
      usuarioId: idDelCliente,
      items: this.itemsCarrito.map((item) => ({
        codigoBicicleta: item.codigo,
        cantidad: item.cantidad,
      })),
    };

    this.ventaService.registrarVentaMultiple(peticionVenta).subscribe({
      next: (respuestaBackend) => {
        alert(`¡Éxito total! Tu compra ha sido procesada.\nTu número de factura es: FAC-${respuestaBackend.idVenta}`);

        const panelElement = document.getElementById('panelCarrito');
        if (panelElement) {
          const bsOffcanvas = bootstrap.Offcanvas.getInstance(panelElement);
          if (bsOffcanvas) bsOffcanvas.hide();
        }

        this.carritoService.vaciarCarrito();
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Error procesando el pago', err);
        // Si el backend lanza error de stock (400), lo mostramos amigablemente
        if (err.error && typeof err.error === 'string') {
          alert(`Ups... No se pudo procesar: ${err.error}`);
        } else {
          alert('Ups... Hubo un problema al procesar tu compra. Intenta de nuevo.');
        }
      },
    });
  }
}
