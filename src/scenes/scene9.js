import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import shadingVertexShader from '../shaders/shading/vertex.glsl'
import shadingFragmentShader from '../shaders/shading/fragment.glsl'
import Experience from '../Experience/Experience.js'
import ObjectModel3D from '../Experience/World/ObjectModel3D.js'
import Sound from '../Experience/World/Sound.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

export default class Scene9 {
  constructor() {
    this.scene = new THREE.Scene();
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
    this.sceneStartTime = window.performance.now();
    this.camera.position.set(1, 1.5, 1);
    this.camera.lookAt(0,0,0)
    this.controls = new OrbitControls(this.camera, document.querySelector('canvas'));
    this.controls.enableDamping = true;
    this.fontLoader = new FontLoader();

    this.iconGroup= new THREE.Group();
    
    this.createSceneObjects();
    // this.loadSounds();
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
    this.points.forEach((point) => {
      point.element.addEventListener('mouseenter', () => {
          hoverSound.play();
      });
    });
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
                          depth: 0.01,
                          curveSegments: 12,
                          bevelEnabled: true,
                          bevelThickness: 0.01,
                          bevelSize: 0.005,
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


    iconPosition(){
        if(this.bookmarkMat){
            const maxRadius = 1; 
            const maxHeight = 2; 
            const mat = [
                this.commentMat,
                this.bookmarkMat,
                this.likeMat,
                this.shareMat
            ]
            let count = 0;
            for(let i = 0; i < 70; i++)
            {
                // const position = new THREE.Vector3(
                //     (Math.random() - 0.5) * 1,
                //     (Math.random() - 0.5) * 1,
                //     (Math.random() - 0.5) * 1
                // );
                count++;
                if(count === 4) count = 0;
                const height = Math.random() * maxHeight;

                // Étape 2 : Calculer le rayon à cette hauteur (inversement proportionnel)
                const currentRadius = (1 - height / maxHeight) * maxRadius;
        
                // Étape 3 : Générer un point aléatoire dans le disque de rayon `currentRadius`
                const angle = Math.random() * Math.PI * 2; // Angle aléatoire en radians
                const radius = Math.sqrt(Math.random()) * currentRadius; // Rayon aléatoire (distribution uniforme)
        
                const x = Math.cos(angle) * radius;
                const y = -height+2+0.3; // Inverser la hauteur pour un cône inversé
                const z = Math.sin(angle) * radius;

                const scale = Math.random()*0.05;
                const geometry = new THREE.PlaneGeometry(0.05, 0.05);
                const plane = new THREE.Mesh(geometry, mat[count]);
                plane.position.set(x, y, z);
                plane.scale.set(1+scale, 1+scale, 1+scale);
                plane.rotation.y = Math.random() * Math.PI * 2;
                this.scene.add(plane);
                this.iconGroup.add(plane);
    
            }
        }
    }

    createMaterials(){
        const bookmarkTexture = this.resources.items.bookmark;
        this.bookmarkMat = new THREE.MeshBasicMaterial({
            color: 0xffffff, 
            side: THREE.DoubleSide,
            map: bookmarkTexture, 
            transparent: true,
        });

        const commentTexture = this.resources.items.comment;
        this.commentMat = new THREE.MeshBasicMaterial({
            color: 0xffffff, 
            side: THREE.DoubleSide,
            map: commentTexture, 
            transparent: true,
        });

        const likeTexture = this.resources.items.like;
        this.likeMat = new THREE.MeshBasicMaterial({
            color: 0xffffff, 
            side: THREE.DoubleSide,
            map: likeTexture, 
            transparent: true,
        });

        const shareTexture = this.resources.items.share;
        this.shareMat = new THREE.MeshBasicMaterial({
            color: 0xffffff, 
            side: THREE.DoubleSide,
            map: shareTexture, 
            transparent: true,
        });

    }

    createSceneObjects() {
        this.raycaster = new THREE.Raycaster()
        this.createMaterials();
        this.light = new THREE.DirectionalLight('#ffffff');
        this.light.position.set(10, 6, 0);
        this.light.lookAt(0,1,0)
        this.light.intensity= 40;
        this.scene.add(this.light);

        // this.load3DText('crampte', 0.1, new THREE.Vector3(0.2, -0.45, 0.7),1);

        this.body = new ObjectModel3D('body', { x: 1, y: 1, z: 1 }, this.scene)

        

        const geometry = new THREE.PlaneGeometry(0.1, 0.1);
        const formTexture = this.resources.items.formule;
        const formMat = new THREE.MeshBasicMaterial({
            color: 0xffffff, 
            side: THREE.DoubleSide,
            map: formTexture, 
            transparent: true,
        });
        const geometry2 = new THREE.PlaneGeometry(4, 0.4)
        this.plane2 = new THREE.Mesh(geometry2, formMat)

        this.plane2.position.set(0, -0.5, 0)
        this.scene.add(this.plane2)
        this.iconPosition()
        this.scene.add(this.iconGroup)
    }
  

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }


    update() {
        if (!this.active) return;
        const elapsed = (window.performance.now() - this.sceneStartTime) / 1000;
        this.body.model.position.y = 0.2 + Math.sin(elapsed) * 0.1;
        this.body.model.position.x = Math.sin(elapsed * 0.5) * 0.04;
    
        this.body.model.rotation.z = Math.sin(elapsed * 0.3) * 0.1;

        // this.plane.rotation.z = Math.sin(elapsed * 0.3) * 0.5;
        this.plane2.lookAt(this.camera.position);


        const maxHeight = 2;
        const speed = 0.01; 
        const coneBaseRadius = 0.5;

        this.iconGroup.children.forEach((mesh) => {
            mesh.position.y += speed;

            // Ajuster le rayon en fonction de la hauteur actuelle pour rester dans le cône
            const currentRadius = (1 - mesh.position.y / maxHeight) * coneBaseRadius;
            const distanceFromCenter = Math.sqrt(mesh.position.x ** 2 + mesh.position.z ** 2);

            if (distanceFromCenter > currentRadius) {
                // Forcer l'objet à rester dans le cône
                const angle = Math.atan2(mesh.position.z, mesh.position.x);
                mesh.position.x = Math.cos(angle) * currentRadius;
                mesh.position.z = Math.sin(angle) * currentRadius;
            }

            // Si l'objet dépasse la hauteur maximale, le respawn au bas du cône
            if (mesh.position.y > maxHeight) {
                const height = this.body.model.position.y; 
                const radius = Math.random() * coneBaseRadius;
                const angle = Math.random() * Math.PI * 2;

                const x = Math.cos(angle) * radius;
                const y = height;
                const z = Math.sin(angle) * radius;

                mesh.position.set(x, y, z);
            }
        });
        
    }

    
    destroy() {

        if (this.switchButton && this.onSwitchSceneClick) {
        this.switchButton.removeEventListener('click', this.onSwitchSceneClick);
        this.onSwitchSceneClick = null;
        }
    
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
