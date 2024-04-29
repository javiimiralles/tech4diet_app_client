import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NutritionalInfoInterface } from 'src/app/interfaces/nutritional-info.interface';
import { Alimento } from 'src/app/models/alimento.model';
import { AlimentosService } from 'src/app/services/alimentos.service';
import { DiariosService } from 'src/app/services/diarios.service';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { ToastService } from 'src/app/services/toast.service';
import { getAbrebiaturaUnidadMedida } from 'src/app/utils/unidad-medida.utils';

@Component({
  selector: 'app-registro-alimento-form',
  templateUrl: './registro-alimento-form.component.html',
  styleUrls: ['./registro-alimento-form.component.scss'],
})
export class RegistroAlimentoFormComponent  implements OnInit {

  alimento: Alimento = new Alimento('');
  unidadAbrebiada: string = '';
  idDiario: string;
  cantidadInput: number;
  categoria: string;
  errorMensaje: string = '';
  saving: boolean = false;

  caloriasCalculadas: number = 0;
  carbosCalculados: number = 0;
  proteinasCalculadas: number = 0;
  grasasCalculadas: number = 0;

  infoNutricional: NutritionalInfoInterface[] = [
    { texto: 'Calorias', valorReferencia: 0, valorCalculado: 0, color: 'primary-color' },
    { texto: 'Carbohidratos', valorReferencia: 0, valorCalculado: 0, color: 'secondary-color' },
    { texto: 'Proteínas', valorReferencia: 0, valorCalculado: 0, color: 'warning-color' },
    { texto: 'Grasas', valorReferencia: 0, valorCalculado: 0, color: 'custom-yellow-color' },
  ];

  constructor(
    private router: Router,
    private alimentosService: AlimentosService,
    private toastService: ToastService,
    private diariosService: DiariosService,
    private exceptionsService: ExceptionsService) { }

  ngOnInit() {
    const idAlimento: string = this.diariosService.idAlimentoActual;
    this.idDiario = this.diariosService.idDiarioActual;
    this.categoria = this.diariosService.categoriaActual;

    this.alimentosService.cargarAlimentoPorId(idAlimento).subscribe(res => {
      if(res['alimento']) {
        this.alimento = res['alimento'];
        this.cantidadInput = this.alimento.cantidadReferencia;
        this.calcularInformacioNutricional();
        this.unidadAbrebiada = getAbrebiaturaUnidadMedida(this.alimento.unidadMedida);

        this.infoNutricional[0].valorReferencia = this.alimento.calorias;
        this.infoNutricional[1].valorReferencia = this.alimento.carbohidratos;
        this.infoNutricional[2].valorReferencia = this.alimento.proteinas;
        this.infoNutricional[3].valorReferencia = this.alimento.grasas;
      }
    }, (err) => {
      this.router.navigateByUrl('/alimentos');
      this.exceptionsService.throwError(err);
    })
  }

  onCantidadInputChange(event) {
    this.calcularInformacioNutricional();
  }

  calcularInformacioNutricional() {
    this.caloriasCalculadas = (this.alimento.calorias * this.cantidadInput) / this.alimento.cantidadReferencia;
    this.carbosCalculados = (this.alimento.carbohidratos * this.cantidadInput) / this.alimento.cantidadReferencia;
    this.proteinasCalculadas = (this.alimento.proteinas * this.cantidadInput) / this.alimento.cantidadReferencia;
    this.grasasCalculadas = (this.alimento.grasas * this.cantidadInput) / this.alimento.cantidadReferencia;

    this.infoNutricional[0].valorCalculado = this.caloriasCalculadas;
    this.infoNutricional[1].valorCalculado = this.carbosCalculados;
    this.infoNutricional[2].valorCalculado = this.proteinasCalculadas;
    this.infoNutricional[3].valorCalculado = this.grasasCalculadas;
  }

  registrarAlimentoConsumido() {
    if(!this.validarCantidad()) {
      this.errorMensaje = 'Introduce una cantidad mayor que cero';
      return;
    }

    this.saving = true;

    this.errorMensaje = '';

    const alimentoAgregar: any = {
      idAlimento: this.diariosService.idAlimentoActual,
      cantidad: this.cantidadInput,
      categoria: this.categoria
    }

    this.diariosService.addAlimentoConsumido(this.idDiario, alimentoAgregar).subscribe(res => {
      this.router.navigateByUrl('/alimentos');
      this.toastService.presentToast('Alimento añadido', 'success');
      this.saving = false;
    }, (err) => {
      this.router.navigateByUrl('/alimentos');
      this.exceptionsService.throwError(err);
      this.saving = false;
    })
  }

  validarCantidad() {
    return this.cantidadInput != null && this.cantidadInput > 0;
  }

}
