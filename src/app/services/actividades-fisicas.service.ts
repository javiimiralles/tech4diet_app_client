import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { getHeaders } from '../utils/headers.utils';
import { UsuariosService } from './usuarios.service';
import { ActividadFisica } from '../models/actividad-fisica.model';

@Injectable({
  providedIn: 'root'
})
export class ActividadesFisicasService {

  idUsuario: string = this.usuariosService.uid;
  idActividadFisicaPadre: string;

  constructor(private http: HttpClient, private usuariosService: UsuariosService) {}

  cargarActividadFisicaPorId(uid: string) {
    return this.http.get(`${environment.base_url}/actividades-fisicas/${uid}`, getHeaders());
  }

  cargarActividadesFisicas(texto: string, defaultOnly: boolean) {
    let url: string = `${environment.base_url}/actividades-fisicas?texto=${texto}&resultados=15`;
    if(!defaultOnly) {
      url += `&idUsuario=${this.idUsuario}`;
    }
    return this.http.get(url, getHeaders());
  }

  createActividadFisica(actividadFisica: ActividadFisica) {
    actividadFisica.idUsuario = this.idUsuario;
    return this.http.post(`${environment.base_url}/actividades-fisicas`, actividadFisica, getHeaders());
  }

  updateActividadFisica(actividadFisica: ActividadFisica) {
    return this.http.put(`${environment.base_url}/actividades-fisicas/${actividadFisica.uid}`, actividadFisica, getHeaders());
  }

  deleteActividadFisica(uid: string) {
    return this.http.delete(`${environment.base_url}/actividades-fisicas/${uid}`, getHeaders());
  }

}
