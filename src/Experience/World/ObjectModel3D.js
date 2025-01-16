import * as THREE from 'three'
import Experience from '../Experience.js'

export default class ObjectModel3D
{
    constructor(modelName, scale = { x: 1, y: 1, z: 1 }, scene)
    {
        this.experience = new Experience()
        this.scene = scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder(modelName)
        }

        // Récupérer la ressource selon le nom
        // this.resource = this.resources['iphone'];
        // this.resource = this.resources.sources.find(resource => resource.name === 'foxModel');
        this.resource = this.resources.items[modelName];
        console.log(this.resources.sources)
        console.log("Available resource keys:", Object.keys(this.resources))

        if (this.resource) {
            this.setModel(scale)
            this.setAnimation()
        } 
        // else {
        //     console.error(`Resource ${modelName} not found!`)
        // }
    }

    setModel(scale)
    {
        // Charger le modèle 3D
        this.model = this.resource.scene
        this.model.scale.set(scale.x, scale.y, scale.z)
        this.scene.add(this.model)

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        })
    }

    addToScene(scene, material, position, scale, group){
        const newOne = this.model.clone();

        newOne.scale.set(scale, scale, scale);
        newOne.position.set(position.x, position.y, position.z);

        if (material) {
            newOne.traverse((child) => {
                if (child.isMesh) {
                    child.material = material;
                }
            });
        }
        scene.add(newOne);
        group.add(newOne);
        return group;
    }


    setAnimation()
    {
        // Implémenter l'animation si nécessaire
    }
}
