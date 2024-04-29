import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario.model';
import { ToastService } from 'src/app/services/toast.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { PesoObjetivoModalComponent } from '../perfil-modals/peso-objetivo-modal/peso-objetivo-modal.component';
import { DistribucionComidasModalComponent } from '../perfil-modals/distribucion-comidas-modal/distribucion-comidas-modal.component';
import { CambiarPasswordModalComponent } from '../perfil-modals/cambiar-password-modal/cambiar-password-modal.component';
import { CambiarPlanModalComponent } from '../perfil-modals/cambiar-plan-modal/cambiar-plan-modal.component';
import { Router } from '@angular/router';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { NivelActividadModalComponent } from '../perfil-modals/nivel-actividad-modal/nivel-actividad-modal.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

  nombre: string;
  email: string;
  altura: number;
  edad: number;
  sexo: string;
  pesoObjetivo: number;
  pesoObjetivoEntero: number;
  pesoObjetivoDecimal: number;
  plan: any;
  distribucionComidas: string[];
  configuracion: any;

  establecerObjetivoTxt: string;

  borrandoCuenta: boolean = false;
  saving: boolean = false;

  constructor(
    private usuariosService: UsuariosService,
    private toastService: ToastService,
    private modalController: ModalController,
    private router: Router,
    private alertController: AlertController,
    private exceptionsService: ExceptionsService) {}

  ngOnInit() {
    this.setData();
  }

  setData() {
    this.nombre = this.usuariosService.nombre;
    this.email = this.usuariosService.email;
    this.altura = this.usuariosService.altura;
    this.edad = this.usuariosService.edad;
    this.sexo = this.usuariosService.sexo;
    this.pesoObjetivo = this.usuariosService.pesoObjetivo;
    this.pesoObjetivoEntero = this.pesoObjetivo != null ? Math.floor(this.pesoObjetivo) : 70;
    this.pesoObjetivoDecimal = this.pesoObjetivo != null ? Math.round((this.pesoObjetivo - this.pesoObjetivoEntero)*100) : 0;
    this.plan = this.usuariosService.plan;
    this.distribucionComidas = this.usuariosService.distribucionComidas;
    this.configuracion = this.usuariosService.configuracion;
    this.establecerObjetivoTxt = this.usuariosService.pesoObjetivo ? 'Cambiar peso objetivo' : 'Establecer peso objetivo';
  }

  handleGenderChange(event) {
    this.sexo = event.target.value;
  }

  updateUser() {
    this.saving = true;
    const usuario = new Usuario(this.usuariosService.uid, this.nombre, this.email, null, this.sexo, this.altura, this.edad, null,
      this.pesoObjetivo, null, null, this.plan, this.distribucionComidas, this.configuracion);

    this.usuariosService.updateUser(usuario).subscribe(res => {
      this.updateInfoUser();
      this.toastService.presentToast('Perfil actualizado', 'success');
      this.saving = false;
    }, (err) => {
      this.exceptionsService.throwError(err);
      this.saving = false;
    })
  }

  deleteUser() {
    this.borrandoCuenta = true;
    this.usuariosService.deleteUser().subscribe(res => {
      this.router.navigateByUrl('/login');
      this.toastService.presentToast('Cuenta eliminada', 'success');
      this.borrandoCuenta = false;
    }, (err) => {
      this.borrandoCuenta = false;
      this.exceptionsService.throwError(err);
    });
  }

  updateInfoUser() {
    this.usuariosService.validarToken().subscribe(res => { this.setData() });
  }

  logout() {
    this.usuariosService.logout();
  }

  async presentDeleteAccountAlert() {
    const alert = await this.alertController.create({
      header: '¡ATENCIÓN! Estás a punto de eliminar tu cuenta',
      message: 'Todos los datos y registros se borrarán y no se podrán recuperar',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          cssClass: 'text-danger',
          handler: () => {
            this.deleteUser();
          }
        }
      ],
    });

    await alert.present();
  }

  // ============ Controladores de los modales ======================= //
  async openPesoObjetivoModal() {
    const modal = await this.modalController.create({
      component: PesoObjetivoModalComponent,
      componentProps: {
        pesoObjetivoEntero: this.pesoObjetivoEntero,
        pesoObjetivoDecimal: this.pesoObjetivoDecimal,
        establecerObjetivoTxt: this.establecerObjetivoTxt,
        tieneObjetivo: this.pesoObjetivo != null
      }
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    if(data) {
      if(data.removePesoObjetivo) {
        this.pesoObjetivoEntero = 70;
        this.pesoObjetivoDecimal = 0;
        this.pesoObjetivo = null;
      } else {
        this.pesoObjetivoEntero = data.pesoObjetivoEntero;
        this.pesoObjetivoDecimal = data.pesoObjetivoDecimal;
        this.pesoObjetivo = this.pesoObjetivoEntero + (this.pesoObjetivoDecimal / 100);
      }

      this.updateUser();
    }
  }

  async openCambiarPlanModal() {
    const modal = await this.modalController.create({
      component: CambiarPlanModalComponent,
      componentProps: {
        plan: this.plan
      }
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    if(data) {
      this.plan = data;
      this.updateUser();
    }
  }

  async openCambiarNivelActividadModal() {
    const modal = await this.modalController.create({
      component: NivelActividadModalComponent,
      componentProps: {
        nivelActividad: this.plan.nivelActividad
      }
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    if(data) {
      this.plan.nivelActividad = data;
      this.updateUser();
    }
  }

  async openDistribucionComidasModal() {
    const modal = await this.modalController.create({
      component: DistribucionComidasModalComponent,
      componentProps: {
        distribucionComidas: this.distribucionComidas
      }
    });
    modal.present();

    const { data } = await modal.onWillDismiss();

    if(data) {
      this.distribucionComidas = data;
      this.updateUser();
    }
  }

  async openCambiarPasswordModal() {
    const modal = await this.modalController.create({
      component: CambiarPasswordModalComponent
    });
    modal.present();
  }

}
