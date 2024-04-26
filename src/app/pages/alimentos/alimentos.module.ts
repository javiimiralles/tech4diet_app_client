import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';

import { AlimentosViewComponent } from './alimentos-view/alimentos-view.component';
import { ComponentsModule } from 'src/app/components/components.module';
import { CommonsModule } from 'src/app/commons/commons.module';
import { AlimentosListComponent } from './alimentos-list/alimentos-list.component';
import { RegistroAlimentoFormComponent } from './registro-alimento-form/registro-alimento-form.component';
import { AlimentoFormComponent } from './alimento-form/alimento-form.component';
import { AlimentosBarcodeScannerComponent } from './alimentos-barcode-scanner/alimentos-barcode-scanner.component';

@NgModule({
  declarations: [
    AlimentosViewComponent,
    AlimentosListComponent,
    RegistroAlimentoFormComponent,
    AlimentoFormComponent,
    AlimentosBarcodeScannerComponent,
  ],
  exports: [
    AlimentosViewComponent,
    AlimentosListComponent,
    RegistroAlimentoFormComponent,
    AlimentoFormComponent,
    AlimentosBarcodeScannerComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,

    ComponentsModule,
    CommonsModule
  ]
})
export class AlimentosModule { }
