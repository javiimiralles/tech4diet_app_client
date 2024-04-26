import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';

import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { NumberPickerComponent } from './number-picker/number-picker.component';
import { LoaderComponent } from './loader/loader.component';
import { UploadFormComponent } from './upload-form/upload-form.component';

@NgModule({
  declarations: [
    ProgressBarComponent,
    DatePickerComponent,
    NumberPickerComponent,
    LoaderComponent,
    UploadFormComponent
  ],
  exports: [
    ProgressBarComponent,
    DatePickerComponent,
    NumberPickerComponent,
    LoaderComponent,
    UploadFormComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    FormsModule,
  ],
})
export class ComponentsModule { }
