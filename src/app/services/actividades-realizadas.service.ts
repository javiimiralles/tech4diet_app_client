import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { getHeaders } from '../utils/headers.utils';
import { formatDate } from '../utils/date.utils';
import { UsuariosService } from './usuarios.service';
import { ActividadRealizada } from '../models/actividad-realizada.model';

@Injectable({
  providedIn: 'root'
})
export class ActividadesRealizadasService {

  idUsuario: string = this.usuariosService.uid;
  fechaActual: Date; // para el registro de una nueva actividad

  constructor(private http: HttpClient, private usuariosService: UsuariosService) {}

  cargarActividadRealizadaPorId(uid: string) {
    return this.http.get(`${environment.base_url}/actividades-realizadas/${uid}`, getHeaders());
  }

  cargarActividadesRealizadasPorFecha(date: Date) {
    const fechaFormateada = formatDate(date);
    return this.http.get(`${environment.base_url}/actividades-realizadas/usuario/${this.idUsuario}?fecha=${fechaFormateada}`, getHeaders());
  }

  createActividadRealizada(actividadRealizada: ActividadRealizada) {
    actividadRealizada.idUsuario = this.idUsuario;
    return this.http.post(`${environment.base_url}/actividades-realizadas`, actividadRealizada, getHeaders());
  }

  updateActividadRealizada(actividadRealizada: ActividadRealizada) {
    return this.http.put(`${environment.base_url}/actividades-realizadas/${actividadRealizada.uid}`, actividadRealizada, getHeaders());
  }

  deleteActividadRealizada(uid: string) {
    return this.http.delete(`${environment.base_url}/actividades-realizadas/${uid}`, getHeaders());
  }

}
