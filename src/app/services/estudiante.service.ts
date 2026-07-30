import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environment/environment";
import { Observable } from "rxjs";
import { ApiResponse } from "../models/api-response.model";
import { EstudianteSelect } from "../models/estudiante-select.model";

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  private readonly http = inject(HttpClient);

  private readonly PATH =`${environment.apiUrl}/estudiantes`;

  etEstudiantesForSelect():Observable<ApiResponse<EstudianteSelect[]>> {
    return this.http.get<ApiResponse<EstudianteSelect[]>>(`${this.PATH}/GetEstudiantesForSelect`);
  }
}