import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { BicicletaService } from '../../services/bicicleta.service';
import { VentaService } from '../../services/venta.service';

@Component({
  selector: 'app-caja-pos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './caja-pos.component.html',
  styleUrls: ['./caja-pos.component.css'],
})
export class CajaPosComponent implements OnInit {
  // Variables EXACTAS que pide el HTML
  mensajeExito: string = '';
  mensajeError: string = '';
  clienteSeleccionadoId: number | null = null;
  codigoBusqueda: string = '';
  carrito: any[] = [];
  total: number = 0;

  // Variables auxiliares para los datos
  clientes: any[] = [];
  catalogoBicicletas: any[] = [];

  constructor(
    private clienteService: ClienteService,
    private bicicletaService: BicicletaService,
    private ventaService: VentaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.clienteService.listar().subscribe({
      next: (data: any) => {
        this.clientes = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar clientes', err)
    });
    this.cargarBicicletas();
  }

  cargarBicicletas() {
    this.bicicletaService.listarBicicletas().subscribe({
      next: (data: any) => {
        this.catalogoBicicletas = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error al cargar inventario', err)
    });
  }

  // Método EXACTO que pide el HTML
  buscarProducto() {
    const productoEncontrado = this.catalogoBicicletas.find(
      (bici) => bici.codigo === this.codigoBusqueda.trim()
    );

    if (productoEncontrado) {
      if (productoEncontrado.stock > 0) {
        this.agregarAlCarrito(productoEncontrado);
        this.codigoBusqueda = ''; // Limpiar campo
      } else {
        this.mostrarError('El producto no tiene stock disponible.');
      }
    } else {
      this.mostrarError('Producto no encontrado con ese código.');
    }
  }

  agregarAlCarrito(bici: any) {
    const existe = this.carrito.find((i) => i.codigoBicicleta === bici.codigo);

    if (existe) {
      if (existe.cantidad < bici.stock) {
        existe.cantidad++;
        existe.subtotal = existe.cantidad * existe.precio;
      } else {
        this.mostrarError(`Máximo stock alcanzado (${bici.stock})`);
      }
    } else {
      this.carrito.push({
        codigoBicicleta: bici.codigo,
        modelo: bici.modelo,
        precio: bici.precio,
        cantidad: 1,
        stockMaximo: bici.stock,
        subtotal: bici.precio,
      });
    }
    this.calcularTotal();
  }

  // Método EXACTO que pide el HTML
  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.carrito.reduce((acc, item) => acc + item.subtotal, 0);
    this.cdr.detectChanges();
  }

  mostrarError(mensaje: string) {
    this.mensajeError = mensaje;
    setTimeout(() => {
      this.mensajeError = '';
      this.cdr.detectChanges();
    }, 3000);
    this.cdr.detectChanges();
  }

  mostrarExito(mensaje: string) {
    this.mensajeExito = mensaje;
    setTimeout(() => {
      this.mensajeExito = '';
      this.cdr.detectChanges();
    }, 3000);
    this.cdr.detectChanges();
  }

  // Método EXACTO que pide el HTML
  procesarVenta() {
    if (this.carrito.length === 0) {
      this.mostrarError('El carrito está vacío');
      return;
    }

    const payload = {
      usuarioId: 1, // ID del cajero temporal
      items: this.carrito.map((i) => ({
        codigoBicicleta: i.codigoBicicleta,
        cantidad: i.cantidad,
      })),
      clienteId: this.clienteSeleccionadoId,
      tipoVenta: 'PRESENCIAL',
    };

    this.ventaService.registrarVentaMultiple(payload).subscribe({
      next: (res: any) => {
        this.mostrarExito('Venta registrada con éxito!');
        this.carrito = [];
        this.clienteSeleccionadoId = null;
        this.codigoBusqueda = '';
        this.calcularTotal();
        this.cargarBicicletas(); // Refrescar el stock del catálogo
      },
      error: (err: any) => {
        this.mostrarError(err.error?.message || 'Error al registrar la venta');
      }
    });
  }
}