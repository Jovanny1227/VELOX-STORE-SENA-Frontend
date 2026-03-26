import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovimientoService } from '../../services/movimiento.service';
import { ProveedorFormComponent } from './proveedor-form/proveedor-form.component';
import { ProveedorListComponent } from './proveedor-list/proveedor-list.component';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, ProveedorFormComponent, ProveedorListComponent],
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
})
export class ProveedoresComponent implements OnInit {
  proveedores: any[] = [];
  mensaje = '';
  mensajeError = '';

  constructor(
    private movimientoService: MovimientoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.movimientoService.listarProveedores().subscribe({
      next: (data) => {
        this.proveedores = data;
        this.cdr.detectChanges(); // <-- Esto despierta a Angular instantáneamente
      },
      error: () => (this.mensajeError = 'Error al cargar proveedores'),
    });
  }
  registrarProveedor(proveedor: any) {
    this.mensaje = '';
    this.mensajeError = '';
    this.movimientoService.registrarProveedor(proveedor).subscribe({
      next: () => {
        this.mensaje = 'Proveedor registrado correctamente';
        this.cargarProveedores();
      },
      error: () => (this.mensajeError = 'Error al registrar proveedor'),
    });
  }

  eliminarProveedor(id: number) {
    if (!confirm('¿Eliminar este proveedor?')) return;
    this.movimientoService.eliminarProveedor(id).subscribe({
      next: () => this.cargarProveedores(),
      error: () => (this.mensajeError = 'Error al eliminar proveedor'),
    });
  }
}
