import { Component, Input } from '@angular/core';
import { AlertController, ItemReorderEventDetail, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-distribucion-comidas-modal',
  templateUrl: './distribucion-comidas-modal.component.html',
  styleUrls: ['./distribucion-comidas-modal.component.scss'],
})
export class DistribucionComidasModalComponent {

  @Input() distribucionComidas: string[];

  constructor(
    private modalController: ModalController,
    private alertController: AlertController) { }

  close() {
    this.modalController.dismiss();
  }

  confirm() {
    this.modalController.dismiss(this.distribucionComidas);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Añadir comida',
      inputs: [
        {
          placeholder: 'Escribe aquí',
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'text-danger d-inline',
        },
        {
          text: 'Aceptar',
          cssClass: 'd-inline',
          handler: (data) => {
            if (data[0] != null && data[0] !== '') {
              this.distribucionComidas.push(data[0]);
            } else {
              return;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  deleteComida(index: number) {
    this.distribucionComidas.splice(index, 1);
  }

  handleReorderDistribucion(ev: CustomEvent<ItemReorderEventDetail>) {
    this.distribucionComidas = ev.detail.complete(this.distribucionComidas);
  }

}
