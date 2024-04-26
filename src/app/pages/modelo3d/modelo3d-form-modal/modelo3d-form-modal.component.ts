import { Component, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { Modelos3DService } from 'src/app/services/modelos3D.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-modelo3d-form-modal',
  templateUrl: './modelo3d-form-modal.component.html',
  styleUrls: ['./modelo3d-form-modal.component.scss'],
})
export class Modelo3dFormModalComponent  implements OnDestroy {

  fechaSeleccionada: string = new Date().toISOString();
  uploadedFile: File | null = null;
  fileSubscription: Subscription;

  constructor(
    private modalController: ModalController,
    private dataService: DataService,
    private toastService: ToastService,
    private modelos3dService: Modelos3DService,
    private exceptionsService: ExceptionsService
  ) {
    this.fileSubscription = this.dataService.currentFile.subscribe(file => {
      this.uploadedFile = file;
    })
  }

  ngOnDestroy(): void {
    if(this.fileSubscription) {
      this.fileSubscription.unsubscribe();
    }
  }

  onSubmit() {
    if(!this.uploadedFile) {
      this.toastService.presentToast('Selecciona un modelo', 'danger');
      return;
    }

    this.modelos3dService.subirModelo3D(new Date(this.fechaSeleccionada), this.uploadedFile).subscribe({
      next: () => {
        this.toastService.presentToast('Modelo 3D subido', 'success');
        this.modalController.dismiss(null, 'confirm');
      },
      error: (err) => {
        this.exceptionsService.throwError(err);
      }
    })
  }

  closeModal() {
    this.modalController.dismiss(null, 'cancel');
  }

}
