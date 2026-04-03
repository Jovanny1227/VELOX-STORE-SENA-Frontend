import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthLogin, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  // Mantiene el estado del usuario en toda la aplicación
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);

  constructor(private http: HttpClient) {
    // CAMBIO 1: sessionStorage para que muera al cerrar la pestaña
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  public get currentUserValue(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  login(credentials: AuthLogin): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        // CAMBIO 2: Guardamos en sessionStorage
        sessionStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUserSubject.next(response);
      }),
    );
  }

  logout(): void {
    // CAMBIO 3: Limpiamos el sessionStorage
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return this.currentUserValue?.token || null;
  }

  getRole(): string | null {
    return this.currentUserValue?.rol || null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }
}
