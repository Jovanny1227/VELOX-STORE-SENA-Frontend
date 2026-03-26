import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ItemVenta {
  codigoBicicleta: string;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class VentaService {
  private apiUrl = 'http://localhost:8080/api/ventas';

  constructor(private http: HttpClient) {}

  listarVentas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  registrarVentaMultiple(clienteId: number, items: ItemVenta[]): Observable<any> {
    const body = { clienteId, items };
    return this.http.post<any>(this.apiUrl + '/registrar', body);
  }

  eliminarVenta(id: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + '/' + id);
  }
}
