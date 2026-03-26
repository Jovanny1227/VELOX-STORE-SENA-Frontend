import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bicicleta-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bicicleta-form.component.html',
  styleUrls: ['./bicicleta-form.component.css'],
})
export class BicicletaFormComponent {
  @Input() proveedores: any[] = [];
  @Input() mensaje: string = '';
  @Input() mensajeError: string = '';

  @Output() onRegistrar = new EventEmitter<any>();

  nuevaBicicleta: any = { marca: '', modelo: '', precio: 0, tipo: '' };
  stockInicial: number = 0;
  proveedorSeleccionado: number | null = null;

  emitirRegistro() {
    if (
      !this.nuevaBicicleta.marca ||
      !this.nuevaBicicleta.modelo ||
      !this.nuevaBicicleta.tipo ||
      this.nuevaBicicleta.precio <= 0
    ) {
      this.mensajeError = 'Complete todos los campos';
      return;
    }
    if (!this.proveedorSeleccionado) {
      this.mensajeError = 'Seleccione un proveedor';
      return;
    }


    this.nuevaBicicleta.proveedorId = this.proveedorSeleccionado;

    // Emitimos los datos al padre para que él se comunique con el backend
    this.onRegistrar.emit({
      bicicleta: this.nuevaBicicleta,
      stock: this.stockInicial,
      idProveedor: this.proveedorSeleccionado,
    });

    // Limpiamos el formulario después de enviar
    this.nuevaBicicleta = { marca: '', modelo: '', precio: 0, tipo: '' };
    this.stockInicial = 0;
    this.proveedorSeleccionado = null;
  }
}
