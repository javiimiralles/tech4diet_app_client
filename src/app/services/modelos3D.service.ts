import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UsuariosService } from './usuarios.service';
import { getHeaders } from '../utils/headers.utils';
import { formatDate } from '../utils/date.utils';
@Injectable({
  providedIn: 'root'
})
export class Modelos3DService {

  idUsuario: string = this.usuariosService.uid;

  constructor(private http: HttpClient, private usuariosService: UsuariosService) {}

  getModelos3DByUser() {
    return this.http.get(`${environment.base_url}/modelos3D/usuario/${this.idUsuario}`, getHeaders());
  }

  subirModelo3D(fecha: Date, archivoModelo: File) {
    const data: FormData = new FormData();
    data.append('fecha', formatDate(fecha));
    data.append('archivoModelo', archivoModelo);
    data.append('idUsuario', this.idUsuario);
    return this.http.post(`${environment.base_url}/modelos3D`, data, getHeaders());
  }

  deleteModelo3D(id: string) {
    return this.http.delete(`${environment.base_url}/modelos3D/${id}`, getHeaders());
  }


}
