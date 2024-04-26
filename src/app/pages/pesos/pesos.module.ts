import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';

import { PesosViewComponent } from './pesos-view/pesos-view.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { PesosFormModalComponent } from './pesos-form-modal/pesos-form-modal.component';


@NgModule({
  declarations: [
    PesosViewComponent,
    PesosFormModalComponent
  ],
  exports: [
    PesosViewComponent,
    PesosFormModalComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,

    ComponentsModule
  ]
})
export class PesosModule { }
