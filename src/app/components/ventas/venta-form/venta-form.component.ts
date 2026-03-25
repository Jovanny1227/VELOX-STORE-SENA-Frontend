import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../../models/cliente.model';

export interface ItemCarrito {
  codigoBicicleta: string;
  marcaModelo: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

@Component({
  selector: 'app-venta-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './venta-form.component.html',
  styleUrls: ['./venta-form.component.css'],
})
export class VentaFormComponent {
  @Input() clientes: Cliente[] = [];
  @Input() bicicletas: any[] = [];
  @Input() cargando: boolean = false;
  @Input() mensajeExito: string = '';
  @Input() mensajeError: string = '';

  @Output() onRegistrarVenta = new EventEmitter<any>();

  clienteSeleccionado: number | null = null;
  bicicletaSeleccionada: string = '';
  cantidad: number = 1;
  carrito: ItemCarrito[] = [];

  get totalCarrito(): number {
    return this.carrito.reduce((sum, i) => sum + i.subtotal, 0);
  }

  agregarAlCarrito() {
    if (!this.bicicletaSeleccionada || this.cantidad < 1) return;

    const bici = this.bicicletas.find(b => b.codigo === this.bicicletaSeleccionada);
    if (!bici) return;

    const existente = this.carrito.find(i => i.codigoBicicleta === this.bicicletaSeleccionada);
    if (existente) {
      existente.cantidad += this.cantidad;
      existente.subtotal = existente.precio * existente.cantidad;
    } else {
      this.carrito.push({
        codigoBicicleta: bici.codigo,
        marcaModelo: bici.marca + ' ' + bici.modelo,
        precio: bici.precio,
        cantidad: this.cantidad,
        subtotal: bici.precio * this.cantidad,
      });
    }
    this.bicicletaSeleccionada = '';
    this.cantidad = 1;
  }

  quitarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
  }

  enviar() {
    if (!this.clienteSeleccionado || this.carrito.length === 0) return;

    const items = this.carrito.map(i => ({
      codigoBicicleta: i.codigoBicicleta,
      cantidad: i.cantidad,
    }));

    this.onRegistrarVenta.emit({ clienteId: this.clienteSeleccionado, items });

    this.clienteSeleccionado = null;
    this.bicicletaSeleccionada = '';
    this.cantidad = 1;
    this.carrito = [];
  }
}
