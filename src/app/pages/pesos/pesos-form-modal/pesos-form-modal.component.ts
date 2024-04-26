import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { RegistroPeso } from 'src/app/models/registro-peso.model';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { PesosService } from 'src/app/services/pesos.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-pesos-form-modal',
  templateUrl: './pesos-form-modal.component.html',
  styleUrls: ['./pesos-form-modal.component.scss'],
})
export class PesosFormModalComponent  implements OnInit {

  @Input() registroEdicion: RegistroPeso;

  modalHeader: string = '';
  fechaSeleccionada: Date = new Date();
  fechaFormateada: string = '';
  peso: number = this.usuariosService.pesoActual;
  showError: boolean = false;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private usuariosService: UsuariosService,
    private pesosService: PesosService,
    private toastService: ToastService,
    private exceptionsService: ExceptionsService
  ) { }

  ngOnInit() {
    if(!this.registroEdicion) {
      this.fechaSeleccionada = new Date();
      this.fechaFormateada = new Date().toLocaleDateString();
      this.modalHeader = 'Nuevo registro de peso';
    } else {
      this.peso = this.registroEdicion.peso;
      this.fechaSeleccionada = new Date(this.registroEdicion.fecha);
      this.fechaFormateada = this.fechaSeleccionada.toLocaleDateString();
      this.modalHeader = 'Editar registro de peso';
    }
  }

  enviarFormulario() {
    if(this.peso != null && this.peso > 0) {
      this.showError = false;
      const date: Date = new Date(this.fechaSeleccionada);
      if(!this.registroEdicion) {
        const registro: RegistroPeso = new RegistroPeso(null, date, this.peso);
        this.crearRegistroPeso(registro);
      } else {
        const registro: RegistroPeso = new RegistroPeso(this.registroEdicion.uid, date, this.peso);
        this.editarRegistroPeso(registro);
      }
    } else {
      this.showError = true;
    }
  }

  crearRegistroPeso(registro: RegistroPeso) {
    this.pesosService.createRegistroPeso(registro).subscribe(res => {
      if(res['registro']) {
        this.modalController.dismiss({ ok: true });
        this.toastService.presentToast('Registro de peso creado', 'success');
      }
    }, (err) => {
      this.exceptionsService.throwError(err);
    })
  }

  editarRegistroPeso(registro: RegistroPeso) {
    this.pesosService.updateRegistroPeso(registro).subscribe(res => {
      if(res['registro']) {
        this.modalController.dismiss({ ok: true });
        this.toastService.presentToast('Registro de peso editado', 'success');
      }
    }, (err) => {
      this.exceptionsService.throwError(err);
    })
  }

  async openDatePicker() {
    const alert = await this.alertController.create({
      header: 'Selecciona una fecha',
      inputs: [
        {
          name: 'fecha',
          type: 'date',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Aceptar',
          handler: (data) => {
            if(data.fecha) {
              this.fechaSeleccionada = data.fecha;
              this.fechaFormateada = this.formatDate(data.fecha);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  formatDate(date: string) {
    const dateArray = date.split('-');
    return `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;
  }
}
