import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioService } from '../../services/inventario.service';
import { MovimientoService } from '../../services/movimiento.service';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
})
export class InventarioComponent implements OnInit {
  // Variables que el HTML está esperando para mostrar
  stockTotal: number = 0;
  stockPorTipo: any = { MTB: 0, RUTA: 0, URBANO: 0, BMX: 0 };

  entradas: any[] = [];
  salidas: any[] = [];

  constructor(
    private inventarioService: InventarioService,
    private movimientoService: MovimientoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarDashboard();
    this.cargarMovimientos();
  }

  cargarDashboard() {
    this.inventarioService.dashboardInventario().subscribe({
      next: (data: any) => {
        if (data) {
          // Aquí guardamos el JSON {MTB: 10, stockTotal: 10}
          this.stockTotal = data.stockTotal || 0;
          this.stockPorTipo = {
            MTB: data.MTB || 0,
            RUTA: data.RUTA || 0,
            URBANO: data.URBANO || 0,
            BMX: data.BMX || 0,
          };
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error al cargar dashboard', err),
    });
  }

  cargarMovimientos() {
    this.movimientoService.listarMovimientos().subscribe({
      next: (data: any[]) => {
        if (data && data.length > 0) {
          // Aquí filtramos el JSON de movimientos para separarlos en las dos columnas
          this.entradas = data.filter(
            (m) => m.tipo === 'ENTRADA' || m.tipo === 'AJUSTE_POSITIVO' || m.tipo === 'DEVOLUCION',
          );
          this.salidas = data.filter(
            (m) => m.tipo === 'SALIDA_VENTA' || m.tipo === 'AJUSTE_NEGATIVO',
          );
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error al cargar movimientos', err),
    });
  }
}
