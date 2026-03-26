import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bicicleta-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bicicleta-list.component.html',
  styleUrls: ['./bicicleta-list.component.css'],
})
export class BicicletaListComponent {
  @Input() bicicletas: any[] = [];
  @Input() inventario: any[] = [];

  @Output() onEliminar = new EventEmitter<number>();
  @Output() onActualizar = new EventEmitter<void>();

  filtroTexto: string = '';
  filtroTipo: string = '';

  imagenesMap: Record<string, string> = {
    MTB: 'assets/bikes/mtb.png',
    RUTA: 'assets/bikes/ruta.png',
    URBANO: 'assets/bikes/urbano.png',
    BMX: 'assets/bikes/bmx.png',
  };

  bicicletasFiltradas(): any[] {
    return this.bicicletas.filter(b => {
      const textoMatch = !this.filtroTexto ||
        b.marca?.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        b.modelo?.toLowerCase().includes(this.filtroTexto.toLowerCase());
      const tipoMatch = !this.filtroTipo || b.tipo === this.filtroTipo;
      return textoMatch && tipoMatch;
    });
  }

  getStock(codigo: string): number {
    const item = this.inventario.find((i) => i.codigo === codigo);
    return item ? item.stock : 0;
  }

  getValorTotal(bici: any): number {
    return (bici.precio || 0) * this.getStock(bici.codigo);
  }

  getImagen(tipo: string): string {
    if (!tipo) return 'assets/bikes/mtb.png';
    return this.imagenesMap[tipo.toUpperCase()] || 'assets/bikes/mtb.png';
  }

  eliminar(id: number) {
    if (confirm('Eliminar esta bicicleta y su inventario?')) {
      this.onEliminar.emit(id);
    }
  }

  actualizar() {
    this.onActualizar.emit();
  }
}
