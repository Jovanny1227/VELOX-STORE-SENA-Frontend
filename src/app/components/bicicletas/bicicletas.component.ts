import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BicicletaService } from '../../services/bicicleta.service';
import { MovimientoService } from '../../services/movimiento.service';
import { InventarioService } from '../../services/inventario.service';
import { BicicletaFormComponent } from './bicicleta-form/bicicleta-form.component';
import { BicicletaListComponent } from './bicicleta-list/bicicleta-list.component';

@Component({
  selector: 'app-bicicletas',
  standalone: true,
  imports: [CommonModule, BicicletaFormComponent, BicicletaListComponent],
  templateUrl: './bicicletas.component.html',
  styleUrls: ['./bicicletas.component.css'],
})
export class BicicletasComponent implements OnInit {
  bicicletas: any[] = [];
  inventario: any[] = [];
  proveedores: any[] = [];

  mensaje = '';
  mensajeError = '';

  constructor(
    private bicicletaService: BicicletaService,
    private movimientoService: MovimientoService,
    private inventarioService: InventarioService,
  ) {}

  ngOnInit(): void {
    this.cargarTodo();
  }

  cargarTodo() {
    this.cargarBicicletas();
    this.cargarProveedores();
    this.cargarInventario();
  }

  cargarBicicletas() {
    this.bicicletaService.listarBicicletas().subscribe({
      next: (data) => (this.bicicletas = data),
      error: () => (this.mensajeError = 'Error al cargar bicicletas'),
    });
  }

  cargarInventario() {
    this.inventarioService.listarInventario().subscribe({
      next: (data: any) => (this.inventario = Array.isArray(data) ? data : []),
      error: () => {},
    });
  }

  cargarProveedores() {
    this.movimientoService.listarProveedores().subscribe({
      next: (data) => (this.proveedores = Array.isArray(data) ? data : []),
      error: () => {},
    });
  }

  // Este método recibe los datos que emite el formulario hijo
procesarRegistro(datos: any) {
    this.mensaje = '';
    this.mensajeError = '';

    this.bicicletaService.registrarBicicleta(datos.bicicleta, datos.stock).subscribe({
      next: (bici: any) => {
        // ELIMINAMOS EL BLOQUE QUE LLAMABA A this.movimientoService.registrarMovimiento(...)
        // porque el backend ya lo hace automáticamente al registrar la bicicleta.

        this.mensaje = 'Bicicleta registrada correctamente';
        this.cargarBicicletas();
        this.cargarInventario(); // Recargamos para ver el stock real
      },
      error: () => (this.mensajeError = 'Error al registrar bicicleta'),
    });
  }

  // Este método recibe el ID que emite la lista hija
procesarEliminacion(id: number) {
    this.mensaje = '';
    this.mensajeError = '';

    this.bicicletaService.eliminarBicicleta(id).subscribe({
      next: () => {
        this.mensaje = 'Bicicleta eliminada';
        this.cargarBicicletas();
        this.cargarInventario();
      },
      error: (err) => {
        // ESTO ES CLAVE: Leer el mensaje de error que manda Spring Boot
        console.error("Error completo del backend:", err);

        // Si el backend manda un mensaje en err.error.message o err.error
        if (err.error && typeof err.error === 'string') {
           this.mensajeError = err.error;
        } else if (err.error && err.error.message) {
           this.mensajeError = err.error.message;
        } else {
           this.mensajeError = 'Error al eliminar bicicleta. Revisa la consola (F12).';
        }
      }
    });
  }
}
