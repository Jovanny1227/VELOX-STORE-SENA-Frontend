import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../../models/cliente.model'; //

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css'],
})
export class ClienteFormComponent {
  @Input() clienteEditando: Cliente | null = null;
  @Input() mensaje: string = '';
  @Input() mensajeError: string = '';

  @Output() onRegistrar = new EventEmitter<Cliente>();
  @Output() onGuardarEdicion = new EventEmitter<Cliente>();
  @Output() onCancelarEdicion = new EventEmitter<void>();

  nuevoCliente: Cliente = { documento: '', nombre: '', telefono: '' };

  registrar() {
    this.onRegistrar.emit(this.nuevoCliente);
    this.nuevoCliente = { documento: '', nombre: '', telefono: '' };
  }

  guardar() {
    if (this.clienteEditando) this.onGuardarEdicion.emit(this.clienteEditando);
  }

  cancelar() {
    this.onCancelarEdicion.emit();
  }
}
