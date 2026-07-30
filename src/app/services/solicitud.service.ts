import { inject, Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environment/environment';
import { SolicitudApoyo } from '../models/solicitud-apoyo.model';
import { RespuestaPagina } from '../models/respuesta-pagina.model';
import { ApiResponse } from '../models/api-response.model';
import { EstadoSolicitud } from '../models/estado-solicitud.enum';

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
    console.log('SolicitudService - getSolicitudes called with params:', { page, pageSize, estado });
    if (estado) {
      params = params.set('estado', estado);
    }

    return this.http.get<ApiResponse<RespuestaPagina<SolicitudApoyo>>>(`${this.PATH}`, { params });
  }
}