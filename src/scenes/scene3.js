import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import shadingVertexShader from '../shaders/shading/vertex.glsl'
import shadingFragmentShader from '../shaders/shading/fragment.glsl'
import ObjectModel3D from '../Experience/World/ObjectModel3D.js';
import Experience from '../Experience/Experience.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'





export default class Scene3 {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
        25,
        window.innerWidth / window.innerHeight,
        0.1,
        100
        );
        this.camera.position.set(7, 7, 7);


        this.experience = new Experience()
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        console.log(this.debug)
        this.debugFolder=this.debug.ui


        this.lastChangeTime = 0;
        this.changeInterval = 0.05;
        this.heartGroup = new THREE.Group();
        this.active = false; 
        
        // Contrôles d'orbite
        this.controls = new OrbitControls(this.camera, document.querySelector('canvas'));
        this.controls.enableDamping = true;

        
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // this.setLight();
        // // this.setupDebug();
        // this.load3DText();
        // this.createSceneObjects();


    }

   
    deactivate() {
        this.active = false;
        console.log("Scene3 deactivated");
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

    setupDebug() {
        // Exemple d'ajout de contrôles pour la caméra
        if (this.debug.active) {
            console.log('debug');
            this.debugFolder
            .add(this.sunLight, 'intensity')
            .name('sunLightIntensity')
            .min(0)
            .max(10)
            .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'x')
                .name('sunLightX')
                .min(- 5)
                .max(5)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'y')
                .name('sunLightY')
                .min(- 5)
                .max(5)
                .step(0.001)
            
            this.debugFolder
                .add(this.sunLight.position, 'z')
                .name('sunLightZ')
                .min(- 5)
                .max(5)
                .step(0.001)
        }
    }

    load3DText(){
        const fontLoader = new FontLoader()
        fontLoader.load(
            '/fonts/helvetiker_regular.typeface.json',
            (font) =>
            {
                const textGeometry = new TextGeometry(
                    'I n f i n i t e  S c r o l l i n g',
                    {
                        font: font,
                        size: 0.2,
                        depth: 0.01,
                        curveSegments: 12,
                        bevelEnabled: true,
                        bevelThickness: 0.01,
                        bevelSize: 0.005,
                        bevelOffset: 0,
                        bevelSegments: 5
                    }
                )
            
                // const textMaterial = new THREE.MeshBasicMaterial()
                const textMaterial = new THREE.MeshBasicMaterial({ wireframe: true })
                // const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
                const text = new THREE.Mesh(textGeometry, textMaterial)
                textGeometry.computeBoundingBox()
                textGeometry.translate(
                    - (textGeometry.boundingBox.max.x-0.02) * 0.5,
                    - (textGeometry.boundingBox.max.y-0.02) + 1.5,
                    - (textGeometry.boundingBox.max.z-0.02) * 0.5
                )
                // textGeometry.center()
                this.scene.add(text)
            });
    }

    videoTexture(){
        video = document.getElementById( 'video' );
        video.muted = false;
        video.load();
        document.addEventListener('click', () => {
            video.loop = true;
            video.play();
        });
        video.addEventListener('play', () => {
            console.log('La vidéo a commencé à jouer');
        });
        this.videodata=video;
        // if(video){
        //     console.log("oui")
        // }

        const videotexture = new THREE.VideoTexture(video);
        videotexture.minFilter = THREE.LinearFilter;
        videotexture.magFilter = THREE.LinearFilter;
        videotexture.format = THREE.RGBFormat;

        this.testMaterial = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            alphaMap: this.alphamap,       
            transparent: true,  
            map:videotexture,  
        });

        return this.testMaterial
    }

    createSceneObjects() {
        // Création du matériau de base
        this.scene.add(this.heartGroup);
        const materialParameters = { color: '#00000' }
        this.material = new THREE.ShaderMaterial({
            vertexShader: shadingVertexShader,
            fragmentShader: shadingFragmentShader,
            uniforms: {
                uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
            },
        });  


        const iphoneScale = { x: 2, y: 2, z: 2 };

        // this.resources.on('ready', () =>
        // {
        //     console.log("ressources chargées");
            // Setup
            this.Iphone = new ObjectModel3D('iphone', iphoneScale, this.scene)
            this.Iphone.model.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material = this.material;
                    // child.castShadow = true;
                }
            });
            this.Iphone.model.scale.z=-1


            this.TikTokLogo = new ObjectModel3D('tiktoklogo', { x: 0.5, y: 0.5, z: 0.5 }, this.scene)
            this.TikTokLogo.model.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material = this.material;
                    // child.castShadow = true;
                }
            });
            this.Heart = new ObjectModel3D('heart', { x: 0, y: 0, z: 0 }, this.scene)
            this.Heart.model.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material = this.material;
                    child.castShadow = true;
                }
            });
            this.heartPosition();
  
        // })
    
        this.alphamap = new THREE.TextureLoader().load('models/Iphone/iphonetexture.png');
        
        // testMaterial.hue = 0.2;
        // testMaterial.saturation = 0.3;

        // testMaterial.color.setHSL( testMaterial.hue, testMaterial.saturation, 0.5 );

        const geometry = new THREE.PlaneGeometry(0.93, 1.95); 

        this.PhoneScreen = new THREE.Mesh(geometry, this.videoTexture());
        // this.PhoneScreen.scale.z = -1; // Inverse la face visible
        // this.torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),this.material);
        // this.torusKnot.position.set(3, 0, 0);
        // this.scene.add(this.torusKnot);


        
        // if(this.Iphone){
        //     this.PhoneScreen.position.set(this.Iphone.position) 
        //     // this.PhoneScreen.rotation.set(this.Iphone.rotation)
        // }
        
        this.scene.add(this.PhoneScreen)

        this.scene.fog = new THREE.Fog( 0x000000, 1, 1000 );

    }



    heartPosition(){
        if(this.Heart){
            for(let i = 0; i < 50; i++)
                {
                    const position = new THREE.Vector3(
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10,
                        (Math.random() - 0.5) * 10
                    );
                    
                    const scale = Math.random()*0.005;
        
                    // Ajouter le cœur cloné à la scène
                    this.heartGroup = this.Heart.addToScene(this.scene, this.material, position, scale, this.heartGroup);
                }
        }
    }


    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    setupEventListeners() {
        // window.addEventListener('resize', this.resize.bind(this));

        // Event listener pour les clics
        window.addEventListener('click', this.onClick.bind(this));
    }

    activate() {
        this.active = true;
        console.log("Scene3 activated");
        // Création des objets de la scène


        // Écouteurs d'événements
        this.setupEventListeners();
        this.switchButton = document.getElementById('switch-scene-btn');
        if (this.switchButton) {
          this.onSwitchSceneClick = () => window.experience.switchScene();
          this.switchButton.addEventListener('click', this.onSwitchSceneClick);
        }


        this.setLight();
        // this.setupDebug();
        this.load3DText();
        this.createSceneObjects();

    }


    onClick(event) {
        // Calculer la position de la souris
        
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Détecter les objets cliqués avec le raycaster
        // this.raycaster.setFromCamera(this.mouse, this.camera);
        // const intersects = this.raycaster.intersectObject(this.sphere);
        // if (intersects.length > 0) {
        // // console.log('Sphère cliquée!');
        // window.experience.switchScene(); // Appeler la méthode de changement de scène
        // }
    }

    update() {
        // Animation de la scène
        if (!this.active) return;
        const elapsedTime = window.performance.now() / 1000;
        console.log("ouiii");

        if (elapsedTime - this.lastChangeTime > this.changeInterval) {
            this.sunLight.intensity = Math.random() +0.3;
            // this.sunLight.intensity = 5;
            this.lastChangeTime = elapsedTime;
        }

        // Rotation des objets
        const offset = new THREE.Vector3(0, 0, 0.055); 
        if (this.Iphone) {
        // this.Iphone.model.rotation.x = -elapsedTime * 0.1;
        // this.Iphone.model.rotation.y = elapsedTime * 0.2;
            this.PhoneScreen.position.copy(this.Iphone.model.position.clone().add(offset.applyQuaternion(this.Iphone.model.quaternion)));
        
        // this.PhoneScreen.quaternion.copy(this.Iphone.model.quaternion);
        // this.PhoneScreen.rotateOnAxis.z = 90;

        }

        if (this.TikTokLogo){
            this.TikTokLogo.model.position.set(-1,-4.5,-15);
        }

        if(this.Heart){
            this.heartGroup.children.forEach((child) => {
                child.position.y -= 0.001 + Math.random() * 0.002;
                // child.position.y.set(child.position.y - (0.01 + Math.random() * 0.2) )
                if (child.position.y < -3) {
                    child.position.y = 2 + Math.random() * 5;
                    child.position.x = (Math.random() - 0.5) * 10;
                    child.position.z = (Math.random() - 0.5) * 10;
                }
                // console.log("parcourt du groupe");
            });
        }

        // this.torusKnot.rotation.x = -elapsedTime * 0.1;
        // this.torusKnot.rotation.y = elapsedTime * 0.2;

        // Mise à jour des contrôles
        this.controls.update();
  }


    destroy() {
        //a faire : melanger destroy et desactive
        // window.removeEventListener('click', this.onClick.bind(this));
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
        // Détruire la texture vidéo si elle existe
        if (this.videodata) {
            this.videodata.pause();
            this.videodata.src = "";
            this.videodata.load();
            this.videodata = null;
        }
        // Supprimer les lumières
        while (this.scene.children.length > 0) {
            const child = this.scene.children[0];
            this.scene.remove(child);
        }
        this.raycaster = null;
        this.material = null;
        this.testMaterial = null;
        this.heartGroup = null;
        this.PhoneScreen = null;
        this.Iphone = null;
        this.TikTokLogo = null;
        this.Heart = null;
        // Désactiver la scène
        this.active = false;
        this.scene.clear();

        console.log("Scene3 destroyed");
    }


  //ajouter une fonction de suppression des données de la scènes/stop de l'update/stop de la video


}
