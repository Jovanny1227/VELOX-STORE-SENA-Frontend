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
  clientes: any[] = [];
  busquedaCliente: string = '';
  clienteSeleccionado: any = null;

  catalogoBicicletas: any[] = [];
  filtroMarca: string = '';
  filtroTipo: string = '';
  filtroModelo: string = '';

  carritoPos: any[] = [];

  constructor(
    private clienteService: ClienteService,
    private bicicletaService: BicicletaService,
    private ventaService: VentaService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.clienteService.listar().subscribe((data: any) => {
      this.clientes = data;
      this.cdr.detectChanges(); 
    });
    this.cargarBicicletas();
  }

  cargarBicicletas() {
    this.bicicletaService.listarBicicletas().subscribe((data: any) => {
      this.catalogoBicicletas = data;
      this.cdr.detectChanges(); 
    });
  }

  get clientesFiltrados() {
    if (!this.busquedaCliente.trim()) return [];
    return this.clientes.filter((c: any) => c.documento.includes(this.busquedaCliente));
  }

  seleccionarCliente(cliente: any) {
    this.clienteSeleccionado = cliente;
    this.busquedaCliente = '';
    this.cdr.detectChanges(); 
  }

  quitarCliente() {
    this.clienteSeleccionado = null;
    this.cdr.detectChanges(); 
  }

  get marcasDisponibles() {
    return [...new Set(this.catalogoBicicletas.map((b) => b.marca))];
  }
  get tiposDisponibles() {
    return [...new Set(this.catalogoBicicletas.map((b) => b.tipo))];
  }

  get bicicletasFiltradas() {
    const modeloTerm = this.filtroModelo.toLowerCase().trim();

    return this.catalogoBicicletas.filter((b) => {
      if (b.stock <= 0) return false;

      const matchMarca = !this.filtroMarca || b.marca === this.filtroMarca;
      const matchTipo = !this.filtroTipo || b.tipo === this.filtroTipo;
      const matchModelo = !modeloTerm || b.modelo.toLowerCase().includes(modeloTerm);
      return matchMarca && matchTipo && matchModelo;
    });
  }

  agregarAlCarrito(bici: any) {
    const existe = this.carritoPos.find((i) => i.codigoBicicleta === bici.codigo);

    if (existe) {
      if (existe.cantidad < bici.stock) {
        existe.cantidad++;
        this.recalcularSubtotal(existe);
      } else {
        alert(`Máximo stock alcanzado (${bici.stock})`);
      }
    } else {
      this.carritoPos.push({
        codigoBicicleta: bici.codigo,
        modelo: bici.modelo,
        precio: bici.precio,
        cantidad: 1,
        stockMaximo: bici.stock, 
        subtotal: bici.precio,
      });
    }
    this.cdr.detectChanges(); 
  }

  validarCantidad(item: any) {
    if (item.cantidad < 1) {
      item.cantidad = 1;
      alert('La cantidad mínima es 1');
    } else if (item.cantidad > item.stockMaximo) {
      item.cantidad = item.stockMaximo;
      alert(`Solo hay ${item.stockMaximo} unidades disponibles en inventario`);
    }
    this.recalcularSubtotal(item);
  }

  recalcularSubtotal(item: any) {
    item.subtotal = item.cantidad * item.precio;
    this.cdr.detectChanges(); 
  }

  quitarDelCarrito(index: number) {
    this.carritoPos.splice(index, 1);
    this.cdr.detectChanges(); 
  }

  getTotal() {
    return this.carritoPos.reduce((acc, item) => acc + item.subtotal, 0);
  }

  registrarVenta() {
    if (this.carritoPos.length === 0) return;

    const payload = {
      usuarioId: 1,
      items: this.carritoPos.map((i) => ({
        codigoBicicleta: i.codigoBicicleta,
        cantidad: i.cantidad,
      })),
      clienteId: this.clienteSeleccionado ? this.clienteSeleccionado.clienteId : null,
      tipoVenta: 'PRESENCIAL',
    };

    this.ventaService.registrarVentaMultiple(payload).subscribe({
      next: (res: any) => {
        alert('Venta procesada con éxito');
        this.carritoPos = [];
        this.clienteSeleccionado = null;
        this.cargarBicicletas(); 
        this.cdr.detectChanges(); 
      },
      error: (err: any) => alert('Error al registrar la venta'),
    });
  }
}