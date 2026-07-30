import { TipoApoyo } from './tipo-apoyo.enum';

export interface CrearSolicitud {
  estudianteId: string;
  tipoApoyo: TipoApoyo;
  montoSolicitado: number;
  descripcion: string;
  asesorId: string;
}