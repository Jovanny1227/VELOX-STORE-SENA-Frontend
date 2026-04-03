import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- IMPORTAMOS ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { InventarioService } from '../../services/inventario.service';
import { BicicletaService } from '../../services/bicicleta.service';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
})
export class InventarioComponent implements OnInit {
  inventarioJerarquico: any = {};

  // Arreglo original intacto
  catalogoDetallado: any[] = [];
  // Arreglo que se mostrará en la tabla (filtrado)
  catalogoFiltrado: any[] = [];

  cargando: boolean = true;

  // --- VARIABLES PARA LOS FILTROS ---
  filtros = {
    tipo: '',
    modelo: '',
    fechaInicio: '',
    fechaFin: '',
  };

  // Métricas...
  totalStockGlobal: number = 0;
  totalCategoriasActivas: number = 0;
  totalMarcas: number = 0;
  referenciasUnicas: number = 0;

  constructor(
    private inventarioService: InventarioService,
    private bicicletaService: BicicletaService,
    private router: Router,
    private cdr: ChangeDetectorRef, // <--- LO INYECTAMOS AQUÍ
  ) {}

  ngOnInit(): void {
    this.cargando = true;

    // Cargamos todo
    this.inventarioService.obtenerJerarquico().subscribe({
      next: (data) => {
        this.inventarioJerarquico = data;
        this.calcularMetricas();
        this.cargarDetalleMaestro(); // Este método apagará el "cargando" al terminar

        this.cdr.detectChanges(); // 🔥 PELLIZCO 1: Actualiza las tarjetas de métricas rápido
      },
      error: (err) => {
        console.error('Error cargando inventario jerárquico', err);
        this.cargando = false;
        this.cdr.detectChanges(); // Apagamos carga si hay error
      },
    });
  }

  cargarDetalleMaestro() {
    this.bicicletaService.listarBicicletas().subscribe({
      next: (data) => {
        this.catalogoDetallado = data;
        this.catalogoFiltrado = data; // Al inicio, mostramos todo
        this.referenciasUnicas = data.length;
        this.cargando = false;

        this.cdr.detectChanges(); // 🔥 PELLIZCO 2: Muestra la tabla de inventario al instante
      },
      error: (err) => {
        console.error('Error cargando catálogo maestro', err);
        this.cargando = false;
        this.cdr.detectChanges(); // Apagamos carga si hay error
      },
    });
  }

  // ================= MOTOR DE FILTROS =================
  aplicarFiltros() {
    this.catalogoFiltrado = this.catalogoDetallado.filter((item) => {
      // 1. Filtro por Tipo
      const cumpleTipo = this.filtros.tipo ? item.tipo === this.filtros.tipo : true;

      // 2. Filtro por Modelo o Marca
      const termino = this.filtros.modelo.toLowerCase();
      const cumpleModeloOMarca = this.filtros.modelo
        ? item.modelo.toLowerCase().includes(termino) || item.marca.toLowerCase().includes(termino)
        : true;

      // 3. Filtro Estricto por Fechas
      let cumpleFecha = true;
      if (this.filtros.fechaInicio && this.filtros.fechaFin) {
        // Buscamos la fecha en los nombres más comunes que suele mandar el Backend
        const fechaBackend = item.fechaRegistro || item.fechaCreacion || item.fecha;

        if (fechaBackend) {
          const fechaItem = new Date(fechaBackend);
          const inicio = new Date(this.filtros.fechaInicio);
          const fin = new Date(this.filtros.fechaFin);
          fin.setHours(23, 59, 59); // Para incluir todo el último día

          cumpleFecha = fechaItem >= inicio && fechaItem <= fin;
        } else {
          // Si hay fechas seleccionadas en el filtro, pero la bicicleta NO tiene fecha, la ocultamos
          cumpleFecha = false;
        }
      }

      return cumpleTipo && cumpleModeloOMarca && cumpleFecha;
    });

    this.cdr.detectChanges(); // 🔥 PELLIZCO 3: Hace que el filtrado de la tabla sea reactivo e instantáneo
  }

  limpiarFiltros() {
    this.filtros = { tipo: '', modelo: '', fechaInicio: '', fechaFin: '' };
    this.catalogoFiltrado = [...this.catalogoDetallado]; // Restauramos la tabla

    this.cdr.detectChanges(); // 🔥 PELLIZCO 4: Al limpiar, la tabla vuelve a su estado original sin lag
  }

  // ================= NAVEGACIÓN A REPORTES =================
  irAReportes() {
    // Viajamos a la ruta de reportes y le pasamos los datos que filtramos en memoria
    this.router.navigate(['/admin/reportes'], {
      state: { datosFiltrados: this.catalogoFiltrado },
    });
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  calcularMetricas() {
    this.totalStockGlobal = 0;
    const categorias = this.objectKeys(this.inventarioJerarquico);
    this.totalCategoriasActivas = categorias.length;
    let marcasUnicas = new Set<string>();

    categorias.forEach((cat) => {
      const marcas = this.objectKeys(this.inventarioJerarquico[cat]);
      marcas.forEach((marca) => {
        this.totalStockGlobal += this.inventarioJerarquico[cat][marca];
        marcasUnicas.add(marca);
      });
    });
    this.totalMarcas = marcasUnicas.size;
  }

  agregarStock() {
    // Restauramos tu flujo original: simplemente viaja a la gestión de bicicletas
    this.router.navigate(['/bicicletas']);
  }
}
