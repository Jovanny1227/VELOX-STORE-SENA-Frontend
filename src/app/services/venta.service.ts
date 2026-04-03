import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private apiUrl = 'http://localhost:8080/api/ventas'; // Ajusta si tu puerto es diferente

  constructor(private http: HttpClient) {}

  // Obtener todas las ventas para el reporte
  listarTodas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Registrar una venta múltiple (CarritoService)
  registrarVentaMultiple(ventaRequest: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar-multiple`, ventaRequest);
  }
}
