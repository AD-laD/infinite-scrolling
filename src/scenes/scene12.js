import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import shadingVertexShader from '../shaders/shading/vertex.glsl'
import shadingFragmentShader from '../shaders/shading/fragment.glsl'
import Experience from '../Experience/Experience.js'
import ObjectModel3D from '../Experience/World/ObjectModel3D.js'
import Sound from '../Experience/World/Sound.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

export default class Scene12 {
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
        this.countTxt=0;

    
    }

    activate() {
        this.active = true;
        this.sceneStartTime = window.performance.now();
        this.camera.position.set(-1.3, 0, 1.5);
        this.camera.lookAt(0,0,0)
        this.controls = new OrbitControls(this.camera, document.querySelector('canvas'));
        this.controls.enableDamping = true;
        this.fontLoader = new FontLoader()
        
        const materialParameters = { color: '#00000' }
        this.material = new THREE.ShaderMaterial({
            vertexShader: shadingVertexShader,
            fragmentShader: shadingFragmentShader,
            uniforms: {
                uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
            },
        });  
        this.htmlPoints();
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
        this.points.forEach((point) => {
        point.element.addEventListener('mouseenter', () => {
            hoverSound.play();
        });
        });

        this.voiceOver = new Sound({
            src: 'sound/scene12.mp3',
            volume: 1
        });
        this.voiceOver.play();
    }

    htmlPoints(){
        this.points = [
            {
            position: new THREE.Vector3(-1, 0, 0),
            element: document.querySelector('.point-s12-1')
            },
            {
            position: new THREE.Vector3(0.5, -0.7, 0),
            element: document.querySelector('.point-s12-2')
            },
            {
            position: new THREE.Vector3(1, 0, 0),
            element: document.querySelector('.point-s12-3')
            },
            {
            position: new THREE.Vector3(-0.8, -0.4, 0),
            element: document.querySelector('.point-s12-4')
            },
            {
            position: new THREE.Vector3(0.8, -0.4, 0),
            element: document.querySelector('.point-s12-5')
            },
            {
            position: new THREE.Vector3(-0.2, -0.8,0),
            element: document.querySelector('.point-s12-6')
            },
            {
            position: new THREE.Vector3(0.2, -0.8, 0),
            element: document.querySelector('.point-s12-7')
            },
            {
            position: new THREE.Vector3(-0.5, -0.7, 0),
            element: document.querySelector('.point-s12-8')
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
            //   this.text.rotateY(-Math.PI/2.5)
                

            if (rotateX) this.text.rotateX(-Math.PI/2);
            this.countTxt++;
            if(this.countTxt > 0) this.createBed();
                
        });
          
    }


    createMaterials(){
        const ageTexture = this.resources.items.age;
        this.ageMat = new THREE.MeshBasicMaterial({
            color: 0xffffff, 
            side: THREE.DoubleSide,
            map: ageTexture, 
            transparent: true,
        });

        const accessTexture = this.resources.items.access;
        this.accessMat = new THREE.MeshBasicMaterial({
            color: 0xffffff, 
            side: THREE.DoubleSide,
            map: accessTexture, 
            transparent: true,
        });

        const dataTexture = this.resources.items.data;
        this.dataMat = new THREE.MeshBasicMaterial({
            color: 0xffffff, 
            side: THREE.DoubleSide,
            map: dataTexture, 
            transparent: true,
        });

        const footprintTexture = this.resources.items.footprint;
        this.footMat = new THREE.MeshBasicMaterial({
            color: 0xffffff, 
            side: THREE.DoubleSide,
            map: footprintTexture, 
            transparent: true,
        });

        const settingsTexture = this.resources.items.settings;
        this.setMat = new THREE.MeshBasicMaterial({
            color: 0xffffff, 
            side: THREE.DoubleSide,
            map: settingsTexture, 
            transparent: true,
        });
        const balanceTexture = this.resources.items.balance;
        this.balanceMat = new THREE.MeshBasicMaterial({
            color: 0xffffff, 
            side: THREE.DoubleSide,
            map: balanceTexture, 
            transparent: true,
        });
        const criticalTexture = this.resources.items.critical;
        this.criticalMat = new THREE.MeshBasicMaterial({
            color: 0xffffff, 
            side: THREE.DoubleSide,
            map: criticalTexture, 
            transparent: true,
        });
        const screenTexture = this.resources.items.screentime;
        this.screenMat = new THREE.MeshBasicMaterial({
            color: 0xffffff, 
            side: THREE.DoubleSide,
            map: screenTexture, 
            transparent: true,
        });

    }

    createBed(){
        this.smiley = new ObjectModel3D('smiley', { x: 1, y: 1, z: 1 }, this.scene)
        // this.smiley.model.traverse((child) => {
        //                 if (child instanceof THREE.Mesh) {
        //                     child.material = this.material;
        //                     child.castShadow = true;
        //                 }
        //             });
        this.smiley.model.position.set(0,0,0)
        this.smiley.model.scale.set(0.5,0.5,0.5)
        this.smiley.model.rotateY(Math.PI)

        const geometry = new THREE.PlaneGeometry(0.2, 0.2);
        const plane = new THREE.Mesh(geometry, this.ageMat);
        plane.position.set(-1, 0, 0);
        const plane2 = new THREE.Mesh(geometry, this.accessMat);
        plane2.position.set(1, 0, 0);
        const plane3 = new THREE.Mesh(geometry, this.dataMat);
        plane3.position.set(-0.8, -0.4, 0);
        const plane4 = new THREE.Mesh(geometry, this.footMat);
        plane4.position.set(0.8, -0.4, 0);
        const plane5 = new THREE.Mesh(geometry, this.setMat);
        plane5.position.set(0.5, -0.7, 0);
        // plane.scale.set(1+scale, 1+scale, 1+scale);
        const plane6 = new THREE.Mesh(geometry, this.balanceMat);
        plane6.position.set(-0.5, -0.7, 0);
        const plane7 = new THREE.Mesh(geometry, this.criticalMat);
        plane7.position.set(-0.2,-0.8, 0);
        const plane8 = new THREE.Mesh(geometry, this.screenMat);
        plane8.position.set(0.2,-0.8, 0);
    
        
        this.scene.add(plane, plane2, plane3, plane4, plane5, plane6, plane7, plane8);
        // this.iconGroup.add(plane);

    }


    createSceneObjects() {
        this.raycaster = new THREE.Raycaster()

        this.light = new THREE.DirectionalLight('#ffffff', 5);
        this.light.position.set(-10, 0, 0);
        this.light.lookAt(0,0,0)
        this.light.intensity= 50;
        this.scene.add(this.light);

        this.createMaterials();

        this.load3DText('For a better use', 0.1, new THREE.Vector3(0, 0.45, 0));

    }
  

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }


    update() {
        if (!this.active) return;
        const elapsedTime = (window.performance.now() - this.sceneStartTime) / 1000;
        if(this.smiley){
            this.smiley.model.position.y += Math.sin(elapsedTime) * 0.001;
            this.smiley.model.position.x += Math.cos(elapsedTime * 2) * 0.0006;
            // this.smiley.model.lookAt(this.camera.position)
        }


        if(this.points && this.smiley){
            for(const point of this.points)
            {
              const screenPosition = point.position.clone()
              screenPosition.project(this.camera)
      
            //   this.raycaster.setFromCamera(screenPosition, this.camera)
            //   const intersects = this.raycaster.intersectObjects(this.scene.children, true)
            //   if(intersects.length === 0)
            //   {
                  point.element.classList.add('visible')
            //   }
            //   else
            //   {
            //     const intersectionDistance = intersects[0].distance
            //     const pointDistance = point.position.distanceTo(this.camera.position)
      
            //     if(intersectionDistance < pointDistance)
            //     {
            //         point.element.classList.remove('visible')
            //     }
            //     else
            //     {
            //         point.element.classList.add('visible')
            //     }
            
            //   }
        
      
              const translateX = screenPosition.x * this.experience.sizes.width * 0.5
              const translateY = -screenPosition.y * this.experience.sizes.height * 0.5
              point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
            //   const targetX = screenPosition.x * this.experience.sizes.width * 0.5;
            //   const targetY = -screenPosition.y * this.experience.sizes.height * 0.5;
      
            //   // Si vous n'avez pas de position précédente, initialisez-la
            //   if (!point.prevTranslateX) {
            //       point.prevTranslateX = targetX;
            //       point.prevTranslateY = targetY;
            //   }
      
            //   // Interpolation pour lisser le mouvement
            //   const smoothFactor = 0.05; // Ajustez ce facteur pour contrôler la fluidité
            //   point.prevTranslateX += (targetX - point.prevTranslateX) * smoothFactor;
            //   point.prevTranslateY += (targetY - point.prevTranslateY) * smoothFactor;
      
            //   // Appliquez les positions lissées
            //   point.element.style.transform = `translateX(${point.prevTranslateX}px) translateY(${point.prevTranslateY}px)`;
                
            }
          }
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
