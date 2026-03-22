import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MovimientoService {

  private apiUrl = '/api/movimientos';
  private proveedorUrl = '/api/proveedores';

  constructor(private http: HttpClient) {}

  listarMovimientos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  listarPorBicicleta(codigo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/bicicleta/${codigo}`);
  }

  registrarMovimiento(movimiento: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, movimiento);
  }

  listarProveedores(): Observable<any[]> {
    return this.http.get<any[]>(this.proveedorUrl);
  }

  registrarProveedor(proveedor: any): Observable<any> {
    return this.http.post<any>(this.proveedorUrl, proveedor);
  }
}
