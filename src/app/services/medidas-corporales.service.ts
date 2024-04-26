import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { UsuariosService } from './usuarios.service';
import { getHeaders } from '../utils/headers.utils';
import { MedidaCorporal } from '../models/medida-corporal.model';

@Injectable({
  providedIn: 'root'
})
export class MedidasCorporalesService {

  idUsuario: string = this.usuariosService.uid;

  constructor(private http: HttpClient, private usuariosService: UsuariosService) {}

  cargarMedidasCorporalesPorUsuario() {
    return this.http.get(`${environment.base_url}/medidas-corporales/usuario/${this.idUsuario}`, getHeaders());
  }

  createMedidaCorporal(medidaCorporal: MedidaCorporal) {
    medidaCorporal.idUsuario = this.idUsuario;
    return this.http.post(`${environment.base_url}/medidas-corporales`, medidaCorporal, getHeaders());
  }

  updateMedidaCorporal(medidaCorporal: MedidaCorporal) {
    return this.http.put(`${environment.base_url}/medidas-corporales/${medidaCorporal.uid}`, medidaCorporal, getHeaders());
  }

  deleteMedidaCorporal(uid: string) {
    return this.http.delete(`${environment.base_url}/medidas-corporales/${uid}`, getHeaders());
  }

}
