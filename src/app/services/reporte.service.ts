import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  private apiUrl = 'http://localhost:8080/api/reportes';

  constructor(private http: HttpClient) {}

  obtenerDashboard(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`);
  }

  // Función mágica para descargar archivos protegidos con JWT
  descargarPdf(endpoint: string, nombreArchivo: string) {
    this.http.get(`${this.apiUrl}/${endpoint}`, { responseType: 'blob' }).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nombreArchivo;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }
}
