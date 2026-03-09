import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventario } from '../models/inventario.model';

@Injectable({ providedIn: 'root' })
export class InventarioService {

  private apiUrl = 'http://localhost:8080/api/inventario';

  constructor(private http: HttpClient) {}

  listarInventario(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(this.apiUrl);
  }

}
