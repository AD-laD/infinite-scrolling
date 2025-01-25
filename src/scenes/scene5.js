import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import shadingVertexShader from '../shaders/shading/vertex.glsl'
import shadingFragmentShader from '../shaders/shading/fragment.glsl'
import Experience from '../Experience/Experience.js'
import ObjectModel3D from '../Experience/World/ObjectModel3D.js'
import Sound from '../Experience/World/Sound.js'
import { gsap } from "gsap";

export default class Scene5 {
  constructor() {
    this.scene = new THREE.Scene();
    console.log("Scene 1");
    // Caméra spécifique à cette scène
    // this.camera = new THREE.PerspectiveCamera(
    //   75,
    //   window.innerWidth / window.innerHeight,
    //   0.1,
    //   1000
    // );
    const frustumSize = 1.5;
    const aspectRatio = window.innerWidth / window.innerHeight;
    this.camera = new THREE.OrthographicCamera(
      -frustumSize * aspectRatio / 2, // left
      frustumSize * aspectRatio / 2,  // right
      frustumSize / 2,                // top
      -frustumSize / 2,               // bottom
      0.1,                            // near
      100                             // far
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
    // this.camera.position.set(0.1, 0.3, 1);
    this.camera.position.set(1.5, 1.5, 1.5);
    this.camera.lookAt(0,0,0)
    this.controls = new OrbitControls(this.camera, document.querySelector('canvas'));
    this.controls.enableZoom = true; 
    this.controls.enablePan = false;
    this.controls.enableRotate = false;
    // this.controls.minPolarAngle = Math.PI / 4; 
    // this.controls.maxPolarAngle = Math.PI / 2; 
    this.controls.target.set(0, 0, 0); // Place le point cible au centre de l'objet
    this.controls.update();
    this.controls.enableDamping = true; // Active le lissage des contrôles
    this.mouse = new THREE.Vector2();


    this.tanFOV = Math.tan( ( ( Math.PI / 180 ) * this.camera.fov / 2 ) );
    console.log(this.camera.fov)
    this.windowHeight = window.innerHeight;
    
    this.createSceneObjects();
    this.loadSounds();
    this.switchButton = document.getElementById('switch-scene-btn');
    if (this.switchButton) {
      this.onSwitchSceneClick = () => window.experience.switchScene();
      this.switchButton.addEventListener('click', this.onSwitchSceneClick);
    }
  
  }

  htmlPoints(){
    this.points = [
      {
        position: new THREE.Vector3(-0.1, 0.1, 0),
        element: document.querySelector('#slot-body')
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

  createSphere(radius, widthSegments, heightSegments, position) {
   
  }

  setLight(){
    // this.sunLight = new THREE.DirectionalLight('#ffffff', 10)
    // this.sunLight.castShadow = true
    // this.sunLight.shadow.camera.far = 15
    // this.sunLight.shadow.mapSize.set(1024, 1024)
    // this.sunLight.shadow.normalBias = 0.05
    // this.sunLight.position.set(3.5, 2, 3.5)
    // this.scene.add(this.sunLight)

    // this.sunLight = new THREE.DirectionalLight('#ffffff', 100)
    // this.sunLight.castShadow = true
    // this.sunLight.shadow.camera.far = 15
    // this.sunLight.shadow.mapSize.set(1024, 1024)
    // this.sunLight.shadow.normalBias = 0.05
    // this.sunLight.position.set(0, 1, 3.5)
    // this.scene.add(this.sunLight)

    // const light = new THREE.AmbientLight('#ffffff', 1.5);
    // light.position.set(1, 1, 1).normalize();
    // light.lookAt(0,0,0)
    // light.intensity= 5;
    // this.scene.add(light);
    
    const light = new THREE.SpotLight('#ffffff', 30);
    light.position.set(1, 1, -0.5).normalize();
    light.castShadow = true
    light.shadow.mapSize.width = 1024;  
    light.shadow.mapSize.height = 1024; 
    light.shadow.camera.near = 0.5;     
    light.shadow.camera.far = 50;
    light.lookAt(0,0,0)
    // light.intensity= 5;
    this.scene.add(light);


  }

  createSlotMachineBar() {
    const cylinderGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.15, 32);
    const cylinder = new THREE.Mesh(cylinderGeometry, this.material);
    cylinder.position.set(0, 0.075, 0); 

    // 2. Création de la sphère (bouton)
    const sphereGeometry = new THREE.SphereGeometry(0.02, 32, 32);
    const sphere = new THREE.Mesh(sphereGeometry, this.material);
    sphere.position.set(0, 0.15, 0); 

    // 3. Groupe pour réunir les deux parties
    this.barGroup = new THREE.Group();
    this.barGroup.add(cylinder)
    this.barGroup.add(sphere)
    this.scene.add(this.barGroup)

    return this.barGroup;
  }

  

  createSceneObjects() {
    this.htmlPoints();
    this.setLight();
    this.createSlotMachineBar()
    this.raycaster = new THREE.Raycaster()
      this.light = new THREE.DirectionalLight('#ffffff', 5);
      this.light.position.set(0, -1, 3.5);
      this.light.lookAt(0,0,0)
      this.light.intensity= 40;
      this.light.castShadow = true;
      this.scene.add(this.light);
      this.slotMachine = new ObjectModel3D('slot', { x: 1, y: 1, z: 1 }, this.scene)
      this.slotMachine.castShadow = true;
    this.barGroup.position.set(0.27,-0.2,-0.04)
    this.barGroup.rotateX(Math.PI/6);
    this.onClick = this.onClick.bind(this);
    window.addEventListener('click', this.onClick);
    const planeGeometry = new THREE.PlaneGeometry(10,10,2,2);
    const material = new THREE.MeshStandardMaterial({ color: 0x555555, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, material);
    plane.position.set(0,-0.5,0);
    plane.rotateX(Math.PI/2);
    this.scene.add(plane);
    plane.receiveShadow = true;
    
  }

  onClick(event) {    
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObject(this.barGroup);
    if (intersects.length > 0) {
      this.rotateBar();
    }
   
  }

  rotateBar() {
    gsap.to(this.barGroup.rotation, {
        x: Math.PI / 2, // Rotation de 90 degrés sur l'axe X
        duration: 0.5, // Durée de l'animation
        ease: "power2.out", // EaseOut pour une transition fluide
        onComplete: () => {
            gsap.to(this.barGroup.rotation, {
                x: Math.PI/6, // Retour à la position initiale
                duration: 1,
                ease: "power2.out",
            });

            if (typeof window.spin === "function") {
              window.spin();
            } else {
                console.error("La fonction spin n'est pas définie ou accessible !");
            }
        },
    });
  }
  

  resize() {
    //resize orthographic camera without dezooming in the scene
    const innerWidth = window.innerWidth/450;
    const innerHeight= window.innerHeight/450;
    this.camera.left = -innerWidth/2;
    this.camera.right = innerWidth/2;
		this.camera.top = innerHeight/2;
		this.camera.bottom = -innerHeight/2;
    this.camera.updateProjectionMatrix();
  }


  update() {
    if (!this.active) return;
    const elapsedTime = (window.performance.now() - this.sceneStartTime) / 1000;
    const radius = 10; 

    // this.light.position.x = radius * Math.cos(elapsedTime);
    // this.light.position.z = radius * Math.sin(elapsedTime);
    
    if(this.points && this.slotMachine){
      for(const point of this.points)
      {
        const screenPosition = point.position.clone()
        screenPosition.project(this.camera)
          point.element.classList.add('visible')
  

        const translateX = screenPosition.x * this.experience.sizes.width * 0.5
        const translateY = -screenPosition.y * this.experience.sizes.height * 0.5
        // point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
        const targetX = screenPosition.x * this.experience.sizes.width * 0.5;
        const targetY = -screenPosition.y * this.experience.sizes.height * 0.5;

        if (!point.prevTranslateX) {
            point.prevTranslateX = targetX;
            point.prevTranslateY = targetY;
        }

        const relativeCameraPosition = new THREE.Vector3();
        relativeCameraPosition.copy(this.camera.position).sub(this.slotMachine.model.position);

        const lookAtMatrix = new THREE.Matrix4();
        lookAtMatrix.lookAt(this.camera.position, this.slotMachine.model.position, new THREE.Vector3(0, 1, 0));
        const lookAtQuaternion = new THREE.Quaternion();
        lookAtQuaternion.setFromRotationMatrix(lookAtMatrix);

        const rotation = new THREE.Euler().setFromQuaternion(lookAtQuaternion, 'XYZ');
        const rotationX = THREE.MathUtils.radToDeg(rotation.x); // Convertir en degrés
        const rotationY = THREE.MathUtils.radToDeg(rotation.y); // Convertir en degrés

        const smoothFactor = 0.05; // Ajustez ce facteur pour contrôler la fluidité
        point.prevTranslateX += (targetX - point.prevTranslateX) * smoothFactor;
        point.prevTranslateY += (targetY - point.prevTranslateY) * smoothFactor;


        const zoom = this.camera.zoom.valueOf();
        

        // Les valeurs de base de l'échelle
        const baseScaleX = 0.8;
        const baseScaleY = 0.9;

        // Calcul de l'échelle en fonction de la distance (ajustement de la caméra)
        const scaleFactor = Math.max(0.5, 1 / (1/zoom));

        // Calcul de la nouvelle échelle pour l'élément
        const scaleX = baseScaleX * zoom;
        const scaleY = baseScaleY * zoom;


        // Appliquez les positions lissées
        point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px) rotateX(${rotationX}deg)rotateY(${-rotationY-5}deg) scale(${scaleX},${scaleY})`;
          
      }

    }

    
  }

  destroy() {

    if (this.switchButton && this.onSwitchSceneClick) {
      this.switchButton.removeEventListener('click', this.onSwitchSceneClick);
      this.onSwitchSceneClick = null;
    }
    window.removeEventListener('click', this.onClick);
  
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
  
    console.log("Scene3 destroyed");

  }
}
