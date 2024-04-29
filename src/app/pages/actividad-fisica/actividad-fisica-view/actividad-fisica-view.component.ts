import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActividadFisica } from 'src/app/models/actividad-fisica.model';
import { ActividadRealizada } from 'src/app/models/actividad-realizada.model';
import { ActividadesRealizadasService } from 'src/app/services/actividades-realizadas.service';
import { ExceptionsService } from 'src/app/services/exceptions.service';

@Component({
  selector: 'app-actividad-fisica-view',
  templateUrl: './actividad-fisica-view.component.html',
  styleUrls: ['./actividad-fisica-view.component.scss'],
})
export class ActividadFisicaViewComponent  implements OnInit {

  loading: boolean = false;

  selectedDate: Date = new Date();
  actividadesRealizadas: ActividadRealizada[] = [];
  actividadesFisicasPadres: ActividadFisica[] = [];
  caloriasGastadas: number = 0;

  constructor(
    private actividadesRealizadasService: ActividadesRealizadasService,
    private router: Router,
    private exceptionsService: ExceptionsService
  ) { }

  ngOnInit() {
    this.cargarActividadesRealizadas();
  }

  onDateChange(dates: any) {
    this.selectedDate = dates.startDate;
    this.cargarActividadesRealizadas();
  }

  cargarActividadesRealizadas() {
    this.loading = true;
    this.actividadesRealizadasService.cargarActividadesRealizadasPorFecha(this.selectedDate).subscribe(res => {
      this.actividadesRealizadas = res['actividadesRealizadas'];
      this.caloriasGastadas = 0;
      this.actividadesRealizadas.forEach(actividad => {
        if(typeof actividad.idActividadFisica === 'object') {
          this.actividadesFisicasPadres.push(actividad.idActividadFisica);
        }
        this.caloriasGastadas += actividad.caloriasGastadas;
      });
      this.loading = false;
    }, (err) => {
      this.exceptionsService.throwError(err);
      this.loading = false;
    });
  }

  getTruncatedName(nombre: string) {
    const maxLength = 25;
    const ellipsis = '...';

    if (nombre != null) {
      if (nombre.length > maxLength) {
        return nombre.substring(0, maxLength) + ellipsis;
      } else {
        return nombre;
      }
    }
    return '';
  }

  goToRegisterActivity() {
    this.actividadesRealizadasService.fechaActual = this.selectedDate;
    this.router.navigateByUrl('/actividad-fisica/list');
  }

  goToUpdateActivity(uid: string) {
    this.router.navigate(['/actividad-fisica/registro-actividad-realizada'], { queryParams: { idActividadRealizada: uid } });
  }

}
