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
  cargando = true;
  mensajeError = '';

  constructor(private inventarioService: InventarioService) {}

  ngOnInit(): void {
    this.cargarInventario();
  }

  cargarInventario() {
    this.cargando = true;
    this.mensajeError = '';
    this.inventarioService.listarInventario().subscribe({
      next: (data: any) => {
        this.inventario = Array.isArray(data) ? data : [];
        this.cargando = false;
      },
      error: (err: any) => {
        this.mensajeError = 'Error al cargar inventario: ' + (err?.message || 'servidor no disponible');
        this.cargando = false;
      }
    });
  }

  totalStock(): number {
    return this.inventario.reduce((acc, item) => acc + (item.stock || 0), 0);
  }
}
