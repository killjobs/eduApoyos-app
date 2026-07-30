import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder,ReactiveFormsModule, Validators} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SolicitudService } from '../../services/solicitud.service';
import { CrearSolicitud } from '../../models/crear-solicitud.model';
import { TipoApoyo } from '../../models/tipo-apoyo.enum';
import { AuthService } from '../../services/auth.service';
import { EstudianteService } from '../../services/estudiante.service';
import { EstudianteSelect } from '../../models/estudiante-select.model';

@Component({
  selector: 'app-crear-solicitud-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './crear-solicitud-modal.component.html',
  styleUrl: './crear-solicitud-modal.component.scss'
})
export class CrearSolicitudModalComponent {

  private readonly fb = inject(FormBuilder);
  private readonly solicitudService = inject(SolicitudService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly authService = inject(AuthService);
  private readonly dialogRef = inject(MatDialogRef<CrearSolicitudModalComponent>);
  private readonly estudianteService = inject(EstudianteService);
  readonly TipoApoyo = TipoApoyo;
  loading = signal(false);
  estudiantes: EstudianteSelect[] = [];
  readonly form = this.fb.nonNullable.group({
    estudianteId: ['',[Validators.required]],
    tipoApoyo: [TipoApoyo.Beca,[Validators.required]],
    montoSolicitado: ['',[Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
    descripcion: ['']
  });

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.estudianteService.etEstudiantesForSelect().subscribe({
      next: response => {
        this.estudiantes = response.data;
      }
    });
  }
  
  create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const user = this.authService.getCurrentUser();
    const request: CrearSolicitud = {
      estudianteId: this.form.controls.estudianteId.value,
      tipoApoyo: this.form.controls.tipoApoyo.value,
      montoSolicitado: Number(this.form.controls.montoSolicitado.value),
      descripcion: this.form.controls.descripcion.value?.trim() || 'Solicitud creada sin descripción.',
      asesorId: user!.id
    };

    this.solicitudService.createSolicitud(request).pipe(finalize(() => this.loading.set(false))).subscribe({
        next: () => {
          this.snackBar.open('Solicitud creada correctamente','Cerrar',
            {
              duration: 4000
            }
          );
          this.dialogRef.close();
        },
        error: error => {
          this.snackBar.open(error.error?.data ??'Ocurrió un error al crear la solicitud','Cerrar',
            {
              duration: 5000
            }
          );
        }
      });
  }

  cancel(): void {
    this.form.reset();
    this.dialogRef.close();
  }
}