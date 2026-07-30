import { Pipe, PipeTransform } from '@angular/core';
import { EstadoSolicitud } from '../models/estado-solicitud.enum';

@Pipe({
  name: 'estadoSolicitud',
  standalone: true
})
export class EstadoSolicitudPipe implements PipeTransform {

  transform(value: number): string {
    switch (value) {
      case EstadoSolicitud.Pendiente:
        return 'Pendiente';
      case EstadoSolicitud.EnRevision:
        return 'En Revisión';
      case EstadoSolicitud.Aprobada:
        return 'Aprobada';
      case EstadoSolicitud.Rechazada:
        return 'Rechazada';
      default:
        return 'No definido';
    }
  }

}
