import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthRoutingModule } from './auth/auth.routing';
import { PagesRoutingModule } from './pages/pages.routing';

const routes: Routes = [
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    AuthRoutingModule,
    PagesRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
