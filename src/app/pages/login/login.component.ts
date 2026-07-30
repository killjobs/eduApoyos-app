import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Login } from '../../models/login.model';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {

  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  
  readonly loading = signal(false);

  readonly loginForm = this.fb.nonNullable.group({
    correoElectronico: ['',[Validators.required,Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
    password: ['',[Validators.required]]
  });

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading.set(true);

    const request: Login = {
      correoElectronico: this.loginForm.controls.correoElectronico.value,
      password: this.loginForm.controls.password.value
    };
    
    this.authService.login(request).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        const user = this.authService.getCurrentUser();
        if (!user) {
          return;
        }
        this.snackBar.open('Inicio de sesión exitoso','Cerrar',{ duration: 3000});
        if (user.role === 'Asesor') {
          this.router.navigate(['/panel-asesor']);
        }
        if (user.role === 'Estudiante') {
          this.router.navigate(['/panel-estudiante']);
        }
      },  
      error: errorMessage => {
        this.snackBar.open(errorMessage.error.data,'Cerrar',{duration: 5000});
      }
    });
  }

  get correoElectronico() {
    return this.loginForm.controls.correoElectronico;
  }

  get password() {
    return this.loginForm.controls.password;
  }
}