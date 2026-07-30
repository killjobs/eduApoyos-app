import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const publicEndpoints = [
    '/auth/login',
    '/auth/register'
  ];
  const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));
  if (isPublicEndpoint) {
    return next(req);
  }
  const token = authService.getToken();
  
  if(!token) {
    return next(req);
  }
  const authRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  
  return next(authRequest).pipe(
    catchError((error: HttpErrorResponse) => {
       if (error.status === 401) {
         authService.logout();
         router.navigate(['/login']);
       }
       return throwError(() => error);
    })
  );
};
