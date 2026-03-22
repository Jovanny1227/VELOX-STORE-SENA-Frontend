import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BicicletaService {
  private apiUrl = 'http://localhost:8080/api/bicicletas';

  constructor(private http: HttpClient) {}

  listarBicicletas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Corregido: Enviamos proveedorId dentro del JSON y solo stock en la URL
  registrarBicicleta(bicicleta: any, stock: number, idProveedor: number): Observable<any> {
    // 1. Construimos el JSON exacto que espera BicicletaRequest en Java
    const payload = {
      marca: bicicleta.marca,
      modelo: bicicleta.modelo,
      tipo: bicicleta.tipo,
      precio: bicicleta.precio,
      proveedorId: idProveedor, // ¡Aquí está la clave!
    };

    // 2. El stock sí viaja por la URL como espera el @RequestParam
    const params = new HttpParams().set('stock', stock.toString());

    return this.http.post<any>(this.apiUrl, payload, { params });
  }

  eliminarBicicleta(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
