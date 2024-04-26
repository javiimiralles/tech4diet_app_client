import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class ExceptionsService {

  constructor(private toastService: ToastService) {}

  throwError(err) {
    console.error(err);
    const msg = err.error.msg || 'Ha ocurrido un error, inténtelo de nuevo';
    this.toastService.presentToast(msg, 'danger');
  }

}
