import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ClienteService {

  private apiUrl = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient) {}

  listarClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  buscarPorId(clienteId: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${clienteId}`);
  }

  buscarPorDocumento(documento: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/documento/${documento}`);
  }

  registrarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente);
  }
}
