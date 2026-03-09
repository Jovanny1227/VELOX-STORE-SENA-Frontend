import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bicicleta } from '../models/bicicleta.model';

@Injectable({ providedIn: 'root' })
export class BicicletaService {

  private apiUrl = 'http://localhost:8080/api/bicicletas';

  constructor(private http: HttpClient) {}

  listarBicicletas(): Observable<Bicicleta[]> {
    return this.http.get<Bicicleta[]>(this.apiUrl);
  }

  buscarPorCodigo(codigo: string): Observable<Bicicleta> {
    return this.http.get<Bicicleta>(`${this.apiUrl}/${codigo}`);
  }

  registrarBicicleta(bicicleta: Bicicleta, stock: number): Observable<Bicicleta> {
    const params = new HttpParams().set('stock', stock.toString());
    return this.http.post<Bicicleta>(this.apiUrl, bicicleta, { params });
  }

  consultarStock(codigo: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${codigo}/stock`);
  }
}
