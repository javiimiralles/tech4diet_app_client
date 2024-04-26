import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-peso-objetivo-modal',
  templateUrl: './peso-objetivo-modal.component.html',
  styleUrls: ['./peso-objetivo-modal.component.scss'],
})
export class PesoObjetivoModalComponent  implements OnInit {

  @Input() pesoObjetivoEntero: number;
  @Input() pesoObjetivoDecimal: number;
  @Input() establecerObjetivoTxt: string;
  @Input() tieneObjetivo: boolean;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  onTargetIntChange(weightInt: number) {
    this.pesoObjetivoEntero = weightInt;
  }

  onTargetDecimalChange(weightDecimal: number) {
    this.pesoObjetivoDecimal = weightDecimal;
  }

  close() {
    this.modalController.dismiss();
  }

  confirm(removePesoObjetivo: boolean) {
    const data = {
      removePesoObjetivo,
      pesoObjetivoEntero: this.pesoObjetivoEntero,
      pesoObjetivoDecimal: this.pesoObjetivoDecimal
    }
    this.modalController.dismiss(data);
  }

}
