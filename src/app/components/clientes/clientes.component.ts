import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: any[] = [];
  nuevoCliente: any = { documento: '', nombre: '', telefono: '' };
  clienteEditando: any = null;
  mensaje = '';
  mensajeError = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void { this.cargarClientes(); }

  cargarClientes() {
    this.clienteService.listarClientes().subscribe({
      next: data => this.clientes = data,
      error: () => this.mensajeError = 'Error al cargar clientes'
    });
  }

  registrarCliente() {
    this.mensaje = '';
    this.mensajeError = '';
    this.clienteService.registrarCliente(this.nuevoCliente).subscribe({
      next: () => {
        this.mensaje = 'Cliente registrado correctamente';
        this.nuevoCliente = { documento: '', nombre: '', telefono: '' };
        this.cargarClientes();
      },
      error: () => this.mensajeError = 'Error al registrar cliente'
    });
  }

  editarCliente(c: any) {
    this.clienteEditando = { ...c };
  }

  guardarEdicion() {
    this.mensaje = '';
    this.mensajeError = '';
    this.clienteService.actualizarCliente(this.clienteEditando.clienteId, this.clienteEditando).subscribe({
      next: () => {
        this.mensaje = 'Cliente actualizado correctamente';
        this.clienteEditando = null;
        this.cargarClientes();
      },
      error: () => this.mensajeError = 'Error al actualizar cliente'
    });
  }

  cancelarEdicion() {
    this.clienteEditando = null;
  }

  eliminarCliente(id: number) {
    if (!confirm('Confirmar eliminacion')) return;
    this.clienteService.eliminarCliente(id).subscribe({
      next: () => this.cargarClientes(),
      error: () => this.mensajeError = 'Error al eliminar cliente'
    });
  }
}
