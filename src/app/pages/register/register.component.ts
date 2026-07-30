import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Register } from '../../models/register.model';
import { UserRole } from '../../models/user-rol.enum';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly authService = inject(AuthService);

  readonly loading = signal(false);
  readonly UserRole = UserRole;

  readonly registerForm = this.fb.nonNullable.group({
    nombreCompleto: ['',[Validators.required,Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/)]],
    correoElectronico: ['',[Validators.required,Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
    password: ['',[Validators.required,Validators.minLength(6)]],
    rol: ['',Validators.required]
  });

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const request: Register = {
      ...this.registerForm.getRawValue(),
      rol: this.registerForm.controls.rol.value === UserRole.Asesor? 1 : 2
    };

    this.authService.register(request).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        this.snackBar.open('Usuario registrado correctamente','Cerrar',{duration: 4000});
        this.router.navigate(['/login']);
      },
      error: error => {
        this.snackBar.open(error.error?.data ??'Ocurrió un error al registrar el usuario','Cerrar',{duration: 5000}
        );
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/login']);
  }

    get nombreCompleto() {
    return this.registerForm.controls.nombreCompleto;
  }

  get correoElectronico() {
    return this.registerForm.controls.correoElectronico;
  }

  get password() {
    return this.registerForm.controls.password;
  }

  get rol() {
    return this.registerForm.controls.rol;
  }
}