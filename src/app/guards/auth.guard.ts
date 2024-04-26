import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private usuariosService: UsuariosService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      return this.usuariosService.validarToken()
        .pipe(
          tap(res => {
            if(!res) {
              this.router.navigateByUrl('/login');
            }
          })
        )
    }

}
