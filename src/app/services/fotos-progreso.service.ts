import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UsuariosService } from './usuarios.service';
import { getHeaders } from '../utils/headers.utils';
import { formatDate } from '../utils/date.utils';

@Injectable({
  providedIn: 'root'
})
export class FotosProgresoService {

  idUsuario: string = this.usuariosService.uid;

  constructor(private http: HttpClient, private usuariosService: UsuariosService) {}

  cargarFotosProgresoPorFecha(date: Date) {
    const fechaFormateada = formatDate(date);
    return this.http.get(`${environment.base_url}/fotos-progreso/usuario/${this.idUsuario}?fecha=${fechaFormateada}`, getHeaders());
  }

  subirFotoProgreso(imagen: File, date: Date) {
    const data = new FormData();
    data.append('imagen', imagen);
    data.append('fecha', date.toISOString());
    data.append('idUsuario', this.idUsuario);
    return this.http.post(`${environment.base_url}/fotos-progreso`, data, getHeaders());
  }

  deleteFotoProgreso(uid: string) {
    return this.http.delete(`${environment.base_url}/fotos-progreso/${uid}`, getHeaders());
  }

}
