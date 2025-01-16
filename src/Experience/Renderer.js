import * as THREE from 'three'
import Experience from './Experience.js'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { DotScreenShader } from 'three/examples/jsm/shaders/DotScreenShader.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { MirrorShader } from 'three/examples/jsm/Addons.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
export default class Renderer
{
    constructor()
    {
        this.experience = new Experience()
        this.canvas = this.experience.canvas
        this.sizes = this.experience.sizes
        

        // if (!this.scene) {
        //     console.error('Scene is not defined in Renderer!');
        // }

        this.setInstance()
    }

    setInstance()
    {
        this.instance = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        })
        this.instance.toneMapping = THREE.CineonToneMapping
        this.instance.toneMappingExposure = 1.75
        this.instance.shadowMap.enabled = true
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        this.instance.setClearColor('#211d20')
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
        this.instance.scene = this.experience.getActiveScene()
        this.instance.camera = this.experience.getActiveCamera()

        this.instance.composer = new EffectComposer(this.instance);
        this.instance.composer.addPass(new RenderPass(this.instance.scene, this.instance.camera));

        this.addEffects();

    }

    addEffects(){
        const effect1 = new ShaderPass(DotScreenShader);
        effect1.uniforms['scale'].value = 0.02;
        this.instance.composer.addPass(effect1);

        const effect2 = new ShaderPass(RGBShiftShader);
        effect2.uniforms['amount'].value = 0.0017;
        this.instance.composer.addPass(effect2);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.2,  // Intensité
            0.05,  // Rayon
            0.02  // Seuil
        );
        this.instance.composer.addPass(bloomPass);

    }

    resize()
    {
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    updateComposer(scene, camera) {
        this.instance.composer.passes = [];
        this.instance.composer.addPass(new RenderPass(scene, camera));
        this.addEffects();
    }
    

    update()
    {
        // this.instance.render(this.scene, this.camera)

        const activeScene = this.experience.getActiveScene();
        const activeCamera = this.experience.getActiveCamera();
        

        if (activeScene && activeCamera) {
            this.instance.render(activeScene, activeCamera);
            // console.log(activeScene)
            // this.composer.render(activeScene.scene, activeCamera);
        }
        // if (activeScene){
        // }
        if (this.instance.scene !== activeScene || this.instance.camera !== activeCamera) {
            this.instance.scene = activeScene;
            this.instance.camera = activeCamera;
    
            this.updateComposer(activeScene, activeCamera);
        }
        this.instance.composer.render()

    }
}