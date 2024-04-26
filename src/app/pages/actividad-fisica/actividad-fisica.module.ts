import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ActividadFisicaViewComponent } from './actividad-fisica-view/actividad-fisica-view.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { ActividadFisicaListComponent } from './actividad-fisica-list/actividad-fisica-list.component';
import { ActividadFisicaFormComponent } from './actividad-fisica-form/actividad-fisica-form.component';
import { RegistroActividadRealizadaComponent } from './registro-actividad-realizada/registro-actividad-realizada.component';


@NgModule({
  declarations: [
    ActividadFisicaViewComponent,
    ActividadFisicaListComponent,
    ActividadFisicaFormComponent,
    RegistroActividadRealizadaComponent
  ],
  exports: [
    ActividadFisicaViewComponent,
    ActividadFisicaListComponent,
    ActividadFisicaFormComponent,
    RegistroActividadRealizadaComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    ComponentsModule
  ]
})
export class ActividadFisicaModule { }
