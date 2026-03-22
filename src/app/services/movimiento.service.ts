import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MovimientoService {
  private apiMovimientos = 'http://localhost:8080/api/movimientos';
  private apiInventario = 'http://localhost:8080/api/inventario';
  private apiProveedores = 'http://localhost:8080/api/proveedores';

  constructor(private http: HttpClient) {}

  listarInventario(): Observable<any[]> {
    return this.http.get<any[]>(this.apiInventario);
  }

  listarMovimientos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiMovimientos);
  }

  registrarMovimiento(movimiento: any): Observable<any> {
    return this.http.post<any>(this.apiMovimientos, movimiento);
  }

  listarProveedores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiProveedores);
  }

  registrarProveedor(proveedor: any): Observable<any> {
    return this.http.post<any>(this.apiProveedores, proveedor);
  }

  eliminarProveedor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiProveedores}/${id}`);
  }
}
