import * as THREE from "three";


export class SolarWind {
    scene: THREE.Scene;
    model:THREE.Object3D;

    constructor(scene: THREE.Scene){
       
        this.scene = scene;
        this.model = new THREE.Object3D();
        this.init();
    
    }

    init(){
        const sphereGeom =  new THREE.SphereGeometry( 100,700,700);
        const blueMaterial = new THREE.MeshBasicMaterial( { color: 0xFCE570, transparent: true, opacity: 0.5 } );
        this.model = new THREE.Mesh( sphereGeom, blueMaterial );
        this.scene.add(this.model);
    }
    

    setPosition(x:any, y:any, z:any){
        this.model.position.set(x,y,z);  
    }

    getModel() {
        return this.model;
    }
}