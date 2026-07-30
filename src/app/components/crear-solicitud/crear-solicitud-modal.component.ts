import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef,MatDialogModule } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-crear-solicitud',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './crear-solicitud-modal.component.html',
  styleUrl: './crear-solicitud-modal.component.scss'
})
export class CrearSolicitudModalComponent {

  private readonly fb = inject(FormBuilder);

  readonly dialogRef = inject(MatDialogRef<CrearSolicitudModalComponent>);

  form: FormGroup = this.fb.group({
    asunto: ['', Validators.required],
    descripcion: ['', Validators.required]
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(
      this.form.getRawValue()
    );
  }

  cancel(): void {
    this.dialogRef.close();
  }
}