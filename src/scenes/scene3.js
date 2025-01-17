import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import shadingVertexShader from '../shaders/shading/vertex.glsl'
import shadingFragmentShader from '../shaders/shading/fragment.glsl'
import Experience from '../Experience/Experience.js'
import ObjectModel3D from '../Experience/World/ObjectModel3D.js'
import Sound from '../Experience/World/Sound.js'

export default class Scene3 {
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
    console.log("Scene3 activated");
    
    this.createSceneObjects();
    this.loadSounds();
    this.switchButton = document.getElementById('switch-scene-btn');
    if (this.switchButton) {
      this.onSwitchSceneClick = () => window.experience.switchScene();
      this.switchButton.addEventListener('click', this.onSwitchSceneClick);
    }
  
  }

  deactivate() {
    this.active = false;
    console.log("Scene3 desactivated");
  }

  htmlPoints(){
    this.points = [
      {
        position: new THREE.Vector3(0, 0, -0.6),
        element: document.querySelector('.point-0')
      },
      {
        position: new THREE.Vector3(0, 0.35, -0.4),
        element: document.querySelector('.point-1')
      },
      {
        position: new THREE.Vector3(0, 0.2, 0.6),
        element: document.querySelector('.point-2')
      },
      {
        position: new THREE.Vector3(0.3, -0.2, 0.2),
        element: document.querySelector('.point-3')
      },
      {
        position: new THREE.Vector3(-0.3, -0.2, 0.2),
        element: document.querySelector('.point-4')
      },
      {
        position: new THREE.Vector3(0, -0.35,-0.2),
        element: document.querySelector('.point-5')
      }
    ]
  }

  hidePoints(){
    if(this.points){
        for(const point of this.points)
        {
            point.element.classList.remove('visible')
        }
    }
  }

  loadSounds(){
    const hoverSound = new Sound({
      src: 'sound/hover.wav',
      volume: 0.8
    });
    // document.querySelector('.point').addEventListener('mouseenter', () => {
    //   hoverSound.play();
    // });
    this.points.forEach((point) => {
      point.element.addEventListener('mouseenter', () => {
          hoverSound.play();
      });
  });
  }

  videoTexture(){
    this.video = document.getElementById( 'video2' );
    this.video.muted = true;
    // this.video.load();
    this.video.play();

    console.log('État de la vidéo :', this.video.readyState);
      this.video.addEventListener('canplay', () => {
        console.log('La vidéo est prête à être jouée');
    });
      this.video.addEventListener('play', () => {
        console.log('La vidéo scene 3 a commencé à jouer');
    });
    this.videodata=this.video;
    const videotexture = new THREE.VideoTexture(this.video);
    videotexture.minFilter = THREE.LinearFilter;
    videotexture.magFilter = THREE.LinearFilter;
    videotexture.format = THREE.RGBFormat;
    videotexture.needsUpdate = true;


    this.videoMaterial = new THREE.MeshBasicMaterial({
        map:videotexture,
        transparent: true, 
        opacity: 0.2
    });

    return this.videoMaterial
  }

  createSphere(radius, widthSegments, heightSegments, position) {
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    geometry.scale(-1, 1, 1)
    if(this.videoMaterial){
      const sphere = new THREE.Mesh(geometry, this.videoTexture());
      sphere.position.set(position.x, position.y, position.z);
      this.scene.add(sphere);
      return sphere;
    }
  }

  setLight(){
    this.sunLight = new THREE.DirectionalLight('#ffffff', 10)
    this.sunLight.castShadow = true
    this.sunLight.shadow.camera.far = 15
    this.sunLight.shadow.mapSize.set(1024, 1024)
    this.sunLight.shadow.normalBias = 0.05
    this.sunLight.position.set(3.5, 2, 3.5)
    this.scene.add(this.sunLight)

    const light = new THREE.DirectionalLight('#ffffff', 1.5);
    light.position.set(1, 1, 1).normalize();
    light.lookAt(0,0,0)
    light.intensity= 5;
    this.scene.add(light);
  }
  

  createSceneObjects() {
    this.htmlPoints();
    // this.setLight();
    this.raycaster = new THREE.Raycaster()
      this.light = new THREE.DirectionalLight('#ffffff', 5);
      this.light.position.set(0, -10, 0);
      this.light.lookAt(0,0,0)
      this.light.intensity= 100;
      this.scene.add(this.light);
      this.videoTexture();
    // this.testMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
            // testMaterial.hue = 0.2;
            // testMaterial.saturation = 0.3;

    // (this.resources.on('ready', () =>
    // {
      this.Brain = new ObjectModel3D('brain', { x: 1, y: 1, z: 1 }, this.scene)
    // })
    // this.createSphere(0.5, 32, 16,{ x: -2, y: 0, z: 0 }); 
    // this.createSphere(0.7, 32, 16, { x: -5, y: 0, z: 10 });  
    this.createSphere(10, 32, 16, { x: 0, y: 0, z: 0 });
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

    if(this.points && this.Brain){
      for(const point of this.points)
      {
        const screenPosition = point.position.clone()
        screenPosition.project(this.camera)

        this.raycaster.setFromCamera(screenPosition, this.camera)
        const intersects = this.raycaster.intersectObjects(this.scene.children, true)
        if(intersects.length === 0)
        {
            point.element.classList.add('visible')
        }
        else
        {
          const intersectionDistance = intersects[0].distance
          const pointDistance = point.position.distanceTo(this.camera.position)

          if(intersectionDistance < pointDistance)
          {
              point.element.classList.remove('visible')
          }
          else
          {
              point.element.classList.add('visible')
          }
      
        }
  

        // const translateX = screenPosition.x * this.experience.sizes.width * 0.5
        // const translateY = -screenPosition.y * this.experience.sizes.height * 0.5
        // point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
        const targetX = screenPosition.x * this.experience.sizes.width * 0.5;
        const targetY = -screenPosition.y * this.experience.sizes.height * 0.5;

        // Si vous n'avez pas de position précédente, initialisez-la
        if (!point.prevTranslateX) {
            point.prevTranslateX = targetX;
            point.prevTranslateY = targetY;
        }

        // Interpolation pour lisser le mouvement
        const smoothFactor = 0.05; // Ajustez ce facteur pour contrôler la fluidité
        point.prevTranslateX += (targetX - point.prevTranslateX) * smoothFactor;
        point.prevTranslateY += (targetY - point.prevTranslateY) * smoothFactor;

        // Appliquez les positions lissées
        point.element.style.transform = `translateX(${point.prevTranslateX}px) translateY(${point.prevTranslateY}px)`;
          
      }
    }

    
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

    if (this.videodata) {
      this.video = null;
      this.videodata.pause();
      this.videodata.src = "";
      this.videodata.load();
      this.videodata = null;
    }
    this.raycaster = null;
    this.active = false;
    this.hidePoints();

    this.camera=null;
    this.scene.clear();
    console.log("Scene3 destroyed");

  }
}
