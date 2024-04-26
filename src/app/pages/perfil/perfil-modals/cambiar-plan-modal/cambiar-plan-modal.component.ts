import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cambiar-plan-modal',
  templateUrl: './cambiar-plan-modal.component.html',
  styleUrls: ['./cambiar-plan-modal.component.scss'],
})
export class CambiarPlanModalComponent {

  @Input() plan: any;

  constructor(private modalController: ModalController) { }

  close() {
    this.modalController.dismiss();
  }

  confirm() {
    this.modalController.dismiss(this.plan);
  }

  selectPlan(tipoPlan: string) {
    this.plan.tipo = tipoPlan;
  }

}
