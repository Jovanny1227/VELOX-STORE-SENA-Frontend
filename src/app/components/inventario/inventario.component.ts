import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../../services/inventario.service';
import { MovimientoService } from '../../services/movimiento.service';
import { FiltrarTipoPipe } from '../../pipes/filtrar-tipo.pipe';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, FiltrarTipoPipe],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  inventario: any[] = [];
  movimientos: any[] = [];
  cargando = false;
  mensajeError = '';
  vistaActiva: 'stock' | 'movimientos' = 'stock';

  constructor(
    private inventarioService: InventarioService,
    private movimientoService: MovimientoService
  ) {}

  ngOnInit(): void { this.cargarTodo(); }

  cargarTodo() {
    this.cargando = true;
    this.mensajeError = '';
    this.inventarioService.listarInventario().subscribe({
      next: (data: any) => {
        this.inventario = Array.isArray(data) ? data : [];
        this.cargando = false;
      },
      error: () => {
        this.mensajeError = 'Error al cargar inventario';
        this.cargando = false;
      }
    });
    this.movimientoService.listarMovimientos().subscribe({
      next: (data: any) => this.movimientos = Array.isArray(data) ? data : [],
      error: () => {}
    });
  }

  totalStock(): number {
    return this.inventario.reduce((acc, item) => acc + (item.stock || 0), 0);
  }

  totalValorInventario(): number {
    return this.inventario.reduce((acc, item) => acc + ((item.stock || 0) * (item.precio || 0)), 0);
  }

  getMovimientosPorTipo(tipo: string): any[] {
    return this.movimientos.filter(m => m.bicicleta?.tipo === tipo && m.tipo === 'ENTRADA');
  }

  getTiposUnicos(): string[] {
    return [...new Set(this.inventario.map((i: any) => i.tipo))];
  }

  getStockPorTipo(tipo: string): number {
    return this.inventario.filter((i: any) => i.tipo === tipo)
      .reduce((acc, i) => acc + (i.stock || 0), 0);
  }

  getValorPorTipo(tipo: string): number {
    return this.inventario.filter((i: any) => i.tipo === tipo)
      .reduce((acc, i) => acc + ((i.stock || 0) * (i.precio || 0)), 0);
  }

  getValorItem(item: any): number {
    return (item.stock || 0) * (item.precio || 0);
  }

  getNombreProveedor(mov: any): string {
    return mov.proveedor?.nombre || 'Sin proveedor';
  }
}
