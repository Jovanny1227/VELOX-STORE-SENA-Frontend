import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VentaService {

  private apiUrl = '/api/ventas';

  constructor(private http: HttpClient) {}

  listarVentas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  registrarVenta(clienteId: number, codigoBicicleta: string, cantidad: number): Observable<any> {
    const body = { clienteId, codigoBicicleta, cantidad };
    return this.http.post<any>(`${this.apiUrl}/registrar`, body);
  }

  eliminarVenta(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
