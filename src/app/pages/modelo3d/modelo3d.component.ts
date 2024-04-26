import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Modelo3D } from 'src/app/models/modelo3D.model';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { Modelos3DService } from 'src/app/services/modelos3D.service';
import { MotorGraficoService } from 'src/app/services/motor-grafico.service';
import { Modelo3dFormModalComponent } from './modelo3d-form-modal/modelo3d-form-modal.component';
import { environment } from 'src/environments/environment';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-modelo3d',
  templateUrl: './modelo3d.component.html',
  styleUrls: ['./modelo3d.component.scss'],
})
export class Modelo3dComponent  implements OnInit {

  modelos3D: Modelo3D[] = [];
  currentIndex: number;
  existeModelo: boolean = false;
  noResultsFound: boolean = false;
  loadingModel: boolean = true;

  formatedDate: string = '';

  constructor(
    private modelos3dService: Modelos3DService,
    private motorGraficoService: MotorGraficoService,
    private exceptionsService: ExceptionsService,
    private modalController: ModalController,
    private alertController: AlertController,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.getModelos3D();
  }

  getModelos3D() {
    this.modelos3dService.getModelos3DByUser().subscribe({
      next: (res) => {
        this.modelos3D = res['modelos3D'];
        if(!this.modelos3D || this.modelos3D.length == 0) {
          this.motorGraficoService.reset();
          this.noResultsFound = true;
          this.loadingModel = false;
        } else {
          this.noResultsFound = false;
          this.currentIndex = this.modelos3D.length - 1;
          this.formatDate();
          this.cargarModelo3D();
        }
      },
      error: (err) => {
        this.loadingModel = false;
        this.exceptionsService.throwError(err);
      }
    })
  }

  cargarModelo3D() {
    this.loadingModel = true;
    this.motorGraficoService.init();
    this.loadingModel = !this.motorGraficoService.isLoaded;

    this.motorGraficoService.loadModel('./assets/modelo3D/light.hdr', this.parseUrl(this.modelos3D[this.currentIndex].url), () => {
      if(!this.motorGraficoService.isLoaded) {
        this.loadingModel = false;
        this.existeModelo = true;
        this.motorGraficoService.render();
      }
    })
  }

  async presentdeleteModeloAlert() {
    const alert = await this.alertController.create({
      header: '¿Quieres eliminar el modelo 3D?',
      subHeader: 'No podrás recuperarlo',
      buttons: [
        {
          text: 'Eliminar',
          cssClass: 'text-danger',
          handler: () => {
            this.deleteModelo3D();
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

  deleteModelo3D() {
    this.modelos3dService.deleteModelo3D(this.modelos3D[this.currentIndex].uid).subscribe({
      next: () => {
        this.toastService.presentToast('Modelo 3D eliminado', 'success');
        this.getModelos3D();
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }

  parseUrl(currentUrl: string) {
    const token = localStorage.getItem('token') || '';
    const urlPratida = currentUrl.split('/');
    const fileName = urlPratida[urlPratida.length - 1];
    return `${environment.base_url}/uploads/${fileName}?token=${token}`;
  }

  async openModelo3DFormModal() {
    const modal = await this.modalController.create({
      component: Modelo3dFormModalComponent,
    });

    await modal.present();

    const { role } = await modal.onWillDismiss();

    if(role === 'confirm') {
      this.getModelos3D();
    }
  }

  changeDate(offset: number) {
    this.currentIndex += offset;
    this.motorGraficoService.reset();
    this.formatDate();
    this.cargarModelo3D();
  }

  formatDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const currentDate = new Date(this.modelos3D[this.currentIndex].fecha);
    currentDate.setHours(0, 0, 0, 0);

    if (currentDate.toDateString() === today.toDateString()) {
      this.formatedDate = 'Hoy';
    } else if (currentDate.toDateString() === yesterday.toDateString()) {
      this.formatedDate = 'Ayer';
    } else if (currentDate.toDateString() === tomorrow.toDateString()) {
      this.formatedDate = 'Mañana';
    } else {
      this.formatedDate = currentDate.toLocaleDateString('en-GB').replace(/\//g, '/');
    }
  }

}
