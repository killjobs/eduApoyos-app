import { SolicitudApoyo } from "./solicitud-apoyo.model";

export interface RespuestaPagina<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}