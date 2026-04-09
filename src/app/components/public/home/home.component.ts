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
  proveedoresDestacados: string[] = ['GW Colombia', 'Sunday Bikes', 'Trek', 'Specialized', 'Shimano'];
  itemsCarrito: any[] = [];
  totalCarrito: number = 0;
  filtroMarca: string = '';
  filtroModelo: string = '';
  filtroTipo: string = '';
  cargandoCatalogo: boolean = true;

  constructor(
    private http: HttpClient,
    public carritoService: CarritoService,
    private authService: AuthService,
    private ventaService: VentaService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const timestamp = new Date().getTime();
    this.cargandoCatalogo = true;

    this.http.get<any>('https://velox-store-sena-backend-production-2ed0.up.railway.app/api/bicicletas/catalogo?t=' + timestamp).subscribe({
      next: (data) => {
        this.catalogoBicicletas = data.content !== undefined ? data.content : data;
        this.cargandoCatalogo = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error cargando catálogo', err);
        this.cargandoCatalogo = false;
        this.cdr.detectChanges();
      }
    });

    this.carritoService.carrito$.subscribe((items) => {
      this.itemsCarrito = items;
      this.totalCarrito = this.carritoService.obtenerTotal();
    });
  }

  get isCliente(): boolean {
    const usuario = this.authService.currentUserValue;
    return usuario ? (usuario as any).rol === 'CLIENTE' : false;
  }

  get bicicletasFiltradas() {
    if (!Array.isArray(this.catalogoBicicletas)) return [];
    return this.catalogoBicicletas.filter((bici) => {
      const stockReal = bici.stock !== null ? bici.stock : 0;
      if (stockReal <= 0) return false;

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
    if (elemento) elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  agregarAlCarrito(bici: any) {
    if (!this.authService.currentUserValue) {
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
    if (item.cantidad >= item.stock) {
      alert('Solo quedan ' + item.stock + ' unidades disponibles.');
      return;
    }
    this.carritoService.agregarBicicleta(item);
  }

  disminuirCantidad(codigo: string) { this.carritoService.disminuirCantidad(codigo); }
  eliminarDelCarrito(codigo: string) { this.carritoService.eliminarBicicleta(codigo); }

  procesarPago() {
    const usuarioActual = this.authService.currentUserValue;
    if (!usuarioActual) {
      this.router.navigate(['/login']);
      return;
    }

    const idDelCliente = (usuarioActual as any).id || (usuarioActual as any).idUsuario || (usuarioActual as any).usuarioId;

    if (!idDelCliente) {
        alert('Tu sesión ha expirado o es inválida. Por favor inicia sesión de nuevo.');
        this.authService.logout();
        this.router.navigate(['/login']);
        return;
    }

    const peticionVenta = {
      usuarioId: idDelCliente,
      items: this.itemsCarrito.map((item) => ({
        codigoBicicleta: item.codigo || item.codigoBicicleta,
        cantidad: item.cantidad,
      })),
      tipoVenta: 'VIRTUAL'
    };

    this.ventaService.registrarVentaMultiple(peticionVenta).subscribe({
      next: (respuesta: any) => {
        alert('¡Compra procesada! Factura: FAC-' + respuesta.idVenta);
        this.carritoService.vaciarCarrito();
        this.ngOnInit();
      },
      error: (err: any) => {
        console.error(err: any);
        alert('Error: La base de datos de Railway se reinició y estos productos (o tu usuario) ya no existen. Tu carrito se vaciará y deberás iniciar sesión nuevamente.');
        this.carritoService.vaciarCarrito();
        this.authService.logout();
        window.location.href = '/login';
      },
    });
  }
}
