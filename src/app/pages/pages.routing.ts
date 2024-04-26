import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';

import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { HomeComponent } from './home/home.component';
import { AlimentosViewComponent } from './alimentos/alimentos-view/alimentos-view.component';
import { PesosViewComponent } from './pesos/pesos-view/pesos-view.component';
import { ActividadFisicaViewComponent } from './actividad-fisica/actividad-fisica-view/actividad-fisica-view.component';
import { AlimentosListComponent } from './alimentos/alimentos-list/alimentos-list.component';
import { RegistroAlimentoFormComponent } from './alimentos/registro-alimento-form/registro-alimento-form.component';
import { AlimentoFormComponent } from './alimentos/alimento-form/alimento-form.component';
import { ConsumoAguaComponent } from './consumo-agua/consumo-agua.component';
import { PerfilComponent } from './perfil/perfil-view/perfil.component';
import { AlimentosBarcodeScannerComponent } from './alimentos/alimentos-barcode-scanner/alimentos-barcode-scanner.component';
import { MedidasCorporalesComponent } from './medidas-corporales/medidas-corporales.component';
import { ActividadFisicaListComponent } from './actividad-fisica/actividad-fisica-list/actividad-fisica-list.component';
import { ActividadFisicaFormComponent } from './actividad-fisica/actividad-fisica-form/actividad-fisica-form.component';
import { RegistroActividadRealizadaComponent } from './actividad-fisica/registro-actividad-realizada/registro-actividad-realizada.component';
import { Modelo3dComponent } from './modelo3d/modelo3d.component';
import { FotosProgresoComponent } from './fotos-progreso/fotos-progreso.component';

const routes: Routes = [
  { path: '', component: AdminLayoutComponent, canActivate: [AuthGuard],
    children: [
      /********** Inicio *************/
      { path: 'home', component: HomeComponent, data: {
                                                  simpleHeader: false,
                                                  titulo: 'Inicio',
                                                  leftButtonIcon: '',
                                                  leftButtonUrl: '',
                                                  backButtonUrl: ''
                                                }},
      /********** Alimentos *************/
      { path: 'alimentos', component: AlimentosViewComponent, data: {
                                                                    simpleHeader: false,
                                                                    titulo: 'Registro de alimentos',
                                                                    leftButtonIcon: 'water-outline',
                                                                    leftButtonUrl: '/consumo-agua',
                                                                    backButtonUrl: ''
                                                                  }},
      { path: 'alimentos/list', component: AlimentosListComponent, data: {
                                                                    simpleHeader: true,
                                                                    titulo: 'Listado de alimentos',
                                                                    leftButtonIcon: '',
                                                                    leftButtonUrl: '',
                                                                    backButtonUrl: '/alimentos'
                                                                  }},
      { path: 'alimentos/registro', component: RegistroAlimentoFormComponent, data: {
                                                                    simpleHeader: true,
                                                                    titulo: 'Añadir alimento',
                                                                    leftButtonIcon: '',
                                                                    leftButtonUrl: '',
                                                                    backButtonUrl: '/alimentos/list'
                                                                  }},
      { path: 'alimentos/form/:uid', component: AlimentoFormComponent, data: {
                                                                    simpleHeader: true,
                                                                    titulo: 'Nuevo alimento',
                                                                    leftButtonIcon: '',
                                                                    leftButtonUrl: '',
                                                                    backButtonUrl: '/alimentos/list'
                                                                  }},
      { path: 'alimentos/barcode-scanner', component: AlimentosBarcodeScannerComponent, data: {
                                                                    simpleHeader: true,
                                                                    titulo: '',
                                                                    leftButtonIcon: '',
                                                                    leftButtonUrl: '',
                                                                    backButtonUrl: ''
                                                                  }},
      /********** Peso *************/
      { path: 'registros-peso', component: PesosViewComponent, data: {
                                                                    simpleHeader: false,
                                                                    titulo: 'Registros de peso',
                                                                    leftButtonIcon: '',
                                                                    leftButtonUrl: '',
                                                                    backButtonUrl: ''
                                                                  }},
      /********** Actividad fisica *************/
      { path: 'actividad-fisica', component: ActividadFisicaViewComponent, data: {
                                                                  simpleHeader: false,
                                                                  titulo: 'Actividad física',
                                                                  leftButtonIcon: '',
                                                                  leftButtonUrl: '',
                                                                  backButtonUrl: ''
                                                                }},
      { path: 'actividad-fisica/list', component: ActividadFisicaListComponent, data: {
                                                                  simpleHeader: true,
                                                                  titulo: 'Listado de actividades',
                                                                  leftButtonIcon: '',
                                                                  leftButtonUrl: '',
                                                                  backButtonUrl: '/actividad-fisica'
                                                                }},
      { path: 'actividad-fisica/registro-actividad-realizada', component: RegistroActividadRealizadaComponent, data: {
                                                                  simpleHeader: true,
                                                                  titulo: 'Actividad realizada',
                                                                  leftButtonIcon: '',
                                                                  leftButtonUrl: '',
                                                                  backButtonUrl: '/actividad-fisica/list'
                                                                }},
      { path: 'actividad-fisica/form/:uid', component: ActividadFisicaFormComponent, data: {
                                                                  simpleHeader: true,
                                                                  titulo: 'Nueva actividad',
                                                                  leftButtonIcon: '',
                                                                  leftButtonUrl: '',
                                                                  backButtonUrl: '/actividad-fisica/list'
                                                                }},
      /********** Consumo agua *************/
      { path: 'consumo-agua', component: ConsumoAguaComponent, data: {
                                                                  simpleHeader: false,
                                                                  titulo: 'Consumo de agua',
                                                                  leftButtonIcon: '',
                                                                  leftButtonUrl: '',
                                                                  backButtonUrl: ''
                                                                }},
      /********** Fotos progreso *************/
      { path: 'fotos-progreso', component: FotosProgresoComponent, data: {
                                                                  simpleHeader: false,
                                                                  titulo: 'Fotos del progreso',
                                                                  leftButtonIcon: '',
                                                                  leftButtonUrl: '',
                                                                  backButtonUrl: ''
                                                                }},
      /********** Medidas corporales *************/
      { path: 'medidas-corporales', component: MedidasCorporalesComponent, data: {
                                                                simpleHeader: false,
                                                                titulo: 'Medidas corporales',
                                                                leftButtonIcon: '',
                                                                leftButtonUrl: '',
                                                                backButtonUrl: ''
                                                              }},
      /********** Medidas corporales *************/
      { path: 'modelo3d', component: Modelo3dComponent, data: {
                                                                simpleHeader: false,
                                                                titulo: 'Mi modelo 3D',
                                                                leftButtonIcon: '',
                                                                leftButtonUrl: '',
                                                                backButtonUrl: ''
                                                              }},
      /********** Perfil *************/
      { path: 'perfil', component: PerfilComponent, data: {
                                                                simpleHeader: false,
                                                                titulo: 'Mi perfil',
                                                                leftButtonIcon: '',
                                                                leftButtonUrl: '',
                                                                backButtonUrl: ''
                                                              }},
      { path: '**', redirectTo: 'home' }
    ]
  }
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
