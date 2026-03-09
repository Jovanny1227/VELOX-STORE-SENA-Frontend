import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioService } from '../../services/inventario.service';
import { Inventario } from '../../models/inventario.model';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {

  inventario: Inventario[] = [];
  cargando = false;
  mensajeError = '';

  constructor(private inventarioService: InventarioService) {}

  ngOnInit(): void {
    this.cargarInventario();
  }

  cargarInventario() {
    this.cargando = true;
    this.inventarioService.listarInventario().subscribe({
      next: data => {
        this.inventario = data;
        this.cargando = false;
      },
      error: err => {
        this.mensajeError = 'Error al cargar inventario';
        this.cargando = false;
      }
    });
  }

}
