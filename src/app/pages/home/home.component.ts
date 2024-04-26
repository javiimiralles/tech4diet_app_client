import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Diario } from 'src/app/models/diario.model';
import { DiariosService } from 'src/app/services/diarios.service';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent  implements OnInit {

  loadingDiario: boolean = true;
  loadingActividadFisica: boolean = true;

  diario: Diario;
  planUsuario = this.usuariosService.plan;

  pesoActual: number = this.usuariosService.pesoActual;
  pesoObjetivo: number = this.usuariosService.pesoObjetivo;

  constructor(
    private router: Router,
    private diariosService: DiariosService,
    private usuariosService: UsuariosService,
    private exceptionsService: ExceptionsService) { }

  ngOnInit() {
    this.loadingDiario = true;
    this.cargarDiario();
  }

  // Cargamos el diario de hoy, si no existe se crea
  cargarDiario() {
    this.diariosService.cargarDiarioPorFecha(new Date()).subscribe(res => {
      if(!res['diario']) {
        this.crearDiario();
      } else {
        this.diario = res['diario'];
        this.loadingDiario = false;
      }
    }, (err) => {
      this.loadingDiario = false;
      this.exceptionsService.throwError(err);
    });
  }

  crearDiario() {
    this.diariosService.crearDiario(new Date()).subscribe(res => {
      this.diario = res['diario'];
      this.loadingDiario = false;
    }, (err) => {
      this.loadingDiario = false;
      this.exceptionsService.throwError(err);
    });
  }

  redirectTo(url: string) {
    this.router.navigateByUrl(url);
  }

}
