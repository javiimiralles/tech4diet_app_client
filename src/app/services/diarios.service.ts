import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UsuariosService } from './usuarios.service';
import { formatDate } from '../utils/date.utils';
import { Diario } from '../models/diario.model';
import { getHeaders } from '../utils/headers.utils';

@Injectable({
  providedIn: 'root'
})
export class DiariosService {

  idUsuario: string = this.usuariosService.uid;

  idDiarioActual: string;
  idAlimentoActual: string;
  categoriaActual: string;

  constructor(private http: HttpClient, private usuariosService: UsuariosService) {}

  cargarDiarioPorFecha(date: Date): Observable<any> {
    const fechaFormateada = formatDate(date);
    return this.http.get(`${environment.base_url}/diarios/usuario/${this.idUsuario}?fecha=${fechaFormateada}`, getHeaders());
  }

  crearDiario(date: Date): Observable<any> {
    const data: FormData = new FormData;
    data.append('idUsuario', this.idUsuario);
    data.append('fecha', date.toISOString());
    return this.http.post(`${environment.base_url}/diarios`, data, getHeaders());
  }

  updateDiario(diario: Diario) {
    const data: FormData = new FormData;
    const fecha: Date = new Date(diario.fecha);
    data.append('idUsuario', this.idUsuario);
    data.append('fecha', fecha.toISOString());
    data.append('aguaConsumida', diario.aguaConsumida.toString());
    data.append('caloriasConsumidas', diario.caloriasConsumidas.toString());
    console.log(data);
    return this.http.put(`${environment.base_url}/diarios/${diario.uid}`, data, getHeaders());
  }

  addAlimentoConsumido(uid: string, alimentoAgregar: any) {
    const data: FormData = new FormData;
    data.append('idUsuario', this.idUsuario);
    data.append('alimentoAgregar', JSON.stringify(alimentoAgregar));
    return this.http.put(`${environment.base_url}/diarios/alimentos-consumidos/${uid}`, data, getHeaders());
  }

  updateCantidadAlimentoConsumido(uid: string, index: number, cantidad: number) {
    const alimentoEditar = { index, cantidad };
    const data: FormData = new FormData;
    data.append('idUsuario', this.idUsuario);
    data.append('alimentoEditar', JSON.stringify(alimentoEditar));
    return this.http.put(`${environment.base_url}/diarios/alimentos-consumidos/${uid}`, data, getHeaders());
  }

  deleteAlimentoConsumido(uid: string, index: number): Observable<any> {
    const alimentoEliminar = { index };
    const data: FormData = new FormData;
    data.append('idUsuario', this.idUsuario);
    data.append('alimentoEliminar', JSON.stringify(alimentoEliminar));
    return this.http.put(`${environment.base_url}/diarios/alimentos-consumidos/${uid}`, data, getHeaders());
  }

}
