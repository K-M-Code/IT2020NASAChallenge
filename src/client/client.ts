import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from 'three/examples/jsm/libs/stats.module';
import { GUI } from 'dat.gui';
import { ACESFilmicToneMapping, Color, DirectionalLight, Mesh, MeshPhongMaterial, MeshPhysicalMaterial, PCFSoftShadowMap, SphereGeometry, sRGBEncoding, TextureLoader } from "three";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {SpaceShip} from './space-ship';
import {SolarWind} from './solar-wind';

const sunTexture = require("../img/8k_sun.jpg");
const milkWayTexture = require("../img/8k_stars_milky_way.jpg");
const asteroidModelUrl = new URL("../img/Hyperion_1_1000.glb", import.meta.url);
const airCraft = new URL("../img/aircraft.glb", import.meta.url);

const n = 100;
const asteroidMax = 12;
const asteroidMin = 1;

//fetching API for solar wind
fetch('https://api.auroras.live/v1/?type=ace&data=speed')
  .then((response) => response.json())
  .then((data) => representData(data));

const info = window.document.getElementById("info");

fetch('https://api.auroras.live/v1/?type=ace&data=kp')
  .then((response) => response.json())
  .then((data) => representData2(data));

  const representData = (data:any) => {
    if(info != null)
    info.innerHTML = info.innerHTML + "Solar wind speed: " + data.speed + " km/s <br/>";
  
  }  
  const representData2 = (data:any) => {
    if(info != null)
    info.innerHTML = info.innerHTML + "Index: " + data.kp + "<br/>";
  
  }  

const scene = new THREE.Scene();
const newSpaseShip = new SpaceShip(airCraft,scene);
newSpaseShip.init();

const wind = new SolarWind(scene);



scene.add(new THREE.AxesHelper(5))

const viewSize = 900;
const aspectRatio = window.innerWidth / window.innerHeight;

const fov = 45;
const aspect = 2;
const near = 0.1;
const far = 10000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

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


let asteroid : any = [];
const gui = new GUI()

const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "x", -1000, 1000);
cameraFolder.add(camera.position, "y", -1000, 1000);
cameraFolder.add(camera.position, "z", -1000, 1000);

const orbitAircraft = 250;

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

  newSpaseShip.setPosition(0 , 25, orbitAircraft);
  newSpaseShip.addShipToAnotherObject(sphere);

  camera.position.set(-250,40,orbitAircraft);

  let count = 1;
  renderer.setAnimationLoop(() => {

    newSpaseShip.keyPressHandler();
    
    renderer.render(scene, camera);
    controls.update();

    sphere.rotateY(0.004);
    sphere2.rotateY(0.001);
    sphere.add(camera);
    camera.lookAt(sphere.position.x , sphere.position.y, sphere.position.z);
    camera.rotation.y = -1.7;
    stats.update();
    wind.getModel().scale.set( wind.getModel().scale.x*count,wind.getModel().scale.y*count,wind.getModel().scale.z*count);
    count += 0.00003;
    if(count > 1.02) {
      count = 1;
      wind.getModel().scale.set(1,1,1);
    }
  });
})();
