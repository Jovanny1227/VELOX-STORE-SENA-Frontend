import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaService } from '../../services/venta.service'; //
import { ClienteService } from '../../services/cliente.service'; //
import { BicicletaService } from '../../services/bicicleta.service'; //
import { VentaFormComponent } from './venta-form/venta-form.component';
import { VentaListComponent } from './venta-list/venta-list.component';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, VentaFormComponent, VentaListComponent],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css'],
})
export class VentasComponent implements OnInit {
  clientes: any[] = [];
  bicicletas: any[] = [];
  ventas: any[] = [];
  cargando = false;
  mensajeExito = '';
  mensajeError = '';

  constructor(
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private bicicletaService: BicicletaService,
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.clienteService.listarClientes().subscribe((data) => (this.clientes = data));
    this.bicicletaService.listarBicicletas().subscribe((data) => (this.bicicletas = data));
    this.ventaService.listarVentas().subscribe((data) => (this.ventas = data));
  }

  procesarVenta(datos: any) {
    this.cargando = true;
    this.mensajeExito = '';
    this.mensajeError = '';
    this.ventaService.registrarVenta(datos.clienteId, datos.codigoBici, datos.cantidad).subscribe({
      next: () => {
        this.mensajeExito = 'Venta registrada correctamente';
        this.cargando = false;
        this.cargarDatos();
      },
      error: (err) => {
        this.mensajeError = err.error || 'Error al registrar venta';
        this.cargando = false;
      },
    });
  }

  eliminarVenta(id: number) {
    if (!confirm('¿Eliminar esta venta?')) return;
    this.ventaService.eliminarVenta(id).subscribe(() => this.cargarDatos());
  }
}
