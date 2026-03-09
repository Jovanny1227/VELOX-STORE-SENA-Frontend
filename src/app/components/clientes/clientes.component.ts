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
  styleUrls: ['./clientes.component.css'],
})
export class ClientesComponent implements OnInit {
  clientes: Cliente[] = [];

  nuevoCliente: Cliente = {
    documento: '',
    nombre: '',
    telefono: '',
  };

  mensaje = '';

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes() {
    this.clienteService.listarClientes().subscribe((data) => {
      this.clientes = data;
    });
  }

  registrarCliente() {
    if (
      !this.nuevoCliente.documento.trim() ||
      !this.nuevoCliente.nombre.trim() ||
      !this.nuevoCliente.telefono.trim()
    ) {
      this.mensaje = '⚠️ Todos los campos son obligatorios';
      return;
    }

    this.clienteService.registrarCliente(this.nuevoCliente).subscribe({
      next: () => {
        this.mensaje = '✅ Cliente registrado';
        this.cargarClientes();

        this.nuevoCliente = {
          documento: '',
          nombre: '',
          telefono: '',
        };
      },
      error: () => {
        this.mensaje = '❌ Error al registrar cliente';
      },
    });
  }
}
