import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Venta } from '../../../models/venta.model';

@Component({
  selector: 'app-venta-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './venta-list.component.html',
  styleUrls: ['./venta-list.component.css'],
})
export class VentaListComponent {
  @Input() ventas: Venta[] = [];
  @Output() onEliminar = new EventEmitter<number>();
}
