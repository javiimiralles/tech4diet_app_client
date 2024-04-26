import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { ToastService } from 'src/app/services/toast.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AlertController, ItemReorderEventDetail } from '@ionic/angular';
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';
import { ExceptionsService } from 'src/app/services/exceptions.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {

  @ViewChild(IonModal) modal: IonModal;

  realizandoRegistro: boolean = false;
  currentStep: number = 1;
  totalSteps: number = 9;
  progressValue: number = this.currentStep/this.totalSteps;
  buttonDisabled: boolean = true;
  registrarObjetivoPeso: boolean = false;

  sexo: string;
  altura: number = 170;
  edad: number = 20;
  pesoEntero: number = 60;
  pesoDecimal: number = 0;
  peso: number;
  plan: 'Perder peso' | 'Mantener peso' | 'Ganar peso';
  nivelActividad: 'Sedentario' | 'Moderado' | 'Alto' | 'Muy alto' = 'Moderado';
  pesoObjetivoEntero: number = 70;
  pesoObjetivoDecimal: number = 0;
  pesoObjetivo: number;
  distribucionComidas: string[] = ['Desayuno', 'Comida', 'Cena'];

  step1Form = this.formBuilder.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    repeatPassword: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private toastService: ToastService,
    private alertController: AlertController,
    private router: Router,
    private exceptionsService: ExceptionsService) {}

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.progressValue = this.currentStep / this.totalSteps;
    }
  }

  previousStep() {
    this.currentStep--;
    this.progressValue = this.currentStep / this.totalSteps;
  }

  selectSexo(sexo: string) {
    this.sexo = sexo;
  }

  onHeightChange(height: number) {
    this.altura = height
  }

  onAgeChange(age: number) {
    this.edad = age;
  }

  onWeigthIntChange(weigthInt: number) {
    this.pesoEntero = weigthInt;
  }

  onWeigthDecimalChange(weigthDecimal: number) {
    this.pesoDecimal = weigthDecimal;
  }

  selectPlan(plan) {
    this.plan = plan;
  }

  handleNivelActividadChange(event) {
    this.nivelActividad = event.target.value;
  }

  handleReorderDistribucion(ev: CustomEvent<ItemReorderEventDetail>) {
    this.distribucionComidas = ev.detail.complete(this.distribucionComidas);
  }

  openModal() {
    this.modal.present();
  }

  closeModal() {
    this.modal.dismiss();
  }

  confirmModal() {
    this.modal.dismiss();
    this.registrarObjetivoPeso = true;
    this.validate();
  }

  noRegistrarObjetivo() {
    this.registrarObjetivoPeso = false;
    this.validate();
  }

  onTargetIntChange(weightInt: number) {
    this.pesoObjetivoEntero = weightInt;
  }

  onTargetDecimalChange(weightDecimal: number) {
    this.pesoObjetivoDecimal = weightDecimal;
  }

  deleteComida(index: number) {
    this.distribucionComidas.splice(index, 1);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Añadir comida',
      inputs: [
        {
          placeholder: 'Escribe aquí',
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'text-danger d-inline',
        },
        {
          text: 'Aceptar',
          cssClass: 'd-inline',
          handler: (data) => {
            if (data[0] != null && data[0] !== '') {
              this.distribucionComidas.push(data[0]);
            } else {
              return;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  validate() {
    switch(this.currentStep) {
      case 1:
        this.validateStep1();
        break;
      case 2:
        if(this.sexo != null) this.nextStep();
        break;
      case 5:
        this.peso = this.pesoEntero + (this.pesoDecimal / 100);
        this.nextStep();
        break;
      case 6:
        if(this.plan != null) this.nextStep();
        break;
      case 7:
        if(this.registrarObjetivoPeso) {
          this.pesoObjetivo = this.pesoObjetivoEntero + (this.pesoObjetivoDecimal / 100);
        } else {
          this.pesoObjetivo = null;
        }
        this.nextStep();
        break;
      case this.totalSteps:
        if(this.distribucionComidas.length > 0) this.finishRegister();
        break;
      default:
        this.nextStep();
    }

  }

  validateStep1() {
    const email = this.step1Form.get('email').value;
    const password = this.step1Form.get('password').value;
    const repeatPassword = this.step1Form.get('repeatPassword').value;

    if(password !== repeatPassword) {
      this.toastService.presentToast('Las contraseñas no coinciden', 'danger');
      return;
    }

    this.usuariosService.getUserByEmail(email).subscribe(res => {
      if(res['usuario'] != null) {
        this.toastService.presentToast('El email ya está en uso', 'danger');
        return;
      } else {
        this.nextStep();
      }
    }, (err) => {
      this.exceptionsService.throwError(err);
    })
  }

  finishRegister() {
    this.realizandoRegistro = true;
    const plan = { tipo: this.plan, nivelActividad: this.nivelActividad }
    const usuario: Usuario = new Usuario('', this.step1Form.get('nombre').value, this.step1Form.get('email').value, this.step1Form.get('password').value,
      this.sexo, this.altura, this.edad, this.peso, this.pesoObjetivo, this.peso, null, plan, this.distribucionComidas, null);

    this.usuariosService.register(usuario).subscribe(res => {
      const loginForm = this.formBuilder.group({
        email: usuario.email,
        password: this.step1Form.get('password').value
      })
      this.usuariosService.login(loginForm.value).subscribe(res => {
        this.realizandoRegistro = false;
        this.router.navigateByUrl('/home');
      }, (err) => {
        this.realizandoRegistro = false;
        this.exceptionsService.throwError(err);
      })
    }, (err) => {
      this.realizandoRegistro = false;
      this.exceptionsService.throwError(err);
    })
  }


}
