import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.clienteService.listarClientes().subscribe((data) => {
      this.clientes = data;
      this.cdr.detectChanges(); // Despierta al cargar clientes
    });

    this.bicicletaService.listarBicicletas().subscribe((data) => {
      this.bicicletas = data;
      this.cdr.detectChanges(); // Despierta al cargar bicicletas
    });

    this.ventaService.listarVentas().subscribe((data) => {
      this.ventas = data;
      this.cdr.detectChanges(); // Despierta al cargar el historial de ventas
    });
  }

  procesarVenta(datos: any) {
    // Evita enviar si ya está cargando
    if (this.cargando) return;

    this.cargando = true;
    this.mensajeExito = '';
    this.mensajeError = '';

    // Usa datos.codigoBicicleta
    this.ventaService
      .registrarVenta(datos.clienteId, datos.codigoBicicleta, datos.cantidad)
      .subscribe({
        next: () => {
          this.mensajeExito = 'Venta registrada correctamente';
          this.cargando = false;
          this.cargarDatos(); // Esto recargará las listas
        },
        error: (err) => {
          // Mejoramos la captura del error para depurar
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
    if (!confirm('¿Eliminar esta venta?')) return;
    this.ventaService.eliminarVenta(id).subscribe(() => this.cargarDatos());
  }
}
