import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LightboxModule } from 'ngx-lightbox';

import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { HomeComponent } from './home/home.component';
import { AlimentosModule } from './alimentos/alimentos.module';
import { PesosModule } from './pesos/pesos.module';
import { ActividadFisicaModule } from './actividad-fisica/actividad-fisica.module';
import { CommonsModule } from '../commons/commons.module';
import { ComponentsModule } from '../components/components.module';
import { ConsumoAguaComponent } from './consumo-agua/consumo-agua.component';
import { PerfilModule } from './perfil/perfil.module';
import { MedidasCorporalesComponent } from './medidas-corporales/medidas-corporales.component';
import { Modelo3dComponent } from './modelo3d/modelo3d.component';
import { FotosProgresoComponent } from './fotos-progreso/fotos-progreso.component';
import { Modelo3dFormModalComponent } from './modelo3d/modelo3d-form-modal/modelo3d-form-modal.component';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    HomeComponent,
    ConsumoAguaComponent,
    MedidasCorporalesComponent,
    Modelo3dComponent,
    Modelo3dFormModalComponent,
    FotosProgresoComponent
  ],
  exports: [
    AdminLayoutComponent,
    HomeComponent,
    ConsumoAguaComponent,
    MedidasCorporalesComponent,
    Modelo3dComponent,
    FotosProgresoComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    LightboxModule,

    AlimentosModule,
    PesosModule,
    ActividadFisicaModule,
    CommonsModule,
    ComponentsModule,
    PerfilModule,
  ]
})
export class PagesModule { }
