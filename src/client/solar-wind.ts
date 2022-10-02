import * as THREE from "three";


export class SolarWind {
    scene: THREE.Scene;
    model:THREE.Object3D;

    constructor(scene: THREE.Scene){
       
        this.scene = scene;
        this.model = new THREE.Object3D();
      
    
    }

    init(){
        const sphereGeom =  new THREE.SphereGeometry( 480, 384, 184 );
        const blueMaterial = new THREE.MeshBasicMaterial( { color: 0x0000ff, transparent: true, opacity: 1 } );
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