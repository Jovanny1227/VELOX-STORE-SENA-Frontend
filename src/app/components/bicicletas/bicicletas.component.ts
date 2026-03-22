import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BicicletaService } from '../../services/bicicleta.service';
import { MovimientoService } from '../../services/movimiento.service';
import { InventarioService } from '../../services/inventario.service';

@Component({
  selector: 'app-bicicletas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bicicletas.component.html',
  styleUrls: ['./bicicletas.component.css']
})
export class BicicletasComponent implements OnInit {

  bicicletas: any[] = [];
  inventario: any[] = [];
  proveedores: any[] = [];
  stockInicial: number = 0;
  proveedorSeleccionado: number | null = null;
  mensaje = '';
  mensajeError = '';
  nuevaBicicleta: any = { marca: '', modelo: '', precio: 0, tipo: '' };

  imagenesMap: Record<string, string> = {
    MTB: 'assets/bikes/mtb.png',
    RUTA: 'assets/bikes/ruta.png',
    URBANO: 'assets/bikes/urbano.png',
    BMX: 'assets/bikes/bmx.png'
  };

  constructor(
    private bicicletaService: BicicletaService,
    private movimientoService: MovimientoService,
    private inventarioService: InventarioService
  ) {}

  ngOnInit(): void {
    this.cargarBicicletas();
    this.cargarProveedores();
    this.cargarInventario();
  }

  cargarBicicletas() {
    this.bicicletaService.listarBicicletas().subscribe({
      next: data => this.bicicletas = data,
      error: () => this.mensajeError = 'Error al cargar bicicletas'
    });
  }

  cargarInventario() {
    this.inventarioService.listarInventario().subscribe({
      next: (data: any) => this.inventario = Array.isArray(data) ? data : [],
      error: () => {}
    });
  }

  cargarProveedores() {
    this.movimientoService.listarProveedores().subscribe({
      next: data => this.proveedores = Array.isArray(data) ? data : [],
      error: () => {}
    });
  }

  getStock(codigo: string): number {
    const item = this.inventario.find(i => i.codigo === codigo);
    return item ? item.stock : 0;
  }

  getValorTotal(bici: any): number {
    return (bici.precio || 0) * this.getStock(bici.codigo);
  }

  registrarBicicleta() {
    this.mensaje = '';
    this.mensajeError = '';
    if (!this.nuevaBicicleta.marca || !this.nuevaBicicleta.modelo || !this.nuevaBicicleta.tipo || this.nuevaBicicleta.precio <= 0) {
      this.mensajeError = 'Complete todos los campos';
      return;
    }
    if (!this.proveedorSeleccionado) {
      this.mensajeError = 'Seleccione un proveedor';
      return;
    }
    this.bicicletaService.registrarBicicleta(this.nuevaBicicleta, this.stockInicial).subscribe({
      next: (bici: any) => {
        if (this.stockInicial > 0) {
          const movimiento = {
            codigoBicicleta: bici.codigo,
            idProveedor: this.proveedorSeleccionado,
            tipo: 'ENTRADA',
            cantidad: this.stockInicial,
            precioUnitario: this.nuevaBicicleta.precio,
            observacion: 'Stock inicial'
          };
          this.movimientoService.registrarMovimiento(movimiento).subscribe({
            next: () => this.cargarInventario()
          });
        }
        this.mensaje = 'Bicicleta registrada correctamente';
        this.nuevaBicicleta = { marca: '', modelo: '', precio: 0, tipo: '' };
        this.stockInicial = 0;
        this.proveedorSeleccionado = null;
        this.cargarBicicletas();
        this.cargarInventario();
      },
      error: () => this.mensajeError = 'Error al registrar bicicleta'
    });
  }

  eliminarBicicleta(id: number) {
    if (!confirm('Eliminar esta bicicleta y su inventario?')) return;
    this.bicicletaService.eliminarBicicleta(id).subscribe({
      next: () => {
        this.mensaje = 'Bicicleta eliminada';
        this.cargarBicicletas();
        this.cargarInventario();
      },
      error: () => this.mensajeError = 'Error al eliminar bicicleta'
    });
  }

  getImagen(tipo: string): string {
    return this.imagenesMap[tipo] || 'assets/bikes/mtb.png';
  }
}
