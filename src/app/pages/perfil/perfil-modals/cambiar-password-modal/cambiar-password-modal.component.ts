import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-cambiar-password-modal',
  templateUrl: './cambiar-password-modal.component.html',
  styleUrls: ['./cambiar-password-modal.component.scss'],
})
export class CambiarPasswordModalComponent {

  form = this.formBuilder.group({
    password: ['', Validators.required],
    newPassword: ['', Validators.required],
    newPassword2: ['', Validators.required],
  });

  saving: boolean = false;

  constructor(
    private modalController: ModalController,
    private usuariosService: UsuariosService,
    private formBuilder: FormBuilder,
    private toastService: ToastService,
    private exceptionsService: ExceptionsService) { }

  close() {
    this.modalController.dismiss();
  }

  confirm() {
    if(this.form.valid) {
      this.updatePassword();
    }
  }

  updatePassword() {
    this.saving = true;
    this.usuariosService.updatePassword(this.form.value).subscribe(res => {
      if(res['ok']) {
        this.toastService.presentToast('Contraseña actualizada', 'success');
        this.modalController.dismiss();
      }
      this.saving = false;
    }, (err) => {
      this.exceptionsService.throwError(err);
      this.saving = false;
    })
  }

}
