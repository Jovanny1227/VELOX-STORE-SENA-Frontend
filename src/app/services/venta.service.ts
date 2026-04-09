import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private apiUrl = environment.apiUrl + '/ventas';

  constructor(private http: HttpClient) {}

  registrarVentaPos(usuarioId: number, payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pos?usuarioId=${usuarioId}`, payload);
  }

  getVentas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  registrarVentaMultiple(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pos?usuarioId=1`, payload);
  }

  listarTodas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
