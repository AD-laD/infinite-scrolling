import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import shadingVertexShader from '../shaders/shading/vertex.glsl'
import shadingFragmentShader from '../shaders/shading/fragment.glsl'
import Experience from '../Experience/Experience.js'
import ObjectModel3D from '../Experience/World/ObjectModel3D.js';

export default class Scene1 {
  constructor() {
    this.scene = new THREE.Scene();
    console.log("Scene 1");
    // Caméra spécifique à cette scène
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1, 3);
    this.controls = new OrbitControls(this.camera, document.querySelector('canvas'));
    this.controls.enableDamping = true; // Active le lissage des contrôles
    
    this.experience = new Experience()
    this.resources = this.experience.resources
    this.active = false;

    this.debug = this.experience.debug
    console.log(this.debug)
    this.debugFolder=this.debug.ui
    
    
    const geometry = new THREE.BoxGeometry();




    // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const materialParameters = { color: '#00000' }
    this.material = new THREE.ShaderMaterial({
        vertexShader: shadingVertexShader,
        fragmentShader: shadingFragmentShader,
        uniforms: {
            uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
        },
    });  
    // this.cube = new THREE.Mesh(geometry, this.material);
    
    // this.scene.add(this.cube);

   
  }

  activate() {
    this.active = true;
    console.log("Scene1 activated");
    this.createSceneObjects();
    this.switchButton = document.getElementById('switch-scene-btn');
    if (this.switchButton) {
      this.onSwitchSceneClick = () => window.experience.switchScene();
      this.switchButton.addEventListener('click', this.onSwitchSceneClick);
    }

  }

  deactivate() {
    this.active = false;
    console.log("Scene1 desactivated");
  }


  createSceneObjects() {
      this.light = new THREE.DirectionalLight('#ffffff', 5);
      this.light.position.set(0, -10, 0);
      this.light.lookAt(0,0,0)
      this.light.intensity= 100;
      this.scene.add(this.light);
    // this.testMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
            // testMaterial.hue = 0.2;
            // testMaterial.saturation = 0.3;

    this.resources.on('ready', () =>
    {
      // Setup
      this.Brain = new ObjectModel3D('brain', { x: 1, y: 1, z: 1 }, this.scene)
      // this.Brain.model.traverse((child) => {
      //     if (child instanceof THREE.Mesh) {
      //         child.material = this.testMaterial;
      //         // child.castShadow = true;
      //     }
      // });

    })     
  }
  

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }


  update() {
    if (!this.active) return;
    const elapsedTime = window.performance.now() / 1000;
    const radius = 10;  // Rayon du cercle

    // Rotation circulaire sous l'objet
    this.light.position.x = radius * Math.cos(elapsedTime);
    this.light.position.z = radius * Math.sin(elapsedTime);
    
    // console.log("crampté");
  }

  destroy() {
    //a faire : melanger destroy et desactive
    // window.removeEventListener('click', window);
    if (this.switchButton && this.onSwitchSceneClick) {
      this.switchButton.removeEventListener('click', this.onSwitchSceneClick);
    }
        this.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            child.geometry.dispose();

            for (const key in child.material) {
                const value = child.material[key];
                if (value && typeof value.dispose === 'function') {
                    value.dispose();
                }
            }
        }
    });
    if (this.controls) {
        this.controls.dispose();
    }
    while (this.scene.children.length > 0) {
        const child = this.scene.children[0];
        this.scene.remove(child);
    }
    // this.raycaster = null;
    this.active = false;


    this.scene.clear();
    console.log("Scene1 destroyed");

    // console.log(this.scene);
  }
}
