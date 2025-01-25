import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import shadingVertexShader from '../shaders/shading/vertex.glsl'
import shadingFragmentShader from '../shaders/shading/fragment.glsl'

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'


export default class Scene4 {
  constructor() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    this.active = false;

   
    // this.setupDebug();
  }

  activate() {
    this.active = true;
    console.log("Scene2 activated");
    this.camera.position.set(2.8, 1.5, 6);
    this.controls = new OrbitControls(this.camera, document.querySelector('canvas'));
    this.controls.enableDamping = true; 
    this.molecule = new THREE.Group();

    this.moleculeGroup = new THREE.Group();
    this.fontLoader = new FontLoader()
    this.createSceneObjects();
    this.setupEventListeners();
            
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.setLight();
    
    this.switchButton = document.getElementById('switch-scene-btn');
    if (this.switchButton) {
      this.onSwitchSceneClick = () => window.experience.switchScene();
      this.switchButton.addEventListener('click', this.onSwitchSceneClick);
    }

  }

  deactivate() {
    this.active = false;
    console.log("Scene2 deactivated");
  }


  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  setupEventListeners() {
    this.onClick = this.onClick.bind(this);
    window.addEventListener('click', this.onClick);
  }

  setLight(){
    this.light = new THREE.DirectionalLight('#ffffff', 5);
    this.light.position.set(0, 3, 10);
    this.light.lookAt(0,0,0)
    this.light.intensity= 8;
    this.scene.add(this.light);

    this.light2 = new THREE.AmbientLight('#ffffff', 100);
    // this.light2.position.set(1, 2, -1);
    // this.light2.lookAt(0,0,0)
    this.light2.intensity= 4;
    this.scene.add(this.light2);

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

  createSceneObjects() {
    const geometry = new THREE.SphereGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });

    const materialParameters = { color: '#00000' }
    // this.material = new THREE.ShaderMaterial({
    //     vertexShader: shadingVertexShader,
    //     fragmentShader: shadingFragmentShader,
    //     uniforms: {
    //         uColor: new THREE.Uniform(new THREE.Color(materialParameters.color)),
    //     },
    // });  
    // this.sphere = new THREE.Mesh(geometry, material);
    // this.scene.add(this.sphere);
    //les 3" du haut

    this.scene.add(this.moleculeGroup);
    
    this.atom1 = this.createAtom(new THREE.Vector3(-0.6, 0, 0),0.2);
    this.atom2 = this.createAtom(new THREE.Vector3(0.6, 0, 0),0.2);
    this.atom3 = this.createAtom(new THREE.Vector3(0, 0.4, 0),0.2);

    this.atom4 = this.createAtom(new THREE.Vector3(0.6, -0.7, 0),0.2);
    this.atom5 = this.createAtom(new THREE.Vector3(-0.6, -0.7, 0),0.2);
    this.atom6 = this.createAtom(new THREE.Vector3(0, -1.1, 0),0.2);

    this.atom7 = this.createAtom(new THREE.Vector3(0, 0.9, 0),0.1);


    this.atom8 = this.createAtom(new THREE.Vector3(-1.3, 0.4, 0),0.15);
    this.atom9 = this.createAtom(new THREE.Vector3(-1.1, 0.9, 0),0.1);

    this.atom10 = this.createAtom(new THREE.Vector3(-1.4, -1, 0),0.15);
    this.atom11 = this.createAtom(new THREE.Vector3(-2, -0.6, 0),0.1)


    this.atom12 = this.createAtom(new THREE.Vector3(0, -1.6, 0),0.1);
    this.atom13 = this.createAtom(new THREE.Vector3(1.1, -0.9, 0),0.1);

    this.atom14 = this.createAtom(new THREE.Vector3(1.3, 0.1, 0),0.2);
    this.atom15 = this.createAtom(new THREE.Vector3(1.8, 0.1, -0.5),0.2);
    this.atom16 = this.createAtom(new THREE.Vector3(2.5, 0.1, -0.5),0.15);

    this.atom17 = this.createAtom(new THREE.Vector3(1.5, 0.5, 0.4),0.1);
    this.atom18 = this.createAtom(new THREE.Vector3(1.5, -0.3, 0.4),0.1);

    this.atom19 = this.createAtom(new THREE.Vector3(1.8, 0.5, -0.8),0.1);
    this.atom20 = this.createAtom(new THREE.Vector3(1.8, -0.3, -0.8),0.1);

    this.atom21 = this.createAtom(new THREE.Vector3(2.6, 0.4, -0.1),0.1);
    this.atom22 = this.createAtom(new THREE.Vector3(2.6, -0.2, -0.1),0.1);

    this.load3DText('D o p a m i n', 0.3, new THREE.Vector3(0.2, 1.7, 0));
    this.load3DText('C a', 0.1, new THREE.Vector3(-0.6, 0.3, 0));
    this.load3DText('C a', 0.1, new THREE.Vector3(0.6, 0.3, 0));
    this.load3DText('C a', 0.1, new THREE.Vector3(0.2, 0.6, 0));
    this.load3DText('C a', 0.1, new THREE.Vector3(0.6, -1, 0));
    this.load3DText('C a', 0.1, new THREE.Vector3(-0.6, -1, 0));
    this.load3DText('C a', 0.1, new THREE.Vector3(0, -0.7, 0));

    this.load3DText('H', 0.1, new THREE.Vector3(0, 1.1, 0));

    this.load3DText('O', 0.1, new THREE.Vector3(-1.4, 0.6, 0));
    this.load3DText('H', 0.1, new THREE.Vector3(-1.1, 1.1, 0));

    this.load3DText('O', 0.1, new THREE.Vector3(-1.4, -0.8, 0));
    this.load3DText('H', 0.1, new THREE.Vector3(-2, -0.4, 0));

    this.load3DText('H', 0.1, new THREE.Vector3(0, -1.8, 0));

    this.load3DText('H', 0.1, new THREE.Vector3(1.1, -1.1, 0));

    this.load3DText('C a', 0.1, new THREE.Vector3(1.3, 0.5, 0));
    this.load3DText('C a', 0.1, new THREE.Vector3(1.8, 0.4, -0.5));

    this.load3DText('Na', 0.1, new THREE.Vector3(2.5, 0.4, -0.5));

    this.load3DText('H', 0.1, new THREE.Vector3(1.5, 0.65, 0.4));
    this.load3DText('H', 0.1, new THREE.Vector3(1.5, -0.55, 0.4));

    this.load3DText('H', 0.1, new THREE.Vector3(1.8, 0.7, -0.8));
    this.load3DText('H', 0.1, new THREE.Vector3(1.8, -0.1, -0.8));

    this.load3DText('H', 0.1, new THREE.Vector3(2.6, 0.6, -0.1));
    this.load3DText('H', 0.1, new THREE.Vector3(2.6, 0, -0.1));







    // Créer le filament reliant les deux sphères
    this.filament1 = this.createFilament(this.atom1.position, this.atom3.position);
    this.filament2 = this.createFilament(this.atom2.position, this.atom3.position);
    this.filament3 = this.createFilament(this.atom2.position, this.atom4.position);
    this.filament4 = this.createFilament(this.atom5.position, this.atom6.position);
    this.filament5 = this.createFilament(this.atom6.position, this.atom4.position);
    this.filament6 = this.createFilament(this.atom1.position, this.atom5.position);

    this.filament7 = this.createFilament(this.atom3.position, this.atom7.position);


    this.filament8 = this.createFilament(this.atom5.position, this.atom10.position);
    this.filament9 = this.createFilament(this.atom10.position, this.atom11.position);

    this.filament10 = this.createFilament(this.atom1.position, this.atom8.position);
    this.filament11 = this.createFilament(this.atom8.position, this.atom9.position);

    this.filament12 = this.createFilament(this.atom6.position, this.atom12.position);
    this.filament13 = this.createFilament(this.atom4.position, this.atom13.position);

    this.filament14 = this.createFilament(this.atom2.position, this.atom14.position);
    this.filament15 = this.createFilament(this.atom14.position, this.atom18.position);
    this.filament16 = this.createFilament(this.atom14.position, this.atom17.position);

    this.filament17 = this.createFilament(this.atom14.position, this.atom15.position);
    this.filament18 = this.createFilament(this.atom15.position, this.atom16.position);

    this.filament19 = this.createFilament(this.atom15.position, this.atom19.position);
    this.filament20 = this.createFilament(this.atom15.position, this.atom20.position);

    this.filament21 = this.createFilament(this.atom16.position, this.atom21.position);
    this.filament22 = this.createFilament(this.atom16.position, this.atom22.position);

    this.scene.add(this.molecule);
  }

  createAtom(position, size) {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const atom = new THREE.Mesh(geometry, material);

    atom.position.copy(position);
    // this.scene.add(atom);
    this.molecule.add(atom);

    return atom;
}

  createFilament(position1, position2) {
    const geometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const filament = new THREE.Mesh(geometry, material);

    this.updateFilament(filament, position1, position2);
    // this.scene.add(filament);
    this.molecule.add(filament);

    return filament;
  }

  updateFilament(filament, position1, position2) {
    // const distance = position1.distanceTo(position2);

    // // Ajuster la position et l'orientation du filament
    // filament.position.copy(position1).lerp(position2, 0.5);
    // filament.lookAt(position2);
    // filament.scale.set(1, distance-0.5, 1); // Ajuste la longueur


    const distance = position1.distanceTo(position2);

    // Ajuster la position pour être entre les deux atomes
    filament.position.copy(position1).lerp(position2, 0.5);

    // Calculer la direction du filament et appliquer une rotation
    const direction = new THREE.Vector3().subVectors(position2, position1).normalize();
    const axis = new THREE.Vector3(0, 1, 0); // Axe Y par défaut pour un cylindre
    const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction);

    filament.setRotationFromQuaternion(quaternion);

    // Ajuster la longueur du filament
    filament.scale.set(1, distance, 1); // Divisé par 2 car le cylindre est centré
  }

  createRewardLight(position) {
    // Crée une lumière ponctuelle avec une faible intensité initiale
    const rewardLight = new THREE.PointLight(0xffaa00, 1, 2); 
    rewardLight.position.copy(position);
    rewardLight.intensity = 0; // Intensité initiale nulle
    this.scene.add(rewardLight);

    // Animation pour augmenter puis diminuer l'intensité
    const duration = 500;  // Durée de l'animation en millisecondes
    const startTime = performance.now();

    const animateLight = (time) => {
        const elapsedTime = time - startTime;
        const progress = elapsedTime / duration;

        if (progress <= 1) {
            // Animation de montée et descente de l'intensité
            rewardLight.intensity = Math.sin(progress * Math.PI)*10; 
            requestAnimationFrame(animateLight);
        } else {
            // Supprimer la lumière une fois l'animation terminée
            this.scene.remove(rewardLight);
        }
    };

    requestAnimationFrame(animateLight);
  }

  newMolecule(){
    this.new = this.molecule.clone();
    const variation = Math.random()/2;
    this.new.scale.set(0.5*variation, 0.5*variation, 0.5*variation);
    this.new.rotation.y = Math.random() * Math.PI * 2;
    this.new.position.set(
        (Math.random() * 4) - 2,  // Génère une valeur entre -2 et 2
        (Math.random() * 4) - 2,
        (Math.random() * 4) - 2
    );
    // this.scene.add(this.new);
    this.moleculeGroup.add(this.new);
    this.createRewardLight(this.new.position);
  }

  onClick(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    console.log('clic');
    if(this.raycaster){
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObject(this.molecule);
      if (intersects.length > 0) {
        this.newMolecule();
      }
    }
  }

  updateMolecules(time) {
    this.moleculeGroup.children.slice().forEach((molecule, index) => {
      if (molecule instanceof THREE.Group) {
          // Mise à jour de la position du groupe entier (déplace toute la molécule)
          molecule.position.x += Math.sin(time + index) * 0.01;
          molecule.position.y += 0.01;

          // Vérification si la molécule doit être supprimée
          if (molecule.position.y > 5) {
              this.moleculeGroup.remove(molecule);
              this.scene.remove(molecule);
          }

          // Mise à jour des positions internes des atomes/filaments si nécessaire
          molecule.children.forEach((child) => {
              if (child instanceof THREE.Mesh) {
                  child.position.x += Math.sin(time + index) * 0.005; // Petite oscillation
              }
          });
      }
    });
  }


  update() {
    if (!this.active) return;

    const time = performance.now() * 0.001;
    const radius = 10; 
    this.updateMolecules(time);

    this.atom1.position.y = Math.sin(time) * 0.05;
    this.atom2.position.y = Math.cos(time) * 0.05;
    this.atom3.position.y += Math.sin(time+1) * 0.0005;
    this.atom4.position.y += Math.sin(time) * 0.0004;
    this.atom5.position.y += Math.cos(time) * 0.0005;
    this.atom6.position.y += Math.sin(time) * 0.0006;


    this.atom7.position.y += Math.sin(time) * 0.0004;
    this.atom8.position.y += Math.cos(time) * 0.0005;
    this.atom9.position.y += Math.sin(time+1) * 0.0006;
    this.atom10.position.y += Math.sin(time) * 0.0004;
    this.atom11.position.y += Math.cos(time) * 0.0005;
    this.atom12.position.y += Math.sin(time) * 0.0006;
    this.atom13.position.y += Math.sin(time) * 0.0004;

    this.atom14.position.y += Math.cos(time) * 0.0006;
    this.atom15.position.y += Math.sin(time) * 0.0004;
    this.atom16.position.y += Math.cos(time) * 0.0005;
    this.atom17.position.y += Math.sin(time) * 0.0005;
    this.atom18.position.y += Math.cos(time) * 0.0006;
    this.atom19.position.y += Math.sin(time) * 0.0005;
    this.atom20.position.y += Math.cos(time) * 0.0006;
    this.atom21.position.y += Math.sin(time) * 0.0004;

    this.updateFilament(this.filament1, this.atom1.position, this.atom3.position);
    this.updateFilament(this.filament2, this.atom2.position, this.atom3.position);
    this.updateFilament(this.filament3, this.atom2.position, this.atom4.position);
    this.updateFilament(this.filament4, this.atom5.position, this.atom6.position);
    this.updateFilament(this.filament5, this.atom6.position, this.atom4.position);
    this.updateFilament(this.filament6, this.atom1.position, this.atom5.position);
    this.updateFilament(this.filament7, this.atom3.position, this.atom7.position);
    this.updateFilament(this.filament8, this.atom5.position, this.atom10.position);
    this.updateFilament(this.filament9, this.atom10.position, this.atom11.position);
    this.updateFilament(this.filament10, this.atom1.position, this.atom8.position);
    this.updateFilament(this.filament11, this.atom8.position, this.atom9.position);
    this.updateFilament(this.filament12, this.atom6.position, this.atom12.position);
    this.updateFilament(this.filament13, this.atom4.position, this.atom13.position);
    this.updateFilament(this.filament14, this.atom2.position, this.atom14.position);
    this.updateFilament(this.filament15, this.atom14.position, this.atom18.position);
    this.updateFilament(this.filament16, this.atom14.position, this.atom17.position);
    this.updateFilament(this.filament17, this.atom14.position, this.atom15.position);
    this.updateFilament(this.filament18, this.atom15.position, this.atom16.position);
    this.updateFilament(this.filament19, this.atom15.position, this.atom19.position);
    this.updateFilament(this.filament20, this.atom15.position, this.atom20.position);
    this.updateFilament(this.filament21, this.atom16.position, this.atom21.position);
    this.updateFilament(this.filament22, this.atom16.position, this.atom22.position);
  }

  destroy() {
    //a faire : melanger destroy et desactive
    if (this.switchButton && this.onSwitchSceneClick) {
      this.switchButton.removeEventListener('click', this.onSwitchSceneClick);
    }
    window.removeEventListener('click', this.onClick);

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
      this.controls=null;
    }
    while (this.scene.children.length > 0) {
        const child = this.scene.children[0];
        this.scene.remove(child);
    }
    this.raycaster = null;
    this.active = false;
    this.camera=null;
    
    this.scene.clear();
    console.log("Scene4 destroyed");
  }
}
