import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bicicleta-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bicicleta-list.component.html',
  styleUrls: ['./bicicleta-list.component.css'],
})
export class BicicletaListComponent {
  @Input() bicicletas: any[] = [];
  @Input() inventario: any[] = [];

  @Output() onEliminar = new EventEmitter<number>();
  @Output() onActualizar = new EventEmitter<void>();

  imagenesMap: Record<string, string> = {
    MTB: 'assets/bikes/mtb.png',
    RUTA: 'assets/bikes/ruta.png',
    URBANO: 'assets/bikes/urbano.png',
    BMX: 'assets/bikes/bmx.png',
  };

  getStock(codigo: string): number {
    const item = this.inventario.find((i) => i.codigo === codigo);
    return item ? item.stock : 0;
  }

  getValorTotal(bici: any): number {
    return (bici.precio || 0) * this.getStock(bici.codigo);
  }

  getImagen(tipo: string): string {
    // El .toUpperCase() asegura que 'mtb' o 'Mtb' se conviertan en 'MTB'
    if (!tipo) return 'assets/bikes/mtb.png';
    return this.imagenesMap[tipo.toUpperCase()] || 'assets/bikes/mtb.png';
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar esta bicicleta y su inventario?')) {
      this.onEliminar.emit(id);
    }
  }

  actualizar() {
    this.onActualizar.emit();
  }
}
