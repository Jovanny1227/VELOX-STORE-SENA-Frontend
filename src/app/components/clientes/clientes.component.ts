import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[] = [];
  nuevoCliente: Cliente = { documento: '', nombre: '', telefono: '' };
  mensaje = '';
  mensajeError = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

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
      error: () => this.mensajeError = 'Error al registrar cliente. Verifique los datos.'
    });
  }
}
