import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { MatTableDataSource } from '@angular/material/table';

import { SolicitudApoyo } from '../../models/solicitud-apoyo.model';
import { CrearSolicitudModalComponent } from '../../components/crear-solicitud-modal/crear-solicitud-modal.component';
import { SolicitudService } from '../../services/solicitud.service';
import { TipoApoyo } from '../../models/tipo-apoyo.enum';
import { EstadoSolicitud } from '../../models/estado-solicitud.enum';
import { SolicitudDetalleModalComponent } from '../../components/solicitud-detalle-modal/solicitud-detalle-modal.component';
import { EstadoSolicitudPipe } from '../../pipes/estado-solicitud.pipe';

@Component({
  selector: 'app-panel-asesor',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    EstadoSolicitudPipe
  ],
  templateUrl: './panel-asesor.component.html',
  styleUrl: './panel-asesor.component.scss'
})
export class PanelAsesorComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly solicitudService = inject(SolicitudService);
  readonly displayedColumns = ['id','estudiante','tipoApoyo','montoSolicitado','estado','fechaSolicitud','acciones'];
  readonly dataSource =  new MatTableDataSource<SolicitudApoyo>();
  readonly EstadoSolicitud = EstadoSolicitud;
  readonly estados = [
    { value: EstadoSolicitud.Pendiente, label: 'Pendiente'},
    { value: EstadoSolicitud.EnRevision, label: 'En Revisión'},
    { value: EstadoSolicitud.Aprobada, label: 'Aprobada' },
    { value: EstadoSolicitud.Rechazada, label: 'Rechazada' }
  ];

  estadoSeleccionado: EstadoSolicitud | null = null;

  pageNumber = 1;
  pageSize = 10;
  totalRecords = 0;

  ngOnInit(): void {
    this.loadSolicitudes();
  }

  loadSolicitudes(): void {
  this.solicitudService.getSolicitudes(this.pageNumber,this.pageSize,this.estadoSeleccionado).subscribe({
      next: response => {
        this.dataSource.data = response.data.items;
        this.totalRecords = response.data.totalRecords;
      }
    });
  }

  openCreateSolicitudModal(): void {
    const dialogRef = this.dialog.open(CrearSolicitudModalComponent,
      {
        width: '700px'
      }
    );

    dialogRef.afterClosed().subscribe(() => {
      this.loadSolicitudes();
    });
  }

  openDetail(id: string): void {
     const dialogRef = this.dialog.open(SolicitudDetalleModalComponent,
      {
        width: '1000px',
        data: id
      }
    );

    dialogRef.afterClosed().subscribe(() => {
      this.loadSolicitudes();
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadSolicitudes();
  }

  getTipoApoyo(tipo: TipoApoyo): string {
    switch (tipo) {
      case TipoApoyo.Beca:
        return 'Beca';
      case TipoApoyo.Credito:
        return 'Crédito';
      case TipoApoyo.Subsidio:
        return 'Subsidio';
      default:
        return 'No definido';
    }
  }

  onEstadoChange(): void {
    this.pageNumber = 1;
    this.loadSolicitudes();
  }
}