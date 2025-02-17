import * as THREE from 'three'

import Debug from './Utils/Debug.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'

import sources from './sources.js'

import Scene1 from '../scenes/scene1.js';
import Scene3 from '../scenes/scene3.js';
import Scene4 from '../scenes/scene4.js';
import Scene5 from '../scenes/scene5.js';
import Scene6 from '../scenes/scene6.js';
import Scene7 from '../scenes/scene7.js';
import Scene9 from '../scenes/scene9.js';
import Scene11 from '../scenes/scene11.js';





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
            // new Scene3(), 
            // new Scene4(),
            // new Scene5(),
            // new Scene6(),
            new Scene7(),
            new Scene9(),
            new Scene11()
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
        // this.prevScene = this.scene;
        this.scene.destroy();
        this.currentSceneIndex = (this.currentSceneIndex + 1)% this.scenes.length;
        this.scene = this.scenes[this.currentSceneIndex];
        this.scene.activate();
        // this.prevScene.destroy();
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



