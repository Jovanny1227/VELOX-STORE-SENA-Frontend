import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bicicleta, BicicletaMasivaRequest } from '../models/bicicleta.model';

@Injectable({
  providedIn: 'root',
})
export class BicicletaService {
  private apiUrl = 'http://localhost:8080/api/bicicletas';

  constructor(private http: HttpClient) {}

  listarBicicletas(): Observable<Bicicleta[]> {
    return this.http.get<Bicicleta[]>(this.apiUrl);
  }

  // === NUEVOS MÉTODOS PARA EL FORMULARIO INDIVIDUAL ===

  crearBicicleta(bicicleta: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, bicicleta);
  }

  actualizarBicicleta(id: number, bicicleta: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, bicicleta);
  }

  // ====================================================

  // Tu endpoint de carga masiva (Intacto)
  registrarMasivo(request: BicicletaMasivaRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/masivo`, request, { responseType: 'text' });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
