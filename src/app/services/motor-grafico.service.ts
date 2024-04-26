import { Injectable } from '@angular/core';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

@Injectable({
  providedIn: 'root'
})
export class MotorGraficoService {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  orbitControls: OrbitControls;
  gltfLoader: GLTFLoader;
  rgbeLoader: RGBELoader;
  mouse: THREE.Vector2;
  model: THREE.Group<THREE.Object3DEventMap>;

  rotateModel: boolean = true;
  isLoaded: boolean = false;

  width: number = window.innerWidth;
  height:number = window.innerWidth;
  aspectRatio:number = this.width/this.height;

  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width/600, 0.1, 1000);
    this.gltfLoader = new GLTFLoader();
    this.rgbeLoader = new RGBELoader();
    this.mouse = new THREE.Vector2();
  }

  init() {
    this.renderer.setSize(this.width, 600);
    const elemento = document.getElementById("modelo3D");
    elemento.appendChild(this.renderer.domElement);
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(1.5, 0, 2);
    this.orbitControls.update();
    this.orbitControls.enableZoom = true;
    this.orbitControls.minPolarAngle = 1.5;
    this.orbitControls.maxPolarAngle = 1.5;
  }

  reset() {
    this.renderer.setSize(0, 0);
    this.isLoaded = false;
    if(this.model) {
      this.scene.remove(this.model);
    }
  }

  loadModel(lightUrl: string, modelUrl: string, callback: () => void) {
    // Si el modelo ya está cargado, simplemente llama al callback y devuelve
    if(this.isLoaded) {
      callback();
      return;
    }

    // Cargamos la luz
    this.rgbeLoader.load(lightUrl, (texture: THREE.DataTexture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.environment = texture;
      this.gltfLoader.load(modelUrl, (gltf: any) => {
        this.model = gltf.scene;
        this.scene.add(this.model);
        this.model.position.y += 0.2;
        // Llamamos al callback para notificar que la carga ha terminado
        callback();
        this.isLoaded = true;
      }, null, (error) => { console.error(error); });
    });

    this.renderer.domElement.addEventListener("click", (event: any) => {
      this.rotateModel = false;
    })
  }

  animate() {
    if(this.rotateModel) {
      this.model.rotation.y += 0.02; // para girar el modelo
    }
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    this.renderer.setAnimationLoop(() => this.animate());
  }

}
