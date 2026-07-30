import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

   if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }
  
  const roles = route.data?.['roles'];

  if (!roles?.length) {
    return true;
  }

  const user = authService.getCurrentUser();

  if (user && roles.includes(user.role)) {
    return true;
  }

  return router.createUrlTree(['/no-autorizado']);
};
