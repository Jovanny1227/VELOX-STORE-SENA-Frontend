import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private itemsCarrito: any[] = [];
  public carrito$ = new BehaviorSubject<any[]>([]);

  // Inyectamos PLATFORM_ID para asegurarnos de que localStorage solo se ejecute en el navegador
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.cargarDesdeLocalStorage();
  }

  private guardarEnLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('velox_carrito', JSON.stringify(this.itemsCarrito));
    }
    this.carrito$.next(this.itemsCarrito);
  }

  private cargarDesdeLocalStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const datos = localStorage.getItem('velox_carrito');
      if (datos) {
        this.itemsCarrito = JSON.parse(datos);
        this.carrito$.next(this.itemsCarrito);
      }
    }
  }

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
    this.guardarEnLocalStorage();
  }

  disminuirCantidad(codigo: string) {
    const item = this.itemsCarrito.find((i) => i.codigo === codigo);
    if (item) {
      if (item.cantidad > 1) {
        item.cantidad--;
        this.guardarEnLocalStorage();
      } else {
        this.eliminarBicicleta(codigo);
      }
    }
  }

  eliminarBicicleta(codigo: string) {
    this.itemsCarrito = this.itemsCarrito.filter((item) => item.codigo !== codigo);
    this.guardarEnLocalStorage();
  }

  obtenerTotal(): number {
    return this.itemsCarrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
  }

  vaciarCarrito() {
    this.itemsCarrito = [];
    this.guardarEnLocalStorage();
  }
}
