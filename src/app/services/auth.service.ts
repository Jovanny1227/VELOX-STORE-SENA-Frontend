import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthLogin, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);

  constructor(private http: HttpClient) {
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
        sessionStorage.setItem('currentUser', JSON.stringify(response));
        this.currentUserSubject.next(response);
      }),
    );
  }

  // 👇 MÉTODO CORREGIDO 👇
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro-cliente`, userData);
  }

  logout(): void {
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
