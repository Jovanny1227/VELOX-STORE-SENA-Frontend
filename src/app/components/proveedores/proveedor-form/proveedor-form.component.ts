import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-proveedor-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedor-form.component.html',
  styleUrls: ['./proveedor-form.component.css'],
})
export class ProveedorFormComponent {
  @Input() mensaje: string = '';
  @Input() mensajeError: string = '';
  @Output() onRegistrar = new EventEmitter<any>();

  nuevoProveedor = { nombre: '', nit: '', telefono: '', email: '' };

  enviar() {
    this.onRegistrar.emit(this.nuevoProveedor);
    // Limpiar el formulario localmente
    this.nuevoProveedor = { nombre: '', contacto: '', direccion: '' };
  }
}

