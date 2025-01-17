import * as THREE from 'three'

import Debug from './Utils/Debug.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'

import sources from './sources.js'

import Scene1 from '../scenes/scene1';
import Scene2 from '../scenes/scene2';
import Scene3 from '../scenes/scene3.js';

let instance = null


export default class Experience
{
    constructor(_canvas)
    {
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
        
        // Global access
        window.experience = this

        // Options
        this.canvas = _canvas

        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.resources = new Resources(sources)
        this.resources.on('ready', () => {
            console.log("Toutes les ressources sont prêtes !");
        });
        // this.world = new World()

        // Scenes setup
        this.currentSceneIndex = 0;
        this.scenes = [
            new Scene1(),
            new Scene2(), 
            new Scene3()
        ];  
        this.scene = this.scenes[this.currentSceneIndex];
        this.scene.activate();
        this.camera = this.getActiveCamera()
        this.renderer = new Renderer()

        
        console.log(this.scene);

        // Resize event
        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () =>
        {
            this.update()
        })
    }

    resize()
    {
        // const activeCamera = this.getActiveCamera();
        // if (activeCamera) {
        //     activeCamera.resize();
        // }
        // this.sizes.resize()
        this.scene.resize()
        this.renderer.resize()
    }


    switchScene() {
        // this.scene.deactivate();
        this.scene.destroy();
        this.currentSceneIndex = (this.currentSceneIndex + 1)% this.scenes.length;
        this.scene = this.scenes[this.currentSceneIndex];
        this.scene.activate();
        console.log(this.currentSceneIndex);
        this.resize()
    }
    

    getActiveScene() {
        // console.log(this.scene)
        return this.scenes[this.currentSceneIndex]?.scene;
        // return this.scene;
    }
    
    getActiveCamera() {
        // console.log(this.scenes[this.currentSceneIndex]?.camera)
        return this.scenes[this.currentSceneIndex]?.camera;
        // return this.getActiveScene().camera;
    }

    update()
    {
        this.scene.update()
        this.renderer.update()
    }

    

    destroy()
    {
        this.sizes.off('resize')
        this.time.off('tick')

        // Traverse the whole scene
        this.scene.traverse((child) =>
        {
            // Test if it's a mesh
            if(child instanceof THREE.Mesh)
            {
                child.geometry.dispose()

                // Loop through the material properties
                for(const key in child.material)
                {
                    const value = child.material[key]

                    // Test if there is a dispose function
                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })

        // this.camera.controls.dispose()
        this.renderer.instance.dispose()

        if(this.debug.active)
            this.debug.ui.destroy()
    }
    
}



