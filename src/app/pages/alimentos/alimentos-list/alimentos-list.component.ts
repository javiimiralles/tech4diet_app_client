import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Alimento } from 'src/app/models/alimento.model';
import { AlimentosService } from 'src/app/services/alimentos.service';
import { DiariosService } from 'src/app/services/diarios.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { getAbrebiaturaUnidadMedida } from 'src/app/utils/unidad-medida.utils';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import * as tf from '@tensorflow/tfjs';
import food_data from '../../../../assets/food_data.json';
import { ExceptionsService } from 'src/app/services/exceptions.service';

@Component({
  selector: 'app-alimentos-list',
  templateUrl: './alimentos-list.component.html',
  styleUrls: ['./alimentos-list.component.scss'],
})
export class AlimentosListComponent  implements OnInit {

  listaResultados: Alimento[] = [];

  categoria: string = '';
  idDiario: string = '';
  textoBusqueda: string = '';
  resultados: number = 10;
  noResultsFound: boolean = false;
  segmentActual: 'mis-alimentos' | 'biblioteca' = 'biblioteca';

  loading: boolean = false;

  // para la captura de alimentos
  capturandoAlimento: boolean = false;
  model: any;
  predictions: any;
  image: any;
  labels_20 = [
    'apple_pie','caesar_salad','cheesecake','chicken_curry','churros','donuts','escargots','fish_and_chips','french_fries','greek_salad','hamburguer','ice_cream','macarons','omelette','paella','pizza','ramen','spring_rolls','sushi','tacos'
  ];
  foodList: {nombre_pred: string, nombre: string, calorias: number, grasas: number, proteinas :number, carbohidratos :number}[] = food_data;

  constructor(private diariosService: DiariosService,
    private alimentosService: AlimentosService,
    private router: Router,
    private usuariosService: UsuariosService,
    private exceptionsService: ExceptionsService) {}

  ngOnInit() {
    this.categoria = this.diariosService.categoriaActual;
    this.idDiario = this.diariosService.idDiarioActual;
    this.loadModel();
  }

  onSearchbarChange(event) {
    this.textoBusqueda = event.detail.value;
    this.cargarAlimentos();
  }

  onSegmentChange(event) {
    this.segmentActual = event.detail.value;
    this.cargarAlimentos();
  }

  cargarAlimentos() {
    this.noResultsFound = false;
    this.listaResultados = [];
    if(this.textoBusqueda.trim() !== '') {
      this.loading = true;
      if(this.segmentActual === 'mis-alimentos') {
        this.alimentosService.cargarAlimentosPorUsuario(this.resultados, this.textoBusqueda).subscribe(res => {
          this.listaResultados = res['alimentos'];
          this.comprobarSiHayResultados();
          this.loading = false;
        }, (err) => {
          this.exceptionsService.throwError(err);
          this.loading = false;
        });
      } else {
        this.alimentosService.cargarAlimentosOpenFoodFacts(this.resultados, this.textoBusqueda).subscribe(res => {
          this.filterAlimentosData(res['searchResults']);
          this.comprobarSiHayResultados();
          this.loading = false;
        }, (err) => {
          this.exceptionsService.throwError(err);
          this.loading = false;
        });
      }
    }
  }

  filterAlimentosData(searchResults: any[]) {
    let index = 0;
    searchResults.forEach(result => {
      const nutrientes = result.nutriments;
      const alimento = new Alimento(index.toString(), result.product_name, result.brands, 100, 'gramos', nutrientes['energy-kcal_100g'],
        nutrientes['carbohydrates_100g'], nutrientes['proteins_100g'], nutrientes['fat_100g'], this.usuariosService.uid);
      this.listaResultados.push(alimento);
      index++;
    })
  }

  getSubtituloAlimento(alimento: Alimento): string {
    let subtitulo = alimento.marca != null ? alimento.marca : '';
    const cantidadConUnidad = `${alimento.cantidadReferencia} ${getAbrebiaturaUnidadMedida(alimento.unidadMedida)}`;
    subtitulo += alimento.marca != null ? ` (${cantidadConUnidad})` : `${cantidadConUnidad}`;
    return subtitulo;
  }

  comprobarSiHayResultados() {
    this.noResultsFound = this.listaResultados.length == 0;
  }

  registrarAlimentoConsumido(alimento: Alimento) {
    if(this.segmentActual === 'mis-alimentos') {
      this.goToRegistroAlimento(alimento.uid);
    } else {
      this.alimentosService.createAlimento(alimento).subscribe(res => {
        this.goToRegistroAlimento(res['alimento'].uid);
      });
    }
  }

  goToRegistroAlimento(idAlimento: string) {
    this.diariosService.idAlimentoActual = idAlimento;
    this.router.navigateByUrl('/alimentos/registro');
  }

  // logica para la captura de alimentos
  async loadModel(){
    this.model = await tf.loadLayersModel("../../../assets/modelos/modelo_vgg16/model.json");
  }

  async capturarAlimento() {
    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 100
      });
      this.image = capturedPhoto.dataUrl;
      this.predict();
    } catch (error) {
      if (error.message === 'User cancelled photos app') {
        console.log('El usuario cerró la cámara sin usarla.');
      } else {
        console.error('Ocurrió un error inesperado:', error);
      }
    }
  }


  async predict() {
    this.capturandoAlimento = true;
    tf.tidy(() => {
      const imgObject = new Image();
      imgObject.src = this.image;
      imgObject.crossOrigin = "anonymus";
      imgObject.onload = () => {
        let img = tf.browser.fromPixels(imgObject).resizeBilinear([224,224]);
        img = img.reshape([1,224,224,3]);
        img = tf.cast(img, 'float32');
        const output = this.model.predict(img) as any;
        this.predictions = Array.from(output.dataSync());
        const predictedMax =  this.predictions.indexOf(Math.max(...this.predictions));
        const foodData = this.foodList[predictedMax];
        this.alimentosService.alimentoCapturado = new Alimento('', foodData.nombre, null, 100, 'gramos', foodData.calorias,
                                      foodData.carbohidratos, foodData.proteinas, foodData.grasas, this.usuariosService.uid);
        this.router.navigateByUrl('/alimentos/form/capturado');
        this.capturandoAlimento = false;
      }
    });
  }

}
