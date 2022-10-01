import * as THREE from "three";
import {GLTF, GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';



export class SpaceShip {
    modelUrl:URL;
    model:THREE.Object3D;
    activeKeys: Set<number>;
    releasedKeys: Set<number>;

    constructor(url:URL){
        this.modelUrl = url;
        this.model = new THREE.Object3D();
        this.activeKeys = new Set();
        this.releasedKeys = new Set();

        document.onkeydown = (e) =>{
            this.activeKeys.add(e.keyCode); 
            this.releasedKeys.delete(e.keyCode);
        }

        document.onkeyup = (e) =>{
            this.activeKeys.delete(e.keyCode);
            this.releasedKeys.add(e.keyCode); 
        }

    }

    modelLoader(gltf:GLTF){
        this.model = gltf.scene.children[0]; 
        this.model.scale.set(0.1,0.1,0.1);
        this.model.rotateY(-Math.PI/2);

    }

    init(){
        const assetLoader = new GLTFLoader();
        assetLoader.load(this.modelUrl.href, (gltf) => {
            this.modelLoader(gltf);
          }, undefined, function(error){
            console.error(error);
          });
    }

    setPosition(x:any, y:any, z:any){
        this.model.position.set(x,y,z);
    }

    addShipToAnotherObject(obj:THREE.Object3D){
        obj.add(this.model);
    }

    keyPressHandler(){
        if(this.activeKeys.has(37)){
            this.model.position.z -= 4;
            this.model.rotation.z = -3;
        }
        if(this.releasedKeys.has(37)){
            this.model.rotation.z = 3;
        }
        if(this.activeKeys.has(38)){
            this.model.position.y += 4;
        }
        if(this.activeKeys.has(39)) {
            this.model.position.z += 4;
            this.model.rotation.z = 9;
        }
        if(this.activeKeys.has(40)){
            this.model.position.y -= 4;
        }
    }

    getModel() {
        return this.model;
    }
}