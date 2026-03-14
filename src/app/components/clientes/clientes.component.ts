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
    this.clienteService.listarClientes().subscribe({
      next: (data) => {
        this.clientes = data;
      },
      error: () => {
        this.mensaje = '❌ Error al cargar clientes';
      }
    });
  }

  registrarCliente() {

    const documento = this.nuevoCliente.documento.trim();
    const nombre = this.nuevoCliente.nombre.trim();
    const telefono = this.nuevoCliente.telefono.trim();

    if (!documento || !nombre || !telefono) {
      this.mensaje = '⚠️ Todos los campos son obligatorios';
      return;
    }

    this.clienteService.registrarCliente({
      documento,
      nombre,
      telefono
    }).subscribe({
      next: () => {

        this.mensaje = '✅ Cliente registrado correctamente';

        this.nuevoCliente = {
          documento: '',
          nombre: '',
          telefono: '',
        };

        this.cargarClientes();
      },

      error: (err) => {

        if (err.status === 400) {
          this.mensaje = err.error;
        } else {
          this.mensaje = '❌ Error al registrar cliente';
        }

      },
    });
  }
}
