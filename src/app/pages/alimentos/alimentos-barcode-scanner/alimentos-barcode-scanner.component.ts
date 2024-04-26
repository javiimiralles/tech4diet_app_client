import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Alimento } from 'src/app/models/alimento.model';
import { AlimentosService } from 'src/app/services/alimentos.service';
import { DiariosService } from 'src/app/services/diarios.service';
import { ExceptionsService } from 'src/app/services/exceptions.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-alimentos-barcode-scanner',
  templateUrl: './alimentos-barcode-scanner.component.html',
  styleUrls: ['./alimentos-barcode-scanner.component.scss'],
})
export class AlimentosBarcodeScannerComponent  implements OnInit {

  loading: boolean = false;
  alimento: Alimento;

  constructor(
    private router: Router,
    private alimentosService: AlimentosService,
    private usuariosService: UsuariosService,
    private diariosService: DiariosService,
    private exceptionsService: ExceptionsService) {}

  ngOnInit() {
    this.scanBarcode();
  }

  async scanBarcode() {
    const premission = await BarcodeScanner.checkPermission({ force: true });

    if(premission.granted) {
      // Escondemos el background, el tab-bar y el header
      BarcodeScanner.hideBackground();
      document.querySelector('body').classList.add('scanner-active');
      document.querySelector('ion-header').classList.add('scanner-active');
      document.querySelector('.custom-tab-bar').classList.add('scanner-active');

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        document.querySelector('body').classList.remove('scanner-active');
        this.loading = true;
        this.alimentosService.cargarAlimentoOpenFoodFactsPorBarcode(result.content).subscribe(res => {
          // if(res['foodData']) {
            this.filterAlimentosData(res['foodData']);
            this.alimentosService.createAlimento(this.alimento).subscribe(res => {
              this.stopScan();
              this.diariosService.idAlimentoActual = res['alimento'].uid;
              this.router.navigateByUrl('/alimentos/registro');
            }, (err) => {
              this.stopScan();
              this.router.navigateByUrl('/alimentos/list');
              this.exceptionsService.throwError(err);
            })
          // }
        }, (err) => {
          this.stopScan();
          this.router.navigateByUrl('/alimentos/list');
          this.exceptionsService.throwError(err);
        })
      }
    } else {
      this.router.navigateByUrl('/alimentos/list');
    }
  }

  stopScan() {
    // Volvemos a mostrar lo que habiamos escondido
    BarcodeScanner.showBackground();
    document.querySelector('body').classList.remove('scanner-active');
    document.querySelector('ion-header').classList.remove('scanner-active');
    document.querySelector('.custom-tab-bar').classList.remove('scanner-active');

    this.loading = false;
    BarcodeScanner.stopScan();
  }

  goBack() {
    this.stopScan();
    this.router.navigateByUrl('/alimentos/list');
  }

  filterAlimentosData(foodData: any) {
    const nutrientes = foodData.nutriments;
    this.alimento = new Alimento('', foodData.product_name, foodData.brands, 100, 'gramos', nutrientes['energy-kcal_100g'],
      nutrientes['carbohydrates_100g'], nutrientes['proteins_100g'], nutrientes['fat_100g'], this.usuariosService.uid);
  }

}
