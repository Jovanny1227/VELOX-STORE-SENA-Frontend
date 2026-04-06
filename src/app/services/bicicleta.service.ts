import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bicicleta, BicicletaMasivaRequest } from '../models/bicicleta.model';

@Injectable({
  providedIn: 'root',
})
export class BicicletaService {
  private apiUrl = 'http://localhost:8080/api/bicicletas';

  constructor(private http: HttpClient) {}

  // 🔥 SOLUCIÓN: Agregamos size=1000 para que el backend no esconda los datos nuevos en la página 2
  listarBicicletas(): Observable<Bicicleta[]> {
    const t = new Date().getTime();
    return this.http
      .get<any>(`${this.apiUrl}?size=1000&t=${t}`)
      .pipe(map((res) => (res.content !== undefined ? res.content : res)));
  }

  // Lo mismo para el catálogo público
  obtenerCatalogo(): Observable<Bicicleta[]> {
    const t = new Date().getTime();
    return this.http
      .get<any>(`${this.apiUrl}/catalogo?size=1000&t=${t}`)
      .pipe(map((res) => (res.content !== undefined ? res.content : res)));
  }

  // === MÉTODOS CRUD ===

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
