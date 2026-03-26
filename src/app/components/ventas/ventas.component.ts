import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaService } from '../../services/venta.service';
import { ClienteService } from '../../services/cliente.service';
import { BicicletaService } from '../../services/bicicleta.service';
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
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.clienteService.listarClientes().subscribe((data) => {
      this.clientes = data;
      this.cdr.detectChanges();
    });
    this.bicicletaService.listarBicicletas().subscribe((data) => {
      this.bicicletas = data;
      this.cdr.detectChanges();
    });
    this.ventaService.listarVentas().subscribe((data) => {
      this.ventas = data;
      this.cdr.detectChanges();
    });
  }

  procesarVenta(datos: any) {
    if (this.cargando) return;
    this.cargando = true;
    this.mensajeExito = '';
    this.mensajeError = '';

    this.ventaService.registrarVentaMultiple(datos.clienteId, datos.items).subscribe({
      next: () => {
        this.mensajeExito = 'Venta registrada correctamente';
        this.cargando = false;
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error al vender:', err);
        if (typeof err.error === 'string') {
          this.mensajeError = err.error;
        } else if (err.error && err.error.message) {
          this.mensajeError = err.error.message;
        } else {
          this.mensajeError = 'Error al registrar venta';
        }
        this.cargando = false;
      },
    });
  }

  eliminarVenta(id: number) {
    if (!confirm('Eliminar esta venta?')) return;
    this.ventaService.eliminarVenta(id).subscribe(() => this.cargarDatos());
  }
}
