import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private apiUrl = 'https://velox-store-sena-backend-production-2ed0.up.railway.app/api/inventario';

  constructor(private http: HttpClient) {}

  obtenerJerarquico(): Observable<any> {
    const t = new Date().getTime();
    return this.http.get<any>(`${this.apiUrl}/jerarquico?t=${t}`);
  }
}
