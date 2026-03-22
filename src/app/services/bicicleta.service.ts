import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BicicletaService {

  private apiUrl = '/api/bicicletas';

  constructor(private http: HttpClient) {}

  listarBicicletas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  buscarPorCodigo(codigo: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${codigo}`);
  }

  registrarBicicleta(bicicleta: any, stock: number): Observable<any> {
    const params = new HttpParams().set('stock', stock.toString());
    return this.http.post<any>(this.apiUrl, bicicleta, { params });
  }

  eliminarBicicleta(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
