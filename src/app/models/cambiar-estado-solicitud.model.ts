import { EstadoSolicitud } from './estado-solicitud.enum';

export interface CambiarEstadoSolicitud {
  estado: EstadoSolicitud;
  observacion: string;
}