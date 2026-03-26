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
}
