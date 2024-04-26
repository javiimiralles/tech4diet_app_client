import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NoAuthGuard } from '../guards/no-auth.guard';

import { AuthLayoutComponent } from '../layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'login', component: AuthLayoutComponent, canActivate: [ NoAuthGuard ],
    children: [
      { path: '', component: LoginComponent },
    ]
  },
  { path: 'registro', component: AuthLayoutComponent, canActivate: [ NoAuthGuard ],
    children: [
      { path: '', component: RegisterComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
