export interface AuthResponse {
  token: string;
  nombre: string;
  rol: 'ADMIN' | 'CLIENTE';
}

export interface AuthLogin {
  email: string;
  password: string;
}
