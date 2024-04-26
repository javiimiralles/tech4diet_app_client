import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PerfilComponent } from './perfil-view/perfil.component';
import { PesoObjetivoModalComponent } from './perfil-modals/peso-objetivo-modal/peso-objetivo-modal.component';
import { CambiarPlanModalComponent } from './perfil-modals/cambiar-plan-modal/cambiar-plan-modal.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { DistribucionComidasModalComponent } from './perfil-modals/distribucion-comidas-modal/distribucion-comidas-modal.component';
import { CambiarPasswordModalComponent } from './perfil-modals/cambiar-password-modal/cambiar-password-modal.component';
import { NivelActividadModalComponent } from './perfil-modals/nivel-actividad-modal/nivel-actividad-modal.component';

@NgModule({
  declarations: [
    PerfilComponent,
    PesoObjetivoModalComponent,
    CambiarPlanModalComponent,
    DistribucionComidasModalComponent,
    CambiarPasswordModalComponent,
    NivelActividadModalComponent
  ],
  exports: [],
  imports: [
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,

    ComponentsModule
  ]
})
export class PerfilModule { }
