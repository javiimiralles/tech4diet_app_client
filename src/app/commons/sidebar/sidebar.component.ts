import { Component, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Subscription, filter, map } from 'rxjs';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {

  simpleHeader: boolean = false;

  sidebarItems = [
    { nombre: 'Inicio', icono: 'home', url: '/home' },
    { nombre: 'Alimentos', icono: 'restaurant', url: '/alimentos' },
    { nombre: 'Registros de peso', icono: 'scale', url: '/registros-peso' },
    { nombre: 'Actividad física', icono: 'walk', url: '/actividad-fisica' },
    { nombre: 'Consumo de agua', icono: 'water', url: '/consumo-agua' },
    { nombre: 'Fotos del progreso', icono: 'camera', url: '/fotos-progreso' },
    { nombre: 'Medidas corporales', icono: 'analytics', url: '/medidas-corporales' },
    { nombre: 'Modelo 3D', icono: 'body', url: '/modelo3d' },
    { nombre: 'Perfil', icono: 'person', url: '/perfil' },
    // { nombre: 'Configuración', icono: 'settings', url: '/configuracion' },
  ]

  constructor(private router: Router, private menuController: MenuController, private usuariosService: UsuariosService) { }

  ngOnInit() {
    this.getData().subscribe(data => {
      this.simpleHeader = data['simpleHeader']
    });
  }

  getData() {
    return this.router.events.pipe(
      filter(event => event instanceof ActivationEnd),
      filter((event: ActivationEnd) => event.snapshot.firstChild === null),
      map((event: ActivationEnd) => event.snapshot.data)
    );
  }

  closeMenu() {
    this.menuController.close();
  }

}
