import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import shadingVertexShader from '../shaders/shading/vertex.glsl'
import shadingFragmentShader from '../shaders/shading/fragment.glsl'
import ObjectModel3D from '../Experience/World/ObjectModel3D.js';
import Experience from '../Experience/Experience.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import Sound from '../Experience/World/Sound.js'


export default class Scene6 {
    constructor() {
        this.scene = new THREE.Scene();
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.camera = new THREE.PerspectiveCamera(
            25,
            this.experience.sizes.width / this.experience.sizes.height,
            0.1,
            100
            );
        this.debug = this.experience.debug
        console.log(this.debug)
        this.debugFolder=this.debug.ui
        this.active = false; 
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

   
    setLight(){
        this.light = new THREE.DirectionalLight('#ffffff', 1.5);
        this.light.position.set(1, 1, 1).normalize();
        this.light.lookAt(0,0,0)
        this.light.intensity= 5;
        this.scene.add(this.light);
    }

    setupDebug() {
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

        //     this.debugFolder
        //     .add(this, 'ptx')
        //     .name('ptX')
        //     .min(-5)
        //     .max(5)
        //     .step(0.001)
        //     .onChange(() => this.updateHtmlPoints());
        
        // this.debugFolder
        //     .add(this, 'pty')
        //     .name('ptY')
        //     .min(-5)
        //     .max(5)
        //     .step(0.001)
        //     .onChange(() => this.updateHtmlPoints());
        
        // this.debugFolder
        //     .add(this, 'ptz')
        //     .name('ptZ')
        //     .min(-5)
        //     .max(5)
        //     .step(0.001)
        //     .onChange(() => this.updateHtmlPoints());
        }
    }

    htmlPoints(){
        this.points = [
            {
            position: new THREE.Vector3(0.52, 0.4, 0),
            element: document.querySelector('.point-s6-1')
            },
            {
            position: new THREE.Vector3(0.27, -0.12, 0),
            element: document.querySelector('.point-s6-2')
            },
            {
            position: new THREE.Vector3(0, -0.62, 0),
            element: document.querySelector('.point-s6-3')
            },
            {
            position: new THREE.Vector3(-0.25, -1.2, 0),
            element: document.querySelector('.point-s6-4')
            },
            {
            position: new THREE.Vector3(-0.5, -1.7, 0),
            element: document.querySelector('.point-s6-5')
            },
            {
            position: new THREE.Vector3(-0.78, -2, 0),
            element: document.querySelector('.point-s6-6')
            },
            {
            position: new THREE.Vector3(-1, -2.2, 0),
            element: document.querySelector('.point-s6-7')
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
        this.points.forEach((point) => {
            point.element.addEventListener('mouseenter', () => {
                hoverSound.play();
            });
        });
    }

    createBars(){
        this.data = [
            { year: 2018, users: 347 },
            { year: 2019, users: 653 },
            { year: 2020, users: 1036 },
            { year: 2021, users: 1407 },
            { year: 2022, users: 1720 },
            { year: 2023, users: 1922 },
            { year: 2024, users: 2050 }
        ];
        this.data.forEach((entry, index) => {
            const height = entry.users / 700; 
            const geometry = new THREE.BoxGeometry(0.1, height, 0.5);
            const cube = new THREE.Mesh(geometry, this.material);
   
            cube.position.set(-0.5+index/4, (height / 2)-1, 0);
      
            this.scene.add(cube);
        });
    }

    load3DText(content, size, position, rotateZ){
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
                if (rotateZ) this.text.rotateZ(-Math.PI/2);
                
            });
    }


    createMaterials(){
        const materialParameters = { color: '#00000' }
        this.material = new THREE.ShaderMaterial({
            vertexShader: shadingVertexShader,
            fragmentShader: shadingFragmentShader,
            uniforms: {
                uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
            },
        });
        this.textMaterial = new THREE.MeshBasicMaterial()

    }

