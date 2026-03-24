import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cliente } from '../../../models/cliente.model'; //
import { Bicicleta } from '../../../models/bicicleta.model'; //

@Component({
  selector: 'app-venta-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './venta-form.component.html',
  styleUrls: ['./venta-form.component.css'],
})
export class VentaFormComponent {
  @Input() clientes: Cliente[] = [];
  @Input() bicicletas: Bicicleta[] = [];
  @Input() cargando: boolean = false;
  @Input() mensajeExito: string = '';
  @Input() mensajeError: string = '';

  @Output() onRegistrarVenta = new EventEmitter<any>();

  clienteSeleccionado: number | null = null;
  bicicletaSeleccionada: string = '';
  cantidad: number = 1;

  enviar() {
    this.onRegistrarVenta.emit({
      clienteId: this.clienteSeleccionado,
      codigoBicicleta: this.bicicletaSeleccionada,
      cantidad: this.cantidad,
    });
    // Reset local
    this.clienteSeleccionado = null;
    this.bicicletaSeleccionada = '';
    this.cantidad = 1;
  }
}
