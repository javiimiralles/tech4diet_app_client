import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ActividadFisica } from 'src/app/models/actividad-fisica.model';
import { ActividadRealizada } from 'src/app/models/actividad-realizada.model';
import { ActividadesFisicasService } from 'src/app/services/actividades-fisicas.service';
import { ActividadesRealizadasService } from 'src/app/services/actividades-realizadas.service';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-registro-actividad-realizada',
  templateUrl: './registro-actividad-realizada.component.html',
  styleUrls: ['./registro-actividad-realizada.component.scss'],
})
export class RegistroActividadRealizadaComponent  implements OnInit {

  idActividadRealizada: string;
  actividadRealizada: ActividadRealizada;

  saving: boolean = false;
  removing: boolean = false;

  idActividadFisicaPadre: string;
  actividadFisicaPadre: ActividadFisica = new ActividadFisica('');

  fecha: string;
  caloriasGastadas: number = 0;
  duracion: number = 0;
  notas: string = '';

  showError: boolean = false;

  constructor(
    private actividadesFisicasService: ActividadesFisicasService,
    private toastService: ToastService,
    private actividadesRealizadasService: ActividadesRealizadasService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private exceptionsService: ExceptionsService
  ) { }

  ngOnInit() {
    this.fecha = this.actividadesRealizadasService.fechaActual ? this.actividadesRealizadasService.fechaActual.toISOString() : new Date().toISOString();
    this.activatedRoute.queryParams.subscribe(params => {
      this.idActividadRealizada = params['idActividadRealizada'];
      this.idActividadFisicaPadre = params['idActividadPadre'];

      if(this.idActividadRealizada === 'nuevo') {
        this.cargarActividadFisicaPadre();
      } else {
        this.cargarActividadRealizada();
      }
    });
  }

  submit() {
    if(this.duracion == null || this.duracion == 0) {
      this.showError = true;
      return;
    }
    this.showError = false;

    this.saving = true;
    if(this.idActividadRealizada === 'nuevo') {
      this.createActividadRealizada();
    } else {
      this.updateActividadRealizada();
    }
  }

  cargarActividadFisicaPadre() {
    this.actividadesFisicasService.cargarActividadFisicaPorId(this.idActividadFisicaPadre).subscribe(res => {
      this.actividadFisicaPadre = res['actividadFisica'];
      if(this.idActividadRealizada === 'nuevo') {
        this.duracion = this.actividadFisicaPadre.tiempoReferencia;
        this.caloriasGastadas = this.actividadFisicaPadre.calorias;
      }
    }, (err) => {
      this.exceptionsService.throwError(err);
    });
  }

  cargarActividadRealizada() {
    this.actividadesRealizadasService.cargarActividadRealizadaPorId(this.idActividadRealizada).subscribe(res => {
      this.actividadRealizada = res['actividadRealizada'];
      this.fecha = new Date(this.actividadRealizada.fecha).toISOString();
      this.duracion = this.actividadRealizada.duracion;
      this.caloriasGastadas = this.actividadRealizada.caloriasGastadas;
      this.notas = this.actividadRealizada.notas;
      const actividadPadreAux: any = this.actividadRealizada.idActividadFisica;
      this.idActividadFisicaPadre = actividadPadreAux._id;
      this.cargarActividadFisicaPadre();
    }, (err) => {
      this.exceptionsService.throwError(err);
    });
  }

  createActividadRealizada() {
    const fecha: Date = new Date(this.fecha);
    this.actividadRealizada = new ActividadRealizada('', fecha, this.caloriasGastadas, this.duracion, this.notas, this.actividadFisicaPadre.uid);

    this.actividadesRealizadasService.createActividadRealizada(this.actividadRealizada).subscribe(res => {
      this.router.navigateByUrl('/actividad-fisica');
      this.toastService.presentToast('Nueva actividad realizada', 'success');
      this.saving = false;
    }, (err) => {
      this.exceptionsService.throwError(err);
      this.saving = false;
    });
  }

  updateActividadRealizada() {
    const fecha: Date = new Date(this.fecha);
    this.actividadRealizada.fecha = fecha;
    this.actividadRealizada.caloriasGastadas = this.caloriasGastadas;
    this.actividadRealizada.duracion = this.duracion;
    this.actividadRealizada.notas = this.notas;
    const actividadPadreAux: any = this.actividadRealizada.idActividadFisica;
    this.actividadRealizada.idActividadFisica = actividadPadreAux._id;

    this.actividadesRealizadasService.updateActividadRealizada(this.actividadRealizada).subscribe(res => {
      this.router.navigateByUrl('/actividad-fisica');
      this.toastService.presentToast('Actividad editada', 'success');
      this.saving = false;
    }, (err) => {
      this.exceptionsService.throwError(err);
      this.saving = false;
    });
  }

  deleteActividadRealizada() {
    this.removing = true;
    this.actividadesRealizadasService.deleteActividadRealizada(this.idActividadRealizada).subscribe(res => {
      this.router.navigateByUrl('/actividad-fisica');
      this.toastService.presentToast('Actividad eliminada', 'success');
      this.removing = false;
    }, (err) => {
      this.exceptionsService.throwError(err);
      this.removing = false;
    });
  }

  async presentConfirmDeleteAlert() {
    const alert = await this.alertController.create({
      header: '¿Quieres eliminar esta actividad?',
      buttons: [
        {
          text: 'Eliminar',
          cssClass: 'text-danger',
          handler: () => {
            this.deleteActividadRealizada();
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

  onDuracionInputChange(event) {
    if(this.duracion != null) {
      this.caloriasGastadas = Math.round((this.actividadFisicaPadre.calorias * this.duracion)/this.actividadFisicaPadre.tiempoReferencia);
    } else {
      this.caloriasGastadas = 0;
    }
  }


}
