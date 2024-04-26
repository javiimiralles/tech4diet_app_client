import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Diario } from 'src/app/models/diario.model';
import { DiariosService } from 'src/app/services/diarios.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { getAbrebiaturaUnidadMedida } from 'src/app/utils/unidad-medida.utils';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions
} from 'ng-apexcharts';
import { ExceptionsService } from 'src/app/services/exceptions.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  labels: string[];
  chart: ApexChart;
  colors: string[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions
};

@Component({
  selector: 'app-alimentos-view',
  templateUrl: './alimentos-view.component.html',
  styleUrls: ['./alimentos-view.component.scss'],
})
export class AlimentosViewComponent  implements OnInit {

  selectedDate: Date = new Date();
  segmentActual: 'diario' | 'estadisticas' = 'diario';

  loading: boolean = true;

  diario: any = new Diario('');
  planUsuario = this.usuariosService.plan;

  distribucionComidas: string[] = this.usuariosService.distribucionComidas;
  categoriasAlimentos: string[] = [];
  caloriasTotalesPorCategoria: number[] = [];

  chartOptionsMacros: Partial<ChartOptions>;
  chartOptionsCalorias: Partial<ChartOptions>;

  constructor(
    private router: Router,
    private diariosService: DiariosService,
    private toastService: ToastService,
    private usuariosService: UsuariosService,
    private alertController: AlertController,
    private exceptionsService: ExceptionsService) { }

  ngOnInit() {
    this.loading = true;
    this.cargarDiarioPorFecha(this.selectedDate);
  }

  getCategorias() {
    const alimentos = this.diario.alimentosConsumidos;
    alimentos.forEach(alimento => {
      if(!this.categoriasAlimentos.includes(alimento.categoria)) {
        this.categoriasAlimentos.push(alimento.categoria);
      }
    });
  }

  // Crea un array de number, donde cada numero corresponde a las calorias
  // totales de la comida que ocupa su posicion en distribucionComidas
  calcularMacrosTotalesPorCategoria() {
    this.caloriasTotalesPorCategoria = [];
    const restoComidas: any[] = []; // son alimentos que no pertenecen a ninguna categoria
    let caloriasRestoComidas: number = 0;
    this.distribucionComidas.forEach(categoria => {
      let caloriasTotales: number = 0;
      this.diario.alimentosConsumidos.forEach(alimento => {
        if(alimento.categoria === categoria) {
          caloriasTotales += alimento.calorias;
        } else if(!this.distribucionComidas.includes(alimento.categoria) && !restoComidas.includes(alimento)) {
          restoComidas.push(alimento);
          caloriasRestoComidas += alimento.calorias;
        }
      });
      this.caloriasTotalesPorCategoria.push(caloriasTotales);
    });

    if(restoComidas.length > 0) {
      this.caloriasTotalesPorCategoria.push(caloriasRestoComidas);
      this.distribucionComidas.push('Otras comidas');
    }
  }

  onDateChange(dates: any) {
    this.selectedDate = dates.startDate;
    this.cargarDiarioPorFecha(this.selectedDate);
  }

  onSegmentChange(event) {
    this.segmentActual = event.detail.value;
  }

  cargarDiarioPorFecha(date: Date) {
    this.diariosService.cargarDiarioPorFecha(date).subscribe(res => {
      if(!res['diario']) {
        this.crearDiario(date);
      } else {
        this.diario = res['diario'];
        this.cargarDatosIniciales();
      }
    }, (err) => {
      this.exceptionsService.throwError(err);
      this.loading = false;
    });
  }

  crearDiario(date: Date) {
    this.diariosService.crearDiario(date).subscribe(res => {
      this.diario = res['diario'];
      this.cargarDatosIniciales();
    }, (err) => {
      this.exceptionsService.throwError(err);
      this.loading = false;
    });
  }

  cargarDatosIniciales() {
    this.loading = false;
    this.getCategorias();
    this.calcularMacrosTotalesPorCategoria();
    this.updateChartData();
  }

  getSubtituloAlimento(alimento: any): string {
    let subtitulo = alimento.idAlimento.marca != null ? alimento.idAlimento.marca : '';
    const cantidadConUnidad = `${alimento.cantidad} ${getAbrebiaturaUnidadMedida(alimento.idAlimento.unidadMedida)}`;
    subtitulo += alimento.idAlimento.marca != null ? ` (${cantidadConUnidad})` : `${cantidadConUnidad}`;
    return subtitulo;
  }

  async presentOptionsAlert(index: number) {
    const alert = await this.alertController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Editar cantidad',
          handler: () => {
            this.presentEditarCantidadAlert(index);
          }
        },
        {
          text: 'Eliminar',
          cssClass: 'text-danger',
          handler: () => {
            this.deleteAlimento(index);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentEditarCantidadAlert(index: number) {
    const alert = await this.alertController.create({
      header: 'Editar cantidad',
      inputs: [
        {
          placeholder: 'Nueva cantidad',
          attributes: {
            type: 'number'
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'text-danger d-inline',
        },
        {
          text: 'Aceptar',
          cssClass: 'd-inline',
          handler: (data) => {
            const nuevaCantidad = parseFloat(data[0]);
            if (!isNaN(nuevaCantidad) && nuevaCantidad > 0) {
              this.updateAlimento(index, nuevaCantidad);
              return true;
            } else {
              return false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  updateAlimento(index: number, cantidad: number) {
    this.diariosService.updateCantidadAlimentoConsumido(this.diario.uid, index, cantidad).subscribe(res => {
      this.toastService.presentToast('Alimento editado', 'success');
      this.cargarDiarioPorFecha(this.selectedDate);
    }, (err) => {
      this.exceptionsService.throwError(err);
    });
  }

  deleteAlimento(index: number) {
    this.diariosService.deleteAlimentoConsumido(this.diario.uid, index).subscribe(res => {
      this.toastService.presentToast('Alimento borrado', 'success');
      this.cargarDiarioPorFecha(this.selectedDate);
    }, (err) => {
      this.exceptionsService.throwError(err);
    });
  }

  irAListadoDeAlimentos(categoria: string) {
    this.diariosService.idDiarioActual = this.diario.uid;
    this.diariosService.categoriaActual = categoria;
    this.router.navigateByUrl('/alimentos/list');
  }

  updateChartData() {
    // Grafico de calorias
    const data = [];
    const goalsValue = Math.round(this.planUsuario.caloriasDiarias/this.distribucionComidas.length);
    for(let i = 0; i < this.distribucionComidas.length; i++) {
      data.push({
        x: this.distribucionComidas[i],
        y: this.caloriasTotalesPorCategoria[i],
        goals: [
          {
            value: goalsValue,
            strokeColor: '#4F3422'
          }
        ]
      });
    }
    this.chartOptionsCalorias = {
      series: [{ data }],
      chart: {
        type: 'bar',
        height: 250,
        toolbar: {
          show: false
        },
        dropShadow: {
          enabled: true,
        },
        zoom: {
          enabled: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      grid: {
        show: false,
      },
      colors: ['#C0A091'],
    }

    // Grafico de macronutrientes
    this.chartOptionsMacros = {
      series: [this.diario.carbosConsumidos, this.diario.proteinasConsumidas, this.diario.grasasConsumidas],
      labels: ['Carbohidratos', 'Proteínas', 'Grasas'],
      chart: {
        height: 250,
        type: "pie",
        dropShadow: {
          enabled: true,
        },
        zoom: {
          enabled: false
        }
      },
      colors: ['#A694F5', '#ED7E1C', '#FFCE5C']
    };
  }

}
