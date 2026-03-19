import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../services/venta.service';
import { ClienteService } from '../../services/cliente.service';
import { BicicletaService } from '../../services/bicicleta.service';
import { Cliente } from '../../models/cliente.model';
import { Bicicleta } from '../../models/bicicleta.model';
import { Venta } from '../../models/venta.model';

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
  ventas: Venta[] = [];

  clienteSeleccionado: number | null = null;
  bicicletaSeleccionada: string = '';
  cantidad: number = 1;

  cargando = false;
  mensajeExito = '';
  mensajeError = '';

  constructor(
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private bicicletaService: BicicletaService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.clienteService.listarClientes().subscribe({
      next: data => this.clientes = data,
      error: () => this.mensajeError = 'Error al cargar clientes'
    });
    this.bicicletaService.listarBicicletas().subscribe({
      next: data => this.bicicletas = data,
      error: () => this.mensajeError = 'Error al cargar bicicletas'
    });
    this.ventaService.listarVentas().subscribe({
      next: data => this.ventas = data,
      error: () => {}
    });
  }

  registrarVenta() {
    if (!this.clienteSeleccionado || !this.bicicletaSeleccionada || this.cantidad < 1) return;
    this.cargando = true;
    this.mensajeExito = '';
    this.mensajeError = '';
    this.ventaService.registrarVenta(this.clienteSeleccionado, this.bicicletaSeleccionada, this.cantidad).subscribe({
      next: () => {
        this.mensajeExito = 'Venta registrada correctamente';
        this.clienteSeleccionado = null;
        this.bicicletaSeleccionada = '';
        this.cantidad = 1;
        this.cargando = false;
        this.ventaService.listarVentas().subscribe(data => this.ventas = data);
      },
      error: err => {
        this.mensajeError = err.error || 'Error al registrar venta';
        this.cargando = false;
      }
    });
  }
}
