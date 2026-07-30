import { HistorialEstado } from './historial-estado.model';

export interface SolicitudDetalle {
  id: string;
  estudianteId: string;
  tipoApoyo: number;
  montoSolicitado: number;
  descripcion: string;
  estado: number;
  fechaSolicitud: string;
  fechaActualizacion: string;
  asesorId: string;
  historialEstados: HistorialEstado[];
}