    createSceneObjects() {
        this.createMaterials()
        this.setupDebug()
        this.createBars()
        this.htmlPoints()

        this.load3DText('Growth of TikTok users', 0.15, new THREE.Vector3(0.2, -1.7, 0));
        this.load3DText('2018', 0.1, new THREE.Vector3(-0.5, -1.3, 0),1);
        this.load3DText('2019', 0.1, new THREE.Vector3(-0.25, -1.3, 0),1);
        this.load3DText('2020', 0.1, new THREE.Vector3(0, -1.3, 0),1);
        this.load3DText('2021', 0.1, new THREE.Vector3(0.25, -1.3, 0),1);
        this.load3DText('2022', 0.1, new THREE.Vector3(0.5, -1.3, 0),1);
        this.load3DText('2023', 0.1, new THREE.Vector3(0.75, -1.3, 0),1);
        this.load3DText('2024', 0.1, new THREE.Vector3(1, -1.3, 0),1);


        this.resources.on('ready', () =>
        {

            // console.log(this.Iphone.position);

            
               
            
  
        })
    
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
        this.active = true
        this.time = this.experience.time
        this.sceneStartTime = window.performance.now();

        this.camera.position.set(0,2,14);
        this.camera.lookAt(0,2,0);
        this.controls = new OrbitControls(this.camera, document.querySelector('canvas'));
        this.controls.enableDamping = true;

        this.setupEventListeners();
        this.switchButton = document.getElementById('switch-scene-btn');
        if (this.switchButton) {
          this.onSwitchSceneClick = () => window.experience.switchScene();
          this.switchButton.addEventListener('click', this.onSwitchSceneClick);
        }


        this.setLight();
        // this.setupDebug();
        this.fontLoader = new FontLoader()
        
        this.createSceneObjects();
        this.loadSounds();

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
        const elapsedTime = (window.performance.now() - this.sceneStartTime) / 1000;

        if (elapsedTime - this.lastChangeTime > this.changeInterval) {
            this.sunLight.intensity = Math.random() +0.3;
            // this.sunLight.intensity = 5;
            this.lastChangeTime = elapsedTime;
        }


            if(this.points){
                for(const point of this.points)
                {
                    const screenPosition = point.position.clone()
                    // console.log("Point position (world):", point.position);
                    // console.log("Point position (projected):", screenPosition);
                    screenPosition.project(this.camera)
                    if(elapsedTime >1){
                        point.element.classList.add('visible')
                    }


                    const translateX = Math.round(screenPosition.x * this.experience.sizes.width * 0.5);
                    const translateY = Math.round(-screenPosition.y * this.experience.sizes.height * 0.5);


                    const targetX = -screenPosition.x * this.experience.sizes.width * 0.5;
                    const targetY = screenPosition.y * this.experience.sizes.height * 0.5;

                    // Si vous n'avez pas de position précédente, initialisez-la
                    if (!point.prevTranslateX) {
                        point.prevTranslateX = targetX;
                        point.prevTranslateY = targetY;
                    }

                    // Interpolation pour lisser le mouvement
                    const smoothFactor = 0.05; // Ajustez ce facteur pour contrôler la fluidité
                    point.prevTranslateX += (targetX - point.prevTranslateX) * smoothFactor;
                    point.prevTranslateY += (targetY - point.prevTranslateY) * smoothFactor;

                    // // Appliquez les positions lissées
                    point.element.style.transform = `translateX(${point.prevTranslateX}px) translateY(${point.prevTranslateY}px)`;

                    
                }

            
            }

        this.controls.update();
  }


    destroy() {

        if (this.switchButton && this.onSwitchSceneClick) {
            this.switchButton.removeEventListener('click', this.onSwitchSceneClick)
        }
        if (this.onSceneClick){
            document.removeEventListener('click',this.onSceneClick)
        }

        this.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                child.geometry = null;

                for (const key in child.material) {
                    const value = child.material[key];
                    if (value && typeof value.dispose === 'function') {
                        value.dispose();
                    }
                    child.material[key] = null;
                }
            }
            // if (child instanceof THREE.Group) {
            //     // Nettoyer les enfants du Group
            //     console.log('Cleaning Group:', child.name);
            //     child.children.length = 0; // Supprime les sous-enfants
            //     this.scene.remove(child); // Retire le groupe de la scène
            //     // child.parent = null; // Supprime toute référence parentale
            // }
        });
        if (this.controls) {
            this.controls.dispose();
            this.controls = null;
        }
        
        if (this.videodata) {
            this.video = null;
            this.videodata.pause();
            this.videodata.src = "";
            this.videodata.load();
            this.videodata = null;
        }
       

        if (this.raycaster) {
            this.scene.remove(this.raycaster);
            this.raycaster = null;
        }
        
        if (this.light && this.sunLight) {
            this.scene.remove(this.light);
            this.light.dispose();
            this.light = null;
            this.scene.remove(this.sunLight);
            this.sunLight.dispose();
            this.sunLight = null;
        }

        // this.scene.remove(this.Iphone);
        // this.scene.remove(this.heartGroup);
        // this.scene.remove(this.PhoneScreen);
        // this.scene.remove(this.TikTokLogo);
        // this.scene.remove(this.Heart);
        // this.scene.remove(this.text);

        // this.Iphone = null;
        // this.heartGroup = null;
        // this.PhoneScreen = null;
        // this.TikTokLogo = null;
        // this.Heart = null;
        // this.text=null;
        // this.material = null;
        // this.testMaterial = null;
        // console.log(this.testMaterial);


        this.hidePoints();
        this.points = null;

        this.active = false;
        this.fontLoader = null;
        this.textGeometry.dispose();
        this.textGeometry = null;
        this.camera = null;

        console.log('Scene children count:', this.scene.children);

        this.scene.clear();
        console.log('Scene children count:', this.scene.children);

        console.log("Scene1 destroyed");
    }

}
