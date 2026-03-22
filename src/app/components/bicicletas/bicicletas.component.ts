import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BicicletaService } from '../../services/bicicleta.service';
import { MovimientoService } from '../../services/movimiento.service';
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
  proveedores: any[] = [];
  inventario: any[] = []; // ¡Añadido para corregir el error del HTML!
  mensaje = '';
  mensajeError = '';

  constructor(
    private bicicletaService: BicicletaService,
    private movimientoService: MovimientoService,
  ) {}

  ngOnInit(): void {
    this.cargarTodo();
  }

  cargarTodo() {
    this.bicicletaService.listarBicicletas().subscribe((data: any) => (this.bicicletas = data));
    this.movimientoService.listarProveedores().subscribe((data: any) => (this.proveedores = data));
    this.movimientoService.listarInventario().subscribe((data: any) => (this.inventario = data));
  }

  procesarRegistro(datos: any) {
    this.mensaje = '';
    this.mensajeError = '';

    this.bicicletaService
      .registrarBicicleta(datos.bicicleta, datos.stock, datos.idProveedor)
      .subscribe({
        next: (res: any) => {
          this.mensaje = '¡Bicicleta registrada con éxito!';
          this.cargarTodo();
        },
        error: (err: any) => {
          console.error(err);
          this.mensajeError = 'Error al registrar: verifica los datos.';
        },
      });
  }

  procesarEliminacion(id: number) {
    this.bicicletaService.eliminarBicicleta(id).subscribe({
      next: () => {
        this.mensaje = 'Eliminada correctamente';
        this.cargarTodo();
      },
      error: () => (this.mensajeError = 'No se puede eliminar (tiene existencias)'),
    });
  }
}
