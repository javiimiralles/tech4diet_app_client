import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Lightbox, LightboxConfig } from 'ngx-lightbox';
import { FotoProgreso } from 'src/app/models/foto-progreso.model';
import { FotosProgresoService } from 'src/app/services/fotos-progreso.service';
import { ToastService } from 'src/app/services/toast.service';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { ExceptionsService } from 'src/app/services/exceptions.service';

@Component({
  selector: 'app-fotos-progreso',
  templateUrl: './fotos-progreso.component.html',
  styleUrls: ['./fotos-progreso.component.scss'],
})
export class FotosProgresoComponent  implements OnInit {

  selectedDate: Date = new Date();
  fotosProgreso: FotoProgreso[] = [];
  album: any[] = [];

  subiendoFoto: boolean = false;

  constructor(
    private toastService: ToastService,
    private fotosProgresoService: FotosProgresoService,
    private lightbox: Lightbox,
    private lightboxConfig: LightboxConfig,
    private alertController: AlertController,
    private exceptionsService: ExceptionsService
  ) {
    this.lightboxConfig.fadeDuration = 0.5;
    this.lightboxConfig.centerVertically = true;
    this.lightboxConfig.alwaysShowNavOnTouchDevices = true;
    this.lightboxConfig.wrapAround = true;
  }

  ngOnInit() {
    this.cargarFotosProgreso();
  }

  onDateChange(dates: any) {
    this.selectedDate = dates.startDate;
    this.cargarFotosProgreso();
  }

  cargarFotosProgreso() {
    this.fotosProgresoService.cargarFotosProgresoPorFecha(this.selectedDate).subscribe(res => {
      this.fotosProgreso = res['fotosProgreso'];
      this.album = this.fotosProgreso.map(foto => ({ src: foto.url }));
    }, (err) => {
      this.exceptionsService.throwError(err);
    });
  }

  subirFotoProgreso(imagen: File) {
    this.fotosProgresoService.subirFotoProgreso(imagen, this.selectedDate).subscribe({
      next: () => {
        this.subiendoFoto = false;
        this.cargarFotosProgreso();
        this.toastService.presentToast('Foto subida correctamente', 'success');
      },
      error: (err) => {
        this.subiendoFoto = false;
        this.exceptionsService.throwError(err);
      }
    })
  }

  async presentDeletePhotoAlert(index: number, uid: string) {
    this.lightbox.close();
    const alert = await this.alertController.create({
      header: '¿Seguro que quieres borrar la foto?',
      cssClass: 'primer-plano',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          cssClass: 'text-danger',
          handler: () => {
            this.deleteFotoProgreso(index, uid);
          }
        }
      ],
    });

    await alert.present();
  }

  deleteFotoProgreso(index: number, uid: string) {
    this.fotosProgresoService.deleteFotoProgreso(uid).subscribe(res => {
      this.album.splice(index, 1);
      this.fotosProgreso.splice(index, 1);
      this.toastService.presentToast('Foto eliminada', 'success');
    }, (err) => {
      this.exceptionsService.throwError(err);
    });
  }

  async uploadPhoto(fromGallery: boolean) {
    try {
      const foto: Photo = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: fromGallery ? CameraSource.Photos : CameraSource.Camera,
        quality: 100
      });
      this.subiendoFoto = true;
      // Convertir DataUrl a Blob
      const response = await fetch(foto.dataUrl);
      const blob = await response.blob();
      // Crear un objeto File a partir del Blob
      const file = new File([blob], "foto.jpg", { type: "image/jpeg" });
      this.subirFotoProgreso(file);
    } catch (error) {
      if (error.message === 'User cancelled photos app') {
        console.log('El usuario cerró la cámara sin usarla.');
      } else {
        console.error('Ocurrió un error inesperado:', error);
      }
    }
  }

  // Logica del lightbox
  openLightbox(index: number, uid: string) {
    this.lightbox.open(this.album, index);
    setTimeout(() => this.addDeleteButton(index, uid), 0);
  }

  closeLightbox() {
    this.lightbox.close();
  }

  addDeleteButton(index: number, uid: string) {
    const lightboxElem = document.querySelector('.lb-controlContainer');
    if (lightboxElem && !lightboxElem.querySelector('.delete-btn')) {
      const btn = document.createElement('div');
      btn.innerHTML = '<ion-icon color="danger" name="trash-outline"></ion-icon>';
      btn.classList.add('delete-btn');
      btn.classList.add('lb-closeContainer');
      btn.style.marginRight = '10px';
      btn.style.fontSize = '30px';
      btn.onclick = () => this.presentDeletePhotoAlert(index, uid);
      lightboxElem.appendChild(btn);
    }
  }

}
