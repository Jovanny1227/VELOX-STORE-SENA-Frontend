import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { BicicletaService } from '../../services/bicicleta.service';
import { VentaService } from '../../services/venta.service';
import { Cliente } from '../../models/cliente.model';
import { Bicicleta } from '../../models/bicicleta.model';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {

  clientes: Cliente[] = [];
  bicicletas: Bicicleta[] = [];

  clienteSeleccionado: number | null = null;
  bicicletaSeleccionada: string = '';
  cantidad: number = 1;

  mensajeExito: string = '';
  mensajeError: string = '';
  cargando: boolean = false;

  constructor(
    private clienteService: ClienteService,
    private bicicletaService: BicicletaService,
    private ventaService: VentaService
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarBicicletas();
  }

  cargarClientes() {
    this.clienteService.listarClientes().subscribe({
      next: data => this.clientes = data,
      error: () => this.mensajeError = 'Error al cargar clientes'
    });
  }

  cargarBicicletas() {
    this.bicicletaService.listarBicicletas().subscribe({
      next: data => this.bicicletas = data,
      error: () => this.mensajeError = 'Error al cargar bicicletas'
    });
  }

  registrarVenta() {
    this.mensajeExito = '';
    this.mensajeError = '';

    if (!this.clienteSeleccionado || !this.bicicletaSeleccionada || this.cantidad <= 0) {
      this.mensajeError = '❌ Debes seleccionar cliente, bicicleta y cantidad válida';
      return;
    }

    this.cargando = true;
    this.ventaService.registrarVenta(
      this.clienteSeleccionado,
      this.bicicletaSeleccionada,
      this.cantidad
    ).subscribe({
      next: () => {
        this.mensajeExito = '✅ Venta registrada correctamente';
        this.cantidad = 1;
        this.clienteSeleccionado = null;
        this.bicicletaSeleccionada = '';
        this.cargando = false;
      },
      error: err => {
        this.mensajeError = '❌ Error al registrar venta: ' + (err.error?.message || err.message);
        this.cargando = false;
      }
    });
  }

}
