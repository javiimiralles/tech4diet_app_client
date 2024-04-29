import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { RegistroPeso } from 'src/app/models/registro-peso.model';
import { PesosService } from 'src/app/services/pesos.service';
import { ToastService } from 'src/app/services/toast.service';
import { PesosFormModalComponent } from '../pesos-form-modal/pesos-form-modal.component';
import { UsuariosService } from 'src/app/services/usuarios.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexAnnotations,
} from 'ng-apexcharts';
import { ExceptionsService } from 'src/app/services/exceptions.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  colors: string[];
  annotations: ApexAnnotations;
};

@Component({
  selector: 'app-pesos-view',
  templateUrl: './pesos-view.component.html',
  styleUrls: ['./pesos-view.component.scss'],
})
export class PesosViewComponent  implements OnInit {

  loading: boolean = false;

  segmentActual: 'listado' | 'estadisticas' = 'listado';
  startDate: Date = new Date();
  endDate: Date = new Date();
  registrosPeso: RegistroPeso[] = [];
  variacionesPeso: number[] = [];

  pesoObjetivo: number = this.usuariosService.pesoObjetivo || null;
  objetivoUsuario: string = this.usuariosService.plan.tipo;

  imc: number = 0;
  imcColor: string = 'success';
  nivelPeso: string = 'Normal';

  pesoMaximo: number = this.usuariosService.pesoHistorico.pesoMaximo;
  pesoMinimo: number = this.usuariosService.pesoHistorico.pesoMinimo;
  pesoMedio: number = this.usuariosService.pesoHistorico.pesoMedio;

  chartOptions: Partial<ChartOptions>;
  chartData: number[] = [];
  chartLabels: any[] = [];

  constructor(
    private toastService: ToastService,
    private pesosService: PesosService,
    private modalController: ModalController,
    private usuariosService: UsuariosService,
    private alertController: AlertController,
    private exceptionsService: ExceptionsService) { }

  ngOnInit() {
    const today = new Date();
    this.startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    this.endDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    this.calcularIMC();

    this.cargarRegistrosDePeso();
  }

  async openPesosFormModal(registro: RegistroPeso) {
    const modal = await this.modalController.create({
      component: PesosFormModalComponent,
      cssClass: 'custom-modal',
      componentProps: {
        registroEdicion: registro
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if(data?.ok) {
      this.cargarRegistrosDePeso();
      this.updateInfoUser();
    }
  }

  // Capturadores de eventos
  onSegmentChange(event) {
    this.segmentActual = event.detail.value;
  }

  onDateChange(dates: any) {
    this.startDate = dates.startDate;
    this.endDate = dates.endDate;
    this.cargarRegistrosDePeso();
  }

  cargarRegistrosDePeso() {
    this.loading = true;
    this.pesosService.cargarRegistrosPesoPorFechas(this.startDate, this.endDate).subscribe(res => {
      if(res['registros']) {
        this.registrosPeso = res['registros'];
        this.calcularVariacionesPeso();
        this.chartData = this.registrosPeso.map(registro => registro.peso).slice(0, 10).reverse();
        this.chartLabels = this.registrosPeso.map(registro => {
            const date = new Date(registro.fecha);
            const day = date.getDate();
            const monthNames = ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'];
            const month = monthNames[date.getMonth()];
            return `${day} ${month}`;
          }).slice(0, 10).reverse();
        this.updateChartData();
      }
      this.loading = false;
    }, (err) => {
      this.exceptionsService.throwError(err);
      this.loading = false;
    });
  }

  calcularVariacionesPeso() {
    let i = 0;
    this.variacionesPeso = [];
    this.registrosPeso.forEach(registro => {
      if(i != this.registrosPeso.length - 1) {
        const variacion: number = Math.round(registro.peso - this.registrosPeso[i+1].peso);
        this.variacionesPeso.push(variacion);
      } else {
        this.variacionesPeso.push(0);
      }
      i++;
    })
  }

  formatVariacionPeso(index: number, variacionPeso: number) {
    let dev: string = '';
    if(index != this.variacionesPeso.length - 1) {
      if(variacionPeso > 0) {
        dev = `+${variacionPeso} kg`;
      } else {
        dev = `${variacionPeso} kg`;
      }
    }
    return dev;
  }

  getVariacionPesoClass(index: number, variacionPeso: number) {
    let clase: string = '';
    if(index != this.variacionesPeso.length - 1) {
      if(this.objetivoUsuario === 'Perder peso') {
        clase = variacionPeso > 0 ? 'danger-color' : 'success-color';
      } else if(this.objetivoUsuario === 'Ganar peso') {
        clase = variacionPeso < 0 ? 'danger-color' : 'success-color';
      }
    }

    return clase;
  }

  calcularIMC() {
    const alturaMetros: number = Number((this.usuariosService.altura/100).toFixed(2));
    this.imc = Number((this.usuariosService.pesoActual/(alturaMetros*alturaMetros)).toFixed(2));

    if(this.imc < 18.5) {
      this.imcColor = 'secondary';
      this.nivelPeso = 'Bajo peso'
    } else if(this.imc >= 18.5 && this.imc < 25) {
      this.imcColor = 'success';
      this.nivelPeso = 'Normal';
    } else if(this.imc >= 25 && this.imc < 30) {
      this.imcColor = 'warning';
      this.nivelPeso = 'Sobrepeso';
    } else {
      this.imcColor = 'danger';
      this.nivelPeso = 'Obesidad';
    }
  }

  async presentAlert(registro: RegistroPeso) {
    const alert = await this.alertController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Editar registro',
          handler: () => {
            this.openPesosFormModal(registro);
          }
        },
        {
          text: 'Eliminar',
          cssClass: 'text-danger',
          handler: () => {
            this.deleteRegistroPeso(registro.uid);
          }
        }
      ]
    });

    await alert.present();
  }

  deleteRegistroPeso(uid: string) {
    this.pesosService.deleteRegistroPeso(uid).subscribe(res => {
      this.toastService.presentToast('Registro eliminado', 'success');
      this.cargarRegistrosDePeso();
      this.updateInfoUser();
    }, (err) => {
      this.exceptionsService.throwError(err);
    });
  }

  // Cuando creamos, editamos o eliminamos un registro de peso habra que actualizar
  // la info del usuario para que se actualice su pesoActual
  updateInfoUser() {
    this.usuariosService.validarToken().subscribe(res => {});
  }

  // Logica del grafico
  updateChartData() {
    this.chartOptions = {
      series: [
        {
          name: "Peso",
          data: this.chartData
        }
      ],
      chart: {
        height: 250,
        type: "line",
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
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "smooth",
        width: 2
      },
      grid: {
        show: false,
      },
      xaxis: {
        categories: this.chartLabels,
      },
      yaxis: {
        show: false
      },
      colors: ['#4F3422'],
      annotations: {
        yaxis: [{
          y: this.pesoObjetivo,
          borderColor: '#9BB168',
        }]
      }
    };
  }


}
