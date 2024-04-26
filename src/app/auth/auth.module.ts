import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AuthLayoutComponent } from '../layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CommonsModule } from '../commons/commons.module';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginComponent,
    RegisterComponent,
  ],
  exports: [
    AuthLayoutComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    CommonsModule,
    ComponentsModule
  ]
})
export class AuthModule { }
