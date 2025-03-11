import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import shadingVertexShader from '../shaders/shading/vertex.glsl'
import shadingFragmentShader from '../shaders/shading/fragment.glsl'
import Experience from '../Experience/Experience.js'
import ObjectModel3D from '../Experience/World/ObjectModel3D.js'
import Sound from '../Experience/World/Sound.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

export default class Scene11 {
  constructor() {
    this.scene = new THREE.Scene();
    console.log("Scene 11");
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    
    this.experience = new Experience()
    this.resources = this.experience.resources
    this.active = false;

    this.debug = this.experience.debug
    console.log(this.debug)
    this.debugFolder=this.debug.ui
    
    const geometry = new THREE.BoxGeometry();
    this.countTxt=0;


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
    this.sceneStartTime = window.performance.now();
    this.camera.position.set(-1.3, 0, 1.5);
    this.camera.lookAt(0,0,0)
    this.controls = new OrbitControls(this.camera, document.querySelector('canvas'));
    this.controls.enableDamping = true;
    this.fontLoader = new FontLoader();
    this.textGroup = new THREE.Group();

    this.createSceneObjects();
    this.loadSounds();
    this.switchButton = document.getElementById('switch-scene-btn');
    if (this.switchButton) {
      this.onSwitchSceneClick = () => window.experience.switchScene();
      this.switchButton.addEventListener('click', this.onSwitchSceneClick);
    }
  
  }


  loadSounds(){
    const hoverSound = new Sound({
      src: 'sound/hover.wav',
      volume: 0.8
    });
    // this.points.forEach((point) => {
    //   point.element.addEventListener('mouseenter', () => {
    //       hoverSound.play();
    //   });
    // });

    this.voiceOver = new Sound({
                src: 'sound/scene11.mp3',
                volume: 1
            });
    this.voiceOver.play();
  }

  load3DText(content, size, position, rotateX){
          this.fontLoader.load(
              '/fonts/helvetiker_regular.typeface.json',
              (font) =>
              {
                  this.textGeometry = new TextGeometry(
                      content,
                      {
                          font: font,
                          size: size,
                          depth: 0.005,
                          curveSegments: 12,
                          bevelEnabled: true,
                          bevelThickness: 0.005,
                          bevelSize: 0.0025,
                          bevelOffset: 0,
                          bevelSegments: 5
                      }
                  )
              
                 
                  this.text = new THREE.Mesh(this.textGeometry, this.textMaterial)
                  this.textGeometry.computeBoundingBox()
                  this.textGeometry.translate(
                      - (this.textGeometry.boundingBox.max.x-0.02) * 0.5,
                      - (this.textGeometry.boundingBox.max.y-0.02) + 1.5,
                      - (this.textGeometry.boundingBox.max.z-0.02) * 0.5
                  )
                  this.textGeometry.center()
                  this.scene.add(this.text)
                  this.text.position.set(position.x,position.y,position.z)
                  this.text.rotateY(-Math.PI/2.5)
                  

                if (rotateX) this.text.rotateX(-Math.PI/2);
                this.textGroup.add(this.text);


                this.countTxt++;
                if(this.countTxt > 4) this.createBed();
                  
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

  createBed(){
    this.bed = new ObjectModel3D('bed', { x: 1, y: 1, z: 1 }, this.scene)
    this.sleep = new ObjectModel3D('sleep', { x: 1, y: 1, z: 1 }, this.scene)
    this.bed.model.position.set(0,0,0)
    this.bed.model.scale.set(4.5,4.5,4.5)

    this.sleep.model.position.set(0,0.2,-0.2)
    this.sleep.model.scale.set(2,2,2)
    this.sleep.model.rotation.z = Math.PI;
    this.sleep.model.rotation.x = Math.PI/1.6;
    this.sleep.model.rotation.y = -Math.PI/8;
  }


    createSceneObjects() {
        this.raycaster = new THREE.Raycaster()

        this.light = new THREE.DirectionalLight('#ffffff', 5);
        this.light.position.set(-2, 0, 1);
        this.light.lookAt(0,0,0)
        this.light.intensity= 50;
        this.scene.add(this.light);

        this.load3DText('Eating Disorder', 0.1, new THREE.Vector3(0.2, 0.45, 0.7));
        this.load3DText('Sleep Disorder', 0.05, new THREE.Vector3(0.5, 0.55, 0.2));
        this.load3DText('Reduced Real-Life Social Interaction', 0.07, new THREE.Vector3(0.3, 0.65, 0.2));
        this.load3DText('Exposure to Online Harassment', 0.04, new THREE.Vector3(0.4, 0.75, 0.2));
        this.load3DText('Decreased Self-Esteem', 0.05, new THREE.Vector3(0.25, 0.85, -0.2));
        this.load3DText('Anxiety and Depression', 0.15, new THREE.Vector3(0.25, 1.05, 0));
        this.scene.add(this.textGroup)

    }
  

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }


    update() {
      if (!this.active) return;
      const elapsedTime = (window.performance.now() - this.sceneStartTime) / 1000;
      this.textGroup.children.forEach((text, index) => {
        const speed = 0.5 + index * 0.1; 
        text.position.y += Math.sin(elapsedTime * speed) * 0.001;
        text.position.x += Math.cos(elapsedTime * speed) * 0.0006;
        text.lookAt(this.camera.position)

      });
    }

    
    destroy() {

      if (this.switchButton && this.onSwitchSceneClick) {
      this.switchButton.removeEventListener('click', this.onSwitchSceneClick);
      this.onSwitchSceneClick = null;
      }
      this.voiceOver.stop();
  
      this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh || child instanceof THREE.Points || child instanceof THREE.Line) {
          if (child.geometry) {
          child.geometry.dispose();
          }
          if (Array.isArray(child.material)) {
          
          child.material.forEach((mat) => mat?.dispose?.());
          } else if (child.material) {
          child.material.dispose?.();
          }
      }
      });
  
      while (this.scene.children.length > 0) {
      this.scene.remove(this.scene.children[0]);
      }
  
      if (this.controls) {
      this.controls.dispose();
      this.controls = null;
      }
  
      if (this.videodata) {
      this.videodata.pause();
      this.videodata.src = "";
      this.videodata.load();
      this.videodata = null;
      this.video = null;
      }
  
      if (this.raycaster) {
      this.scene.remove(this.raycaster);
      this.raycaster = null;
      }
  
      if (this.light) {
      this.scene.remove(this.light);
      this.light.dispose();
      this.light = null;
      }
  
      this.camera = null;

      this.active = false;
      this.hidePoints?.();
      console.log(this.scene);
      
      this.scene.clear();
      this.scene = null;  

    }
}
