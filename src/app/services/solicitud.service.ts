import { inject, Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environment/environment';
import { SolicitudApoyo } from '../models/solicitud-apoyo.model';
import { RespuestaPagina } from '../models/respuesta-pagina.model';
import { ApiResponse } from '../models/api-response.model';
import { EstadoSolicitud } from '../models/estado-solicitud.enum';
import { SolicitudDetalle } from '../models/solicitud-detalle.model';
import { CambiarEstadoSolicitud } from '../models/cambiar-estado-solicitud.model';
import { CrearSolicitud } from '../models/crear-solicitud.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  private readonly http = inject(HttpClient);
  private readonly PATH = `${environment.apiUrl}/solicitudes`;

  getSolicitudes(page: number,pageSize: number, estado?: EstadoSolicitud | null): Observable<ApiResponse<RespuestaPagina<SolicitudApoyo>>> {
    let params = new HttpParams()
    .set('page', page)
    .set('pageSize', pageSize);
    if (estado) {
      params = params.set('estado', estado);
    }

    return this.http.get<ApiResponse<RespuestaPagina<SolicitudApoyo>>>(this.PATH, { params });
  }
  
  getSolicitudDetalle(solicitudId: string): Observable<ApiResponse<SolicitudDetalle>> {
    return this.http.get<ApiResponse<SolicitudDetalle>>(`${this.PATH}/${solicitudId}`);
  }

  cambiarEstado(solicitudId: string,request: CambiarEstadoSolicitud): Observable<ApiResponse<string>> {
    return this.http.patch<ApiResponse<string>>(
      `${this.PATH}/${solicitudId}/estado`,
      request
    );
  }

  createSolicitud(request: CrearSolicitud): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(this.PATH,request);
  }
}