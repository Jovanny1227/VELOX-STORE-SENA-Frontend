import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../../services/cliente.service'; //
import { Cliente } from '../../models/cliente.model'; //
import { ClienteFormComponent } from './cliente-form/cliente-form.component';
import { ClienteListComponent } from './cliente-list/cliente-list.component';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, ClienteFormComponent, ClienteListComponent],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];
  clienteEditando: Cliente | null = null;
  mensaje = '';
  mensajeError = '';

  constructor(private clienteService: ClienteService,
  private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clienteService.listarClientes().subscribe({
      next: (data) => {
        // Guardamos los datos
        this.clientes = data;

        // ¡Despertamos a Angular para que dibuje al instante!
        this.cdr.detectChanges();
      },
      error: () => (this.mensajeError = 'Error al cargar los clientes')
    });
  }

  registrarCliente(cliente: Cliente) {
    this.clienteService.registrarCliente(cliente).subscribe({
      next: () => {
        this.mensaje = 'Cliente registrado correctamente';
        this.cargarClientes();
      },
      error: () => (this.mensajeError = 'Error al registrar cliente'),
    });
  }

  actualizarCliente(cliente: Cliente) {
    if (!cliente.clienteId) return;
    this.clienteService.actualizarCliente(cliente.clienteId, cliente).subscribe({
      next: () => {
        this.mensaje = 'Cliente actualizado correctamente';
        this.clienteEditando = null;
        this.cargarClientes();
      },
      error: () => (this.mensajeError = 'Error al actualizar cliente'),
    });
  }

  eliminarCliente(id: number) {
    if (!confirm('Confirmar eliminación')) return;
    this.clienteService.eliminarCliente(id).subscribe({
      next: () => this.cargarClientes(),
      error: () => (this.mensajeError = 'Error al eliminar cliente'),
    });
  }
}
