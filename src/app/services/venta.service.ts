import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../models/venta.model';

@Injectable({ providedIn: 'root' })
export class VentaService {

  private apiUrl = '/api/ventas';

  constructor(private http: HttpClient) {}

  listarVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl);
  }

  registrarVenta(clienteId: number, codigoBicicleta: string, cantidad: number): Observable<any> {
    const body = { clienteId, codigoBicicleta, cantidad };
    return this.http.post<any>(`${this.apiUrl}/registrar`, body);
  }

  ventasPorCliente(clienteId: number): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }
}
