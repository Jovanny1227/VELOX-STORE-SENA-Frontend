import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BicicletaService } from '../../services/bicicleta.service';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
})
export class InventarioComponent implements OnInit {
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
    private bicicletaService: BicicletaService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargando = true;
    this.cargarDetalleMaestro();
  }

  cargarDetalleMaestro() {
    this.bicicletaService.listarBicicletas().subscribe({
      // 🔥 CORRECCIÓN: Le ponemos ": any" a data para que TypeScript no se queje en la línea 52
      next: (data: any) => {
        // Validación de seguridad
        const catalogoLimpio = Array.isArray(data) ? data : data?.content || [];

        this.catalogoDetallado = catalogoLimpio;
        this.catalogoFiltrado = catalogoLimpio;
        this.cargando = false;

        // Calcular métricas directamente de la lista maestra
        this.calcularMetricas(catalogoLimpio);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando catálogo maestro', err);
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  // ================= MOTOR DE FILTROS =================
  aplicarFiltros() {
    this.catalogoFiltrado = this.catalogoDetallado.filter((item) => {
      const cumpleTipo = this.filtros.tipo ? item.tipo === this.filtros.tipo : true;

      const termino = this.filtros.modelo.toLowerCase();
      const cumpleModeloOMarca = this.filtros.modelo
        ? (item.modelo && item.modelo.toLowerCase().includes(termino)) ||
          (item.marca && item.marca.toLowerCase().includes(termino))
        : true;

      let cumpleFecha = true;
      if (this.filtros.fechaInicio && this.filtros.fechaFin) {
        const fechaBackend = item.fechaRegistro || item.fechaCreacion || item.fecha;

        if (fechaBackend) {
          const fechaItem = new Date(fechaBackend);
          const inicio = new Date(this.filtros.fechaInicio);
          const fin = new Date(this.filtros.fechaFin);
          fin.setHours(23, 59, 59);

          cumpleFecha = fechaItem >= inicio && fechaItem <= fin;
        } else {
          cumpleFecha = false;
        }
      }

      return cumpleTipo && cumpleModeloOMarca && cumpleFecha;
    });

    this.cdr.detectChanges();
  }

  limpiarFiltros() {
    this.filtros = { tipo: '', modelo: '', fechaInicio: '', fechaFin: '' };
    this.catalogoFiltrado = [...this.catalogoDetallado];
    this.cdr.detectChanges();
  }

  // ================= NAVEGACIÓN A REPORTES =================
  irAReportes() {
    this.router.navigate(['/admin/reportes'], {
      state: { datosFiltrados: this.catalogoFiltrado },
    });
  }

  // 🔥 MÉTRICAS CALCULADAS DIRECTAMENTE DE LA LISTA MAESTRA 🔥
  calcularMetricas(listaBicicletas: any[]) {
    this.totalStockGlobal = 0;
    const categoriasUnicas = new Set<string>();
    const marcasUnicas = new Set<string>();

    listaBicicletas.forEach((bici) => {
      this.totalStockGlobal += bici.stock || 0;
      if (bici.tipo) categoriasUnicas.add(bici.tipo);
      if (bici.marca) marcasUnicas.add(bici.marca);
    });

    this.referenciasUnicas = listaBicicletas.length;
    this.totalCategoriasActivas = categoriasUnicas.size;
    this.totalMarcas = marcasUnicas.size;
  }

  agregarStock() {
    this.router.navigate(['/bicicletas']);
  }
}
