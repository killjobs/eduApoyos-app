import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Login } from '../models/login.model';
import { ApiResponse } from '../models/api-response.model';
import { LoginResponse } from '../models/login-response.model';
import { environment } from '../../environment/environment';
import { UserSession } from '../models/user-session.model';
import { Register } from '../models/register.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   private readonly http = inject(HttpClient);
   private readonly PATH = `${environment.apiUrl}/auth`;

  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user_session';

  login(request: Login): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.PATH}/login`,request)
    .pipe(
      tap(response => {
        const payload = JSON.parse(
          atob(response.data.token.split('.')[1])
        );
        localStorage.setItem(this.TOKEN_KEY,response.data.token);
        localStorage.setItem(this.USER_KEY,
          JSON.stringify({
            id: payload.sub,
            email: payload.email,
            role: payload.role,
            jwtId: payload.jti,
            expiration: response.data.expiration
          })
        );
      })
    );
  }

  register(request: Register): Observable<void>{
    console.log('Register request:', request);
    console.log('API URL:', `${this.PATH}/register`);
    return this.http.post<void>(`${this.PATH}/register`, request);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getToken(): string | null {
    if (!this.isAuthenticated()) {
      return null;
    }
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): UserSession | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user
      ? JSON.parse(user) as UserSession : null;
  }

  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    
    if (!user) {
      return false;
    }
    const isValid = new Date(user.expiration) > new Date();
    if (!isValid) {
      this.logout();
      return false;
    }
    return true;
  }
}
