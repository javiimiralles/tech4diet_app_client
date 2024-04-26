import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal } from '@ionic/angular';
import { MedidaCorporal } from 'src/app/models/medida-corporal.model';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { MedidasCorporalesService } from 'src/app/services/medidas-corporales.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-medidas-corporales',
  templateUrl: './medidas-corporales.component.html',
  styleUrls: ['./medidas-corporales.component.scss'],
})
export class MedidasCorporalesComponent  implements OnInit {

  selectedDate: Date = new Date();
  medidasCorporales: MedidaCorporal[] = [];
  cambiosDetectados: { [key: string]: { medida1: boolean; medida2: boolean } } = {};

  // para la creacion de medidas corporales
  @ViewChild(IonModal) modal: IonModal;
  nombreNuevaMedida: string;
  esBilateral: boolean = false;
  showError: boolean = false;

  constructor(
    private medidasCorporalesService: MedidasCorporalesService,
    private toastService: ToastService,
    private alertController: AlertController,
    private exceptionsService: ExceptionsService) { }

  ngOnInit() {
    this.cargarMedidasCorporales();
  }

  cargarMedidasCorporales() {
    this.medidasCorporalesService.cargarMedidasCorporalesPorUsuario().subscribe(res => {
      if(res['medidas']) {
        this.medidasCorporales = res['medidas'];
        this.medidasCorporales.forEach((medida) => {
          this.cambiosDetectados[medida.uid] = { medida1: false, medida2: false };
        });

      }
    }, (err) => {
      this.exceptionsService.throwError(err);
    });
  }

  createMedidaCorporal() {
    if(this.nombreNuevaMedida == null || this.nombreNuevaMedida === '') {
      this.showError = true;
      return;
    }

    const medida = new MedidaCorporal('', this.nombreNuevaMedida, this.esBilateral);

    this.medidasCorporalesService.createMedidaCorporal(medida).subscribe(res => {
      this.cargarMedidasCorporales();
      this.closeModal();
      this.toastService.presentToast('Medida creada', 'success');
      this.resetForm();
    }, (err) => {
      this.exceptionsService.throwError(err);
    });
  }

  updateMedidaCorporal(medida: MedidaCorporal, campo: 'medida1' | 'medida2') {
    // por si quiere eliminar los valores de las medidas
    if(!medida.medida1) medida.medida1 = null;
    if(!medida.medida2) medida.medida2 = null;

    this.medidasCorporalesService.updateMedidaCorporal(medida).subscribe(res => {
      this.toastService.presentToast('Medida guardada', 'success');
      if (campo === 'medida1') {
        this.cambiosDetectados[medida.uid].medida1 = false;
      } else if (campo === 'medida2') {
        this.cambiosDetectados[medida.uid].medida2 = false;
      }
    }, (err) => {
      this.exceptionsService.throwError(err);
    });
  }

  deleteMedidaCorporal(id: string) {
    this.medidasCorporalesService.deleteMedidaCorporal(id).subscribe(res => {
      this.cargarMedidasCorporales();
      this.toastService.presentToast('Medida eliminada', 'success');
    }, (err) => {
      this.exceptionsService.throwError(err);
    });
  }

  async presentConfirmDeleteAlert(id: string, event: Event) {
    event.stopPropagation();

    const alert = await this.alertController.create({
      header: '¿Quieres eliminar la medida corporal?',
      buttons: [
        {
          text: 'Eliminar',
          cssClass: 'text-danger',
          handler: () => {
            this.deleteMedidaCorporal(id);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    });

    await alert.present();
  }

  detectarCambios(id: string, campo: 'medida1' | 'medida2') {
    if (campo === 'medida1') {
      this.cambiosDetectados[id].medida1 = true;
    } else if (campo === 'medida2') {
      this.cambiosDetectados[id].medida2 = true;
    }
  }

  closeModal() {
    this.modal.dismiss();
  }

  resetForm() {
    this.nombreNuevaMedida = '';
    this.esBilateral = false;
    this.showError = false;
  }

}
