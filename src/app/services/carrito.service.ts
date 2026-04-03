import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private itemsCarrito: any[] = [];
  public carrito$ = new BehaviorSubject<any[]>([]);

  constructor() {}

  agregarBicicleta(bici: any) {
    const itemExistente = this.itemsCarrito.find((item) => item.codigo === bici.codigo);

    if (itemExistente) {
      if (itemExistente.cantidad < bici.stock) {
        itemExistente.cantidad++;
      } else {
        alert('No hay más stock disponible para este modelo.');
      }
    } else {
      this.itemsCarrito.push({ ...bici, cantidad: 1 });
    }
    this.carrito$.next(this.itemsCarrito);
  }

  disminuirCantidad(codigo: string) {
    const item = this.itemsCarrito.find((i) => i.codigo === codigo);
    if (item) {
      if (item.cantidad > 1) {
        item.cantidad--; // Resta 1 si hay más de 1
      } else {
        this.eliminarBicicleta(codigo); // Si llega a 0, quita la bicicleta
      }
      this.carrito$.next(this.itemsCarrito);
    }
  }

  eliminarBicicleta(codigo: string) {
    this.itemsCarrito = this.itemsCarrito.filter((item) => item.codigo !== codigo);
    this.carrito$.next(this.itemsCarrito);
  }

  obtenerTotal(): number {
    return this.itemsCarrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
  }

  vaciarCarrito() {
    this.itemsCarrito = [];
    this.carrito$.next(this.itemsCarrito);
  }
}
