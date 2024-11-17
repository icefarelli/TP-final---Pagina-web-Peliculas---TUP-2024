import { CanActivateFn } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  // Inyecta el servicio de autenticación
  const router = inject(Router);  // Inyecta el router para la redirección

  if (authService.estaAutenticado()) {
    return true;  // Si está autenticado, permite el acceso
  } else {
    router.navigate(['/**']);  // Redirige a la página de login si no está autenticado
    return false;  // Bloquea el acceso a la ruta
  }
};
