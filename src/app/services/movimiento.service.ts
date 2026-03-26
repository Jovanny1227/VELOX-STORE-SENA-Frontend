import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MovimientoService {
  private apiUrl = 'http://localhost:8080/api/movimientos';
  private proveedorUrl = 'http://localhost:8080/api/proveedores';

  constructor(private http: HttpClient) {}

  // --- MÉTODOS DE MOVIMIENTOS ---
  listarMovimientos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  listarPorBicicleta(codigo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bicicleta/${codigo}`);
  }

  registrarMovimiento(movimiento: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, movimiento);
  }

  // --- MÉTODOS DE PROVEEDORES ---
  listarProveedores(): Observable<any[]> {
    return this.http.get<any[]>(this.proveedorUrl);
  }

  registrarProveedor(proveedor: any): Observable<any> {
    return this.http.post<any>(this.proveedorUrl, proveedor);
  }

  // MÉTODO QUE FALTABA: Para eliminar un proveedor por su ID
  eliminarProveedor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.proveedorUrl}/${id}`);
  }

  // ADICIONAL: Método para actualizar (útil para futuras mejoras)
  actualizarProveedor(id: number, proveedor: any): Observable<any> {
    return this.http.put<any>(`${this.proveedorUrl}/${id}`, proveedor);
  }
}
