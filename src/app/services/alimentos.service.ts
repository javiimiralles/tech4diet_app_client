import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UsuariosService } from './usuarios.service';
import { Alimento } from '../models/alimento.model';
import { getHeaders } from '../utils/headers.utils';

@Injectable({
  providedIn: 'root'
})
export class AlimentosService {

  idUsuario: string = this.usuariosService.uid;
  alimentoCapturado: Alimento;

  constructor(private http: HttpClient, private usuariosService: UsuariosService) {}

  cargarAlimentoPorId(uid: string) {
    return this.http.get(`${environment.base_url}/alimentos/${uid}`, getHeaders());
  }

  cargarAlimentosPorUsuario(resultados: number, textoBusqueda: string) {
    return this.http.get(`${environment.base_url}/alimentos/usuario/${this.idUsuario}?resultados=${resultados}&texto=${textoBusqueda}`, getHeaders());
  }

  cargarAlimentoOpenFoodFactsPorBarcode(barcode: string) {
    return this.http.get(`${environment.base_url}/open-food-facts/product/${barcode}`, getHeaders());
  }

  cargarAlimentosOpenFoodFacts(resultados: number, textoBusqueda: string) {
    return this.http.get(`${environment.base_url}/open-food-facts/search?query=${textoBusqueda}&resultados=${resultados}`, getHeaders());
  }

  createAlimento(alimento: Alimento) {
    const data: FormData = this.getFormData(alimento);
    return this.http.post(`${environment.base_url}/alimentos`, data, getHeaders());
  }

  updateAlimento(uid: string, alimento: Alimento) {
    const data: FormData = this.getFormData(alimento);
    return this.http.put(`${environment.base_url}/alimentos/${uid}`, data, getHeaders());
  }

  private getFormData(alimento: Alimento): FormData {
    const data: FormData = new FormData;
    data.append('nombre', alimento.nombre);
    if(alimento.marca != null && alimento.marca !== '') {
      data.append('marca', alimento.marca);
    }
    data.append('cantidadReferencia', (alimento.cantidadReferencia).toString());
    data.append('unidadMedida', alimento.unidadMedida);
    data.append('calorias', (alimento.calorias).toString());
    data.append('carbohidratos', (alimento.carbohidratos).toString());
    data.append('proteinas', (alimento.proteinas).toString());
    data.append('grasas', (alimento.grasas).toString());
    data.append('idUsuario', this.idUsuario);

    return data;
  }
}
