import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private apiUrl = 'http://localhost:8080/api/inventario';

  constructor(private http: HttpClient) {}

  obtenerJerarquico(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/jerarquico`);
  }
}
