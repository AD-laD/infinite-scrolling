import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.canvas = this.experience.canvas



        this.setInstance()
        this.setControls()
    }

    getScene() {
        return this.experience.scene;
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(6, 4, 8)

        const scene = this.getScene();
        console.log(scene);
        if (scene) {
            console.log("ça marche");
            scene.add(this.instance);
        }
        // this.scene.add(this.instance)

    }

    

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update()
        if (!this.getScene().children.includes(this.instance)) {
            this.getScene().add(this.instance);
        }
    }
}