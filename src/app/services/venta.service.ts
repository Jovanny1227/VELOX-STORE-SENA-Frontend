import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private apiUrl = 'https://velox-store-sena-backend-production-1ace.up.railway.app/api/ventas';

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  registrarVentaMultiple(ventaRequest: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar-multiple`, ventaRequest);
  }
}
