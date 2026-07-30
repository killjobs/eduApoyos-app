import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SolicitudService } from '../../services/solicitud.service';
import { SolicitudDetalle } from '../../models/solicitud-detalle.model';
import { EstadoSolicitud } from '../../models/estado-solicitud.enum';
import { EstadoSolicitudPipe } from '../../pipes/estado-solicitud.pipe';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CambiarEstadoSolicitud } from '../../models/cambiar-estado-solicitud.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-solicitud-detalle-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    EstadoSolicitudPipe
  ],
  templateUrl: './solicitud-detalle-modal.component.html',
  styleUrl: './solicitud-detalle-modal.component.scss'
})
export class SolicitudDetalleModalComponent implements OnInit {
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly solicitudService = inject(SolicitudService);
  private readonly dialogRef = inject(MatDialogRef<SolicitudDetalleModalComponent>);
  private hasChanges = false;
  readonly displayedColumns = [ 'estadoAnterior', 'estadoNuevo', 'fechaCambio','observacion'];
  readonly EstadoSolicitud = EstadoSolicitud;
  solicitud?: SolicitudDetalle;
  loading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public solicitudId: string
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.solicitudService.getSolicitudDetalle(this.solicitudId).subscribe({
        next: response => {
          this.solicitud = response.data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
  }

  canMoveToRevision(): boolean {
    return this.solicitud?.estado === EstadoSolicitud.Pendiente;
  }
  
  canApproveOrReject(): boolean {
    return this.solicitud?.estado === EstadoSolicitud.EnRevision;
  }

  changeStatus(estado: EstadoSolicitud, mensajeConfirmacion: string ): void {
    const confirmed = confirm(mensajeConfirmacion);
    
    if (!confirmed) {
      return;
    }

    const observacionIngresada = prompt('Ingrese una observación para el cambio de estado:');
    const observacion = observacionIngresada?.trim() || 'Cambio realizado sin observación';

    const request: CambiarEstadoSolicitud = {
      estado,
      observacion
    };

    this.loading = true;

    this.solicitudService.cambiarEstado(this.solicitudId,request).pipe(finalize(() => this.loading = false)).subscribe({
      next: () => {
        this.hasChanges = true;
        this.snackBar.open('Estado actualizado correctamente','Cerrar',
          {
            duration: 4000
          }
        );
        this.loadData();
      },
      error: error => {
        this.snackBar.open(error.error?.data ??'Ocurrió un error al actualizar el estado','Cerrar',
          {
            duration: 5000
          }
        );
      }
    });
  }

  moveToRevision(): void {
    this.changeStatus(EstadoSolicitud.EnRevision,'¿Desea cambiar la solicitud a En Revisión?');
  }

  approve(): void {
    this.changeStatus( EstadoSolicitud.Aprobada,'¿Desea aprobar la solicitud?');
  }

  reject(): void {
    this.changeStatus(EstadoSolicitud.Rechazada,'¿Desea rechazar la solicitud?');
  }

  close(): void {
  this.dialogRef.close(this.hasChanges);
  }
}