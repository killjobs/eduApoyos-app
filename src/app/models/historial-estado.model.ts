export interface HistorialEstado {
  id: string;
  solicitudId: string;
  estadoAnterior: number;
  estadoNuevo: number;
  fechaCambio: string;
  usuarioId: string;
  observacion: string;
}