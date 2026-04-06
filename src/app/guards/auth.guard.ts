import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUser = authService.currentUserValue;

  if (currentUser) {
    // Validar si la ruta exige un rol específico (ej. ADMIN)
    const expectedRole = route.data['expectedRole'];
    if (expectedRole && currentUser.rol !== expectedRole) {
      router.navigate(['/']); // Si no tiene el rol, lo mandamos al inicio
      return false;
    }
    return true; // Acceso permitido
  }

  // No está autenticado
  router.navigate(['/login']);
  return false;
};
