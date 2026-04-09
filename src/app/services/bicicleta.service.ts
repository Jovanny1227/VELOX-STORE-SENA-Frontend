import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bicicleta, BicicletaMasivaRequest } from '../models/bicicleta.model';

@Injectable({
  providedIn: 'root',
})
export class BicicletaService {
  private apiUrl = 'https://velox-store-sena-backend-production-2ed0.up.railway.app/api/bicicletas';

  constructor(private http: HttpClient) {}

  listarBicicletas(): Observable<Bicicleta[]> {
    const t = new Date().getTime();
    return this.http
      .get<any>(`${this.apiUrl}?size=1000&t=${t}`)
      .pipe(map((res) => (res.content !== undefined ? res.content : res)));
  }

  obtenerCatalogo(): Observable<Bicicleta[]> {
    const t = new Date().getTime();
    return this.http
      .get<any>(`${this.apiUrl}/catalogo?size=1000&t=${t}`)
      .pipe(map((res) => (res.content !== undefined ? res.content : res)));
  }

  crearBicicleta(bicicleta: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, bicicleta);
  }

  actualizarBicicleta(id: number, bicicleta: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, bicicleta);
  }

  registrarMasivo(request: BicicletaMasivaRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/masivo`, request, { responseType: 'text' });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
