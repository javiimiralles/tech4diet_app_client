import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActividadFisica } from 'src/app/models/actividad-fisica.model';
import { ActividadesFisicasService } from 'src/app/services/actividades-fisicas.service';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-actividad-fisica-form',
  templateUrl: './actividad-fisica-form.component.html',
  styleUrls: ['./actividad-fisica-form.component.scss'],
})
export class ActividadFisicaFormComponent  implements OnInit {

  idActividadFisica: string;
  actividadFisica: ActividadFisica;

  saving: boolean = false;

  nombre: string;
  calorias: number;
  tiempoReferencia: number;
  showNombreError: boolean = false;
  showCaloriasError: boolean = false;
  showTiempoError: boolean = false;

  constructor(
    private actividadesFisicasService: ActividadesFisicasService,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private exceptionsService: ExceptionsService
  ) { }

  ngOnInit() {
    this.idActividadFisica = this.activatedRoute.snapshot.params['uid'];
    if(this.idActividadFisica !== 'nuevo') {
      this.cargarActividadFisica();
    }
  }

  get disabledButton(): boolean {
    if(this.hasError(this.nombre) || this.hasError(this.calorias) || this.hasError(this.tiempoReferencia)) {
      return true;
    }
    return false;
  }

  cargarActividadFisica() {
    this.actividadesFisicasService.cargarActividadFisicaPorId(this.idActividadFisica).subscribe(res => {
      this.actividadFisica = res ['actividadFisica'];
      this.fillForm();
    }, (err) => {
      this.exceptionsService.throwError(err);
    });
  }

  createActividadFisica() {
    this.actividadFisica = new ActividadFisica('', this.nombre, this.calorias, this.tiempoReferencia, false);
    this.actividadesFisicasService.createActividadFisica(this.actividadFisica).subscribe(res => {
      this.router.navigateByUrl('/actividad-fisica/list');
      this.toastService.presentToast('Actividad creada', 'success');
      this.saving = false;
    }, (err) => {
      this.exceptionsService.throwError(err);
      this.saving = false;
    });
  }

  updateActividadFisica() {
    this.actividadFisica.nombre = this.nombre;
    this.actividadFisica.tiempoReferencia = this.tiempoReferencia;
    this.actividadFisica.calorias = this.calorias;
    this.actividadesFisicasService.updateActividadFisica(this.actividadFisica).subscribe(res => {
      this.router.navigateByUrl('/actividad-fisica/list');
      this.toastService.presentToast('Actividad editada', 'success');
      this.saving = false;
    }, (err) => {
      this.exceptionsService.throwError(err);
      this.saving = false;
    });
  }

  fillForm() {
    this.nombre = this.actividadFisica.nombre;
    this.calorias = this.actividadFisica.calorias;
    this.tiempoReferencia = this.actividadFisica.tiempoReferencia;
  }

  submit() {
    this.showNombreError = this.hasError(this.nombre);
    this.showTiempoError = this.hasError(this.tiempoReferencia);
    this.showCaloriasError = this.hasError(this.calorias);

    if(this.showNombreError || this.showTiempoError || this.showCaloriasError) return;

    this.saving = true;
    if(this.idActividadFisica === 'nuevo') {
      this.createActividadFisica();
    } else {
      this.updateActividadFisica();
    }
  }

  hasError(campo: any) {
    if(typeof campo === 'string') {
      return campo == null || campo === '';
    } else {
      return campo == null || campo <= 0;
    }
  }

}
