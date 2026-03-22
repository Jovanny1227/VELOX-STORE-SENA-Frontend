import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioService } from '../../services/inventario.service';
import { InventarioListComponent } from './inventario-list/inventario-list.component';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, InventarioListComponent],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css'],
})
export class InventarioComponent implements OnInit {
  inventario: any[] = [];

  constructor(private inventarioService: InventarioService) {}

  ngOnInit(): void {
    this.cargarInventario();
  }

  cargarInventario() {
    this.inventarioService.listarInventario().subscribe({
      next: (data: any) => (this.inventario = data),
      error: () => console.error('Error al cargar inventario'),
    });
  }
}
