import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Alimento } from 'src/app/models/alimento.model';
import { AlimentosService } from 'src/app/services/alimentos.service';
import { DiariosService } from 'src/app/services/diarios.service';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-alimento-form',
  templateUrl: './alimento-form.component.html',
  styleUrls: ['./alimento-form.component.scss'],
})
export class AlimentoFormComponent  implements OnInit {

  idAlimento: string = '';

  saving: boolean = false;

  nombreInput: string;
  marcaInput: string;
  cantidadInput: number = 100;
  unidadSelect: string = 'gramos';
  unidadPersonalizada: string = '';
  caloriasInput: number;
  carbosInput: number;
  proteinasInput: number;
  grasasInput: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alimentosService: AlimentosService,
    private toastService: ToastService,
    private diariosService: DiariosService,
    private exceptionsService: ExceptionsService) { }

  ngOnInit() {
    this.idAlimento = this.activatedRoute.snapshot.params['uid'];
    if(this.idAlimento === 'capturado') {
      this.fillForm(this.alimentosService.alimentoCapturado);
    } else if(this.idAlimento !== 'nuevo') {
      this.alimentosService.cargarAlimentoPorId(this.idAlimento).subscribe(res => {
        this.fillForm(res['alimento']);
      }, (err) => {
        this.exceptionsService.throwError(err);
      });
    }
  }

  fillForm(alimento: Alimento) {
    this.nombreInput = alimento.nombre;
    this.marcaInput = alimento.marca != null ? alimento.marca : '';
    this.cantidadInput = alimento.cantidadReferencia;
    if(alimento.unidadMedida === 'gramos' || alimento.unidadMedida === 'mililitros' || alimento.unidadMedida === 'unidades') {
      this.unidadSelect = alimento.unidadMedida;
    } else {
      this.unidadSelect = 'otro';
      this.unidadPersonalizada = alimento.unidadMedida;
    }
    this.caloriasInput = alimento.calorias;
    this.carbosInput = alimento.carbohidratos;
    this.proteinasInput = alimento.proteinas;
    this.grasasInput = alimento.grasas;
  }

  checkUnidad(event: any) {
    if (event.detail.value !== 'otro') {
      this.unidadPersonalizada = '';
    }
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.saving = true;
      const unidad = this.unidadSelect !== 'otro' ? this.unidadSelect : this.unidadPersonalizada;
      const alimento = new Alimento(null, this.nombreInput, this.marcaInput, this.cantidadInput, unidad, this.caloriasInput,
        this.carbosInput, this.proteinasInput, this.grasasInput);

      if(this.idAlimento === 'nuevo' || this.idAlimento === 'capturado') {
        this.createAlimento(alimento);
      } else {
        this.updateAlimento(alimento);
      }
    } else {
      Object.keys(form.controls).forEach(key => {
        form.controls[key].markAsTouched();
      });
    }
  }

  createAlimento(alimento: Alimento) {
    this.alimentosService.createAlimento(alimento).subscribe(res => {
      this.diariosService.idAlimentoActual = res['alimento'].uid;
      this.router.navigateByUrl('/alimentos/registro');
      this.toastService.presentToast('Alimento creado', 'success');
      this.saving = false;
    }, (err) => {
      this.router.navigateByUrl('/alimentos/list');
      this.exceptionsService.throwError(err);
      this.saving = false;
    });
  }

  updateAlimento(alimento: Alimento) {
    this.alimentosService.updateAlimento(this.idAlimento, alimento).subscribe(res => {
      this.diariosService.idAlimentoActual = this.idAlimento;
      this.router.navigateByUrl('/alimentos/registro');
      this.toastService.presentToast('Alimento editado', 'success');
      this.saving = false;
    }, (err) => {
      this.router.navigateByUrl('/alimentos/list');
      this.exceptionsService.throwError(err);
      this.saving = false;
    });
  }

}
