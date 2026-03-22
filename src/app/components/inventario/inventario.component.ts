import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { MovimientoService } from '../../services/movimiento.service';
import { InventarioListComponent } from './inventario-list/inventario-list.component';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, KeyValuePipe, InventarioListComponent],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
})
export class InventarioComponent implements OnInit {
  inventario: any[] = [];
  movimientos: any[] = [];
  totalExistencias: number = 0;
  stockPorTipo: Record<string, number> = {};

  constructor(
    private movimentoService: MovimientoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarTodo();
  }

  cargarTodo(): void {
    this.movimentoService.listarInventario().subscribe({
      next: (data: any[]) => {
        this.inventario = data;
        this.procesarResumen();
      },
    });

    this.movimentoService.listarMovimientos().subscribe({
      next: (data: any[]) => {
        this.movimientos = data;
        this.cdr.detectChanges();
      },
    });
  }

  procesarResumen(): void {
    // Cubrimos todas las opciones de nombre que puede tener el stock
    this.totalExistencias = this.inventario.reduce((acc: number, item: any) => {
      const cant = item.stock ?? item.cantidadDisponible ?? item.cantidad_disponible ?? 0;
      return acc + Number(cant);
    }, 0);

    this.stockPorTipo = {};
    this.inventario.forEach((item: any) => {
      const tipo = item.tipo || item.bicicleta?.tipo || 'OTRO';
      const cant = item.stock ?? item.cantidadDisponible ?? item.cantidad_disponible ?? 0;
      this.stockPorTipo[tipo] = (this.stockPorTipo[tipo] || 0) + Number(cant);
    });
    this.cdr.detectChanges();
  }

  getEntradas(): any[] {
    // Filtramos todo lo que NO sea salida. Así nos aseguramos de atraparlas
    // aunque el backend las llame "Ingreso" o algo distinto a "Entrada".
    return this.movimientos.filter((m: any) => {
      const tipo = m.tipo ? m.tipo.toUpperCase() : '';
      return !tipo.includes('SALIDA');
    });
  }

  getSalidas(): any[] {
    return this.movimientos.filter((m: any) => {
      const tipo = m.tipo ? m.tipo.toUpperCase() : '';
      return tipo.includes('SALIDA');
    });
  }
}
