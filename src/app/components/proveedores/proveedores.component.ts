import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovimientoService } from '../../services/movimiento.service';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {

  proveedores: any[] = [];
  movimientos: any[] = [];
  proveedorSeleccionado: any = null;
  nuevoProveedor: any = { nombre: '', nit: '', telefono: '', email: '' };
  mensaje = '';
  mensajeError = '';

  constructor(private movimientoService: MovimientoService) {}

  ngOnInit(): void {
    this.cargarProveedores();
    this.cargarMovimientos();
  }

  cargarProveedores() {
    this.movimientoService.listarProveedores().subscribe({
      next: data => this.proveedores = Array.isArray(data) ? data : [],
      error: () => this.mensajeError = 'Error al cargar proveedores'
    });
  }

  cargarMovimientos() {
    this.movimientoService.listarMovimientos().subscribe({
      next: data => this.movimientos = Array.isArray(data) ? data : [],
      error: () => {}
    });
  }

  registrarProveedor() {
    this.mensaje = '';
    this.mensajeError = '';
    if (!this.nuevoProveedor.nombre) {
      this.mensajeError = 'El nombre es obligatorio';
      return;
    }
    this.movimientoService.registrarProveedor(this.nuevoProveedor).subscribe({
      next: () => {
        this.mensaje = 'Proveedor registrado correctamente';
        this.nuevoProveedor = { nombre: '', nit: '', telefono: '', email: '' };
        this.cargarProveedores();
      },
      error: () => this.mensajeError = 'Error al registrar proveedor'
    });
  }

  seleccionarProveedor(p: any) {
    this.proveedorSeleccionado = this.proveedorSeleccionado?.idProveedor === p.idProveedor ? null : p;
  }

  getMovimientosProveedor(idProveedor: number): any[] {
    return this.movimientos.filter(m => m.proveedor?.idProveedor === idProveedor && m.tipo === 'ENTRADA');
  }

  getTotalEntradas(idProveedor: number): number {
    return this.getMovimientosProveedor(idProveedor).reduce((acc, m) => acc + m.cantidad, 0);
  }

  getTotalValor(idProveedor: number): number {
    return this.getMovimientosProveedor(idProveedor).reduce((acc, m) => acc + (m.cantidad * (m.precioUnitario || 0)), 0);
  }
}
