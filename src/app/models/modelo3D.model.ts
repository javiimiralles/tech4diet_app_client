import { environment } from "src/environments/environment";

export class Modelo3D {
  constructor(
    public uid: string,
    public nombre?: string,
    public fecha?: Date,
    public url?: string,
    public idUsuario?: string
  ) {}

  get parsedUrl() {
    const token = localStorage.getItem('token') || '';
    console.log('El token es: ' + token);
    const urlPratida = this.url.split('/');
    const fileName = urlPratida[urlPratida.length - 1];
    return `${environment.base_url}/uploads/${fileName}?token=${token}`;
  }
}
