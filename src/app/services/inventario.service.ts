import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventario } from '../models/inventario.model';

@Injectable({ providedIn: 'root' })
export class InventarioService {

  private apiUrl = '/api/inventario';

  constructor(private http: HttpClient) {}

  listarInventario(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(this.apiUrl);
  }

  dashboardInventario(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`);
  }
}
