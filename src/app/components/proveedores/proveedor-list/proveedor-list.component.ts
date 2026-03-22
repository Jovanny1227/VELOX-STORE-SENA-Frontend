import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proveedor-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proveedor-list.component.html',
  styleUrls: ['./proveedor-list.component.css'],
})
export class ProveedorListComponent {
  @Input() proveedores: any[] = [];
  @Output() onEliminar = new EventEmitter<number>();
}
