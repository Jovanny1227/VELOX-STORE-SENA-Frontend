import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaService } from '../../services/venta.service';
import { ClienteService } from '../../services/cliente.service';
import { InventarioService } from '../../services/inventario.service';

@Component({
  selector: 'app-caja-pos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './caja-pos.component.html',
  styleUrls: ['./caja-pos.component.css']
})
export class CajaPosComponent implements OnInit {
  productos: any[] = [];
  carrito: any[] = [];
  clientes: any[] = [];
  clienteSeleccionadoId: number | null = null;
  codigoBusqueda: string = '';
  total: number = 0;
  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private inventarioService: InventarioService
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarInventario();
  }

  cargarClientes() {
    this.clienteService.getClientes().subscribe({
      next: (data) => this.clientes = data,
      error: (err) => console.error('Error al cargar clientes', err)
    });
  }

  cargarInventario() {
    this.inventarioService.getInventario().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error al cargar inventario', err)
    });
  }

  buscarProducto() {
    const producto = this.productos.find(p => p.bicicleta.codigo === this.codigoBusqueda);
    if (producto) {
      this.agregarAlCarrito(producto.bicicleta);
      this.codigoBusqueda = ''; 
    } else {
      this.mensajeError = 'Producto no encontrado o sin inventario';
      setTimeout(() => this.mensajeError = '', 3000);
    }
  }

  agregarAlCarrito(bicicleta: any) {
    const itemExistente = this.carrito.find(item => item.codigoBicicleta === bicicleta.codigo);
    if (itemExistente) {
      itemExistente.cantidad++;
      itemExistente.subtotal = itemExistente.cantidad * bicicleta.precio;
    } else {
      this.carrito.push({
        codigoBicicleta: bicicleta.codigo,
        modelo: bicicleta.modelo,
        precio: bicicleta.precio,
        cantidad: 1,
        subtotal: bicicleta.precio
      });
    }
    this.calcularTotal();
  }

  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.carrito.reduce((acc, item) => acc + item.subtotal, 0);
  }

  procesarVenta() {
    if (this.carrito.length === 0) {
      this.mensajeError = 'El carrito está vacío';
      return;
    }
    
    // Obtenemos el usuario autenticado (Si tienes auth usa el token, sino dejamos un 1 por defecto)
    const usuarioString = localStorage.getItem('usuario');
    const usuarioId = usuarioString ? JSON.parse(usuarioString).idUsuario : 1; 

    // Aquí se arma el objeto exacto que el backend espera
    const payload = {
      items: this.carrito.map(item => ({
        codigoBicicleta: item.codigoBicicleta,
        cantidad: item.cantidad
      })),
      tipoVenta: 'PRESENCIAL',
      clienteId: this.clienteSeleccionadoId // AQUÍ ENVIAMOS EL CLIENTE SELECCIONADO
    };

    this.ventaService.registrarVentaPos(Number(usuarioId), payload).subscribe({
      next: (res) => {
        this.mensajeExito = 'Venta registrada con éxito!';
        this.carrito = [];
        this.clienteSeleccionadoId = null; // Limpiamos el cliente para la próxima venta
        this.calcularTotal();
        this.cargarInventario(); 
        setTimeout(() => this.mensajeExito = '', 3000);
      },
      error: (err) => {
        this.mensajeError = err.error?.message || 'Error al registrar la venta';
        setTimeout(() => this.mensajeError = '', 3000);
      }
    });
  }
}
