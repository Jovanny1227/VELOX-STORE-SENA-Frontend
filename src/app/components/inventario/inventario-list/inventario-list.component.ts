import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inventario-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventario-list.component.html',
  styleUrls: ['./inventario-list.component.css'],
})
export class InventarioListComponent {
  @Input() inventario: any[] = [];
  // Aunque ya no lo usemos tanto aquí (porque lo separamos en el padre),
  // es bueno dejarlo por si necesitas mostrarlo todo junto
  @Input() movimientos: any[] = [];
}
