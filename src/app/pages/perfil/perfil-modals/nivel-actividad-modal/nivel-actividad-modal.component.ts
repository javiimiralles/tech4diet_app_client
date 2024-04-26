import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-nivel-actividad-modal',
  templateUrl: './nivel-actividad-modal.component.html',
  styleUrls: ['./nivel-actividad-modal.component.scss'],
})
export class NivelActividadModalComponent {

  @Input() nivelActividad: string;

  constructor(private modalController: ModalController) { }

  close() {
    this.modalController.dismiss();
  }

  confirm() {
    this.modalController.dismiss(this.nivelActividad);
  }

  handleNivelActividadChange(event) {
    this.nivelActividad = event.target.value;
  }

}
