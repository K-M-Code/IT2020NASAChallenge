import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui';
import { ACESFilmicToneMapping, Color, DirectionalLight, Mesh, MeshPhongMaterial, MeshPhysicalMaterial, PCFSoftShadowMap, SphereGeometry, sRGBEncoding, TextureLoader } from "three";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';


const sunTexture = require("../img/8k_sun.jpg");
const milkWayTexture = require("../img/8k_stars_milky_way.jpg");
const airCraft = new URL("../img/aircraft.glb", import.meta.url);
const asteroidModelUrl = new URL("../img/Hyperion_1_1000.glb", import.meta.url);
const n = 1000;
const asteroidMax = 12;
const asteroidMin = 1;

const scene = new THREE.Scene();

//grid helper
// const size = 10000;
// const divisions = 100;
// const gridHelper = new THREE.GridHelper(size, divisions);
// scene.add(gridHelper);

//axis helper
// const axesHelper = new THREE.AxesHelper(1000);
// scene.add(axesHelper);

const viewSize = 900;
const aspectRatio = window.innerWidth / window.innerHeight;

//camera settings
/*const camera = new THREE.OrthographicCamera(
  (-aspectRatio * viewSize) / 2,
  (aspectRatio * viewSize) / 2,
  viewSize / 2,
  -viewSize / 2,
  -1000,
  1000
);
camera.position.set(10, 5, 10);
*/

const fov = 45;
const aspect = 2;  // the canvas default
const near = 0.1;
const far = 10000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

//is window is resized
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)

}

const stats = Stats()
document.body.appendChild(stats.dom)


const canvas = document.getElementById("c1") as HTMLCanvasElement;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = ACESFilmicToneMapping;
renderer.outputEncoding = sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;

const sunLight = new DirectionalLight(new Color("#FFFFFF"), 3.5);
sunLight.position.set(10,20,10);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 512;
sunLight.shadow.mapSize.height = 512;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 100;
sunLight.shadow.camera.left = -10;
sunLight.shadow.camera.bottom = -10;
sunLight.shadow.camera.top = 10;
sunLight.shadow.camera.right = 10;
scene.add(sunLight);

//This light globally illuminates all objects in the scene equally
const light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.add( light );

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0,0,0);
controls.dampingFactor = 0.05;
controls.enableDamping = true;


let model: /*unresolved*/ any;
//let a:any, a1 : any, a2 : any, a3 : any, a4: any, a5 : any;
let asteroid : any = [];
const gui = new GUI()

const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "x", -1000, 1000);
cameraFolder.add(camera.position, "y", -1000, 1000);
cameraFolder.add(camera.position, "z", -1000, 1000);


var orbitRadius = 200; // for example
const orbitAsteroids = 210;
const orbitAircraft = 250;


let date, dateAsteroid, dateAsteroid2;

function setupKeyControls(cube: any) {
  // var cube = scene.getObjectByName("cube");
  //changed to model "aircraft movement"
  document.onkeydown = function (e) {
    console.log(e);
    switch (e.keyCode) {
      case 37:
        if (model != null) model.position.z -= 1;
        break;
      case 38:
        if (model != null) model.position.y += 1;
        break;
      case 39:
        if (model != null) model.position.z += 1;
        break;
      case 40:
        if (model != null) model.position.y -= 1;
        break;
    }
  };
}

(async function () {

  let textureForSun = {
    map: await new TextureLoader().loadAsync(sunTexture)
  };

  const bgTexture = new TextureLoader().load(milkWayTexture);
  scene.background = bgTexture;

  let sphere = new Mesh(
    new SphereGeometry(100,700,700),
    new MeshPhysicalMaterial({
      map: textureForSun.map
    }),
  );
  sphere.scale.set(1,1,1);
  sphere.receiveShadow = true;
  scene.add(sphere);

  let sphere2 = new Mesh(
    new SphereGeometry(100,700,700),
    new MeshPhysicalMaterial({
      map: textureForSun.map
    }),
  );
  sphere2.scale.set(1.5,1.5,1.5);
  sphere2.receiveShadow = true;
  scene.add(sphere2);

  const assetLoader = new GLTFLoader();
  assetLoader.load(asteroidModelUrl.href, function(gltf){
    /*a = gltf.scene.children[0];
    a.scale.set(0.05,0.05,0.05);
    a.position.set(0 , 90, orbitAircraft);
    a1 = a.clone();
    a1.position.set(200 , 30, orbitAircraft);
    a2 = a.clone();
    a2.position.set(700 , 200, orbitAircraft-50);
    a3 = a.clone();
    a3.position.set(1200 , 55, orbitAircraft);
    a4 = a.clone();
    a4.position.set(1300 , 25, orbitAircraft);
    a5 = a.clone();
    a5.position.set(1400 , 35, orbitAircraft);

    scene.add(a, a1, a2 , a3, a4, a5);
    a.rotation.x += 1;
    a1.rotation.x +=1.5;
    a2.rotation.x +=.5;
    a3.rotation.x +=1.9;
    a4.rotation.x +=1.1;
    a5.rotation.x +=1.2;*/
    let a =  gltf.scene.children[0];
    a.scale.set(0.05,0.05,0.05);
    for( let i = 0; i<n ; i++){
      asteroid[i] =  a.clone();
      a.scale.set(randomIntFromInterval(asteroidMin,asteroidMax)/100,randomIntFromInterval(asteroidMin,asteroidMax)/100,randomIntFromInterval(asteroidMin,asteroidMax)/100);
      asteroid[i].position.set(randomIntFromInterval(50,700) , randomIntFromInterval(-500,500), orbitAircraft -randomIntFromInterval(-1000,1000));
      asteroid[i].rotation.x += randomIntFromInterval(-1,5);
      scene.add(asteroid[i]);
    }

  }, undefined, function(error){
    console.error(error);
  })

  
  function randomIntFromInterval(min : number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  assetLoader.load(airCraft.href, function(gltf){
    model = gltf.scene.children[0]; 
    sphere.add(model);
    model.position.set(0 , 25, orbitAircraft);
    model.scale.set(0.1,0.1,0.1);
    model.rotateY(-Math.PI/2);
  }, undefined, function(error){
    console.error(error);
  });
  camera.position.set(-250,40,orbitAircraft);

  //All settings before animation loop
  setupKeyControls(model);

  //ANIMATION LOOOOP
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
    controls.update();
    date = Date.now() * 0.001;
    dateAsteroid = Date.now() * 0.002;
    dateAsteroid2 = (Date.now() + 1000) * 0.002;
    
    sphere.rotateY(0.004);
    sphere2.rotateY(0.001);
    sphere.add(camera);
    camera.lookAt(sphere.position.x , sphere.position.y, sphere.position.z);
    camera.rotation.y = -1.7;
    stats.update();
  });
})();

