import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';
import { ExceptionsService } from 'src/app/services/exceptions.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {

  showPassword: boolean = false;
  waiting: boolean = false;

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private usuariosService: UsuariosService,
    private exceptionsService: ExceptionsService) { }

  ngOnInit() {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (!this.loginForm.valid) {
      console.warn('Errores en el formulario');
      return;
    }

    this.waiting = true;
    this.usuariosService.login(this.loginForm.value)
      .subscribe(res => {
        this.waiting = false;
        this.router.navigateByUrl('/home');
      }, (err) => {
        this.exceptionsService.throwError(err);
        this.waiting = false;
      });
  }

}
