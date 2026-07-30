import { EstadoSolicitud } from "./estado-solicitud.enum";
import { Estudiante } from "./estudiante.model";
import { TipoApoyo } from "./tipo-apoyo.enum";

export interface SolicitudApoyo {
  id: string;
  estudianteId: string;
  estudiante: Estudiante;
  tipoApoyo: TipoApoyo;
  montoSolicitado: number;
  descripcion: string;
  estado: EstadoSolicitud;
  fechaSolicitud: string;
  fechaActualizacion: string;
  asesorId: string;
}