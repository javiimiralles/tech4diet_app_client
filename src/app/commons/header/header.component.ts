import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivationEnd } from '@angular/router';
import { Subscription, filter, map } from 'rxjs';
import { DiariosService } from 'src/app/services/diarios.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  private sub$: Subscription;
  simpleHeader: boolean = false;
  titulo: string = '';
  leftButtonIcon: string = '';
  leftButtonUrl: string = '';
  backButtonUrl: string = '';

  constructor(
    private router: Router,
    private diariosService: DiariosService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.sub$ = this.getData().subscribe(data => {
      this.simpleHeader = data['simpleHeader'];
      this.titulo = data['titulo'];
      this.leftButtonIcon = data['leftButtonIcon'];
      this.leftButtonUrl = data['leftButtonUrl'];
      this.backButtonUrl = data['backButtonUrl'];

      // depende de si estamos en la edicion o creacion de algun formulario
      // habra que cambiar dinamicamente el boton de volver atras o el
      // titulo del header
      this.updateBackButton();
    });
  }

  updateBackButton() {
    const url: string = this.router.url;
    if(url.includes('/alimentos/form')) {
      const uid: string = this.getUid(url);
      if(uid === 'capturado') {
        this.titulo = 'Alimento capturado';
      } else if(uid !== 'nuevo') {
        this.titulo = 'Editar alimento';
        this.diariosService.idAlimentoActual = uid;
        this.backButtonUrl = '/alimentos/registro';
      }
    } else if(url.includes('/actividad-fisica/registro-actividad-realizada')) {
      let uid: string;
      this.activatedRoute.queryParams.subscribe(params => {
        uid = params['idActividadRealizada'];
      });
      if(uid !== 'nuevo') {
        this.backButtonUrl = '/actividad-fisica';
      }
    } else if(url.includes('/actividad-fisica/form') && this.getUid(url) !== 'nuevo') {
      this.titulo = 'Editar actividad';
    }
  }

  getUid(url: string) {
    const urlArray = url.split('/');
    return urlArray[urlArray.length - 1];
  }

  getData() {
    return this.router.events.pipe(
      filter(event => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data)
    );
  }

}
