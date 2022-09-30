import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
import { ACESFilmicToneMapping, Color, DirectionalLight, Mesh, MeshPhongMaterial, MeshPhysicalMaterial, PCFSoftShadowMap, SphereGeometry, sRGBEncoding, TextureLoader } from "three";


const sunTexture = require("../img/8k_sun.jpg");
const milkWayTexture = require("../img/8k_stars_milky_way.jpg");
const ship = require("../img/space_ship.obj");

const scene = new THREE.Scene();

let objLoader = new THREE.ObjectLoader();
//objLoader.setPath(assetsPath);
objLoader.load(ship, function(object){
  console.log("Inside object Loader");
  object.position.y -= 100;
  scene.add(object);
});


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
const camera = new THREE.OrthographicCamera(
  (-aspectRatio * viewSize) / 2,
  (aspectRatio * viewSize) / 2,
  viewSize / 2,
  -viewSize / 2,
  -1000,
  1000
);
camera.position.set(10, 5, 10);

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

const geometry = new THREE.BoxGeometry(100, 100, 100);
const geometry2 = new THREE.BoxGeometry(50, 50, 50);
const geometry3 = new THREE.BoxGeometry(20, 20, 20);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});

const cube = new THREE.Mesh(geometry, material);
const player = new THREE.Mesh(geometry2, material);
const asteroid = new THREE.Mesh(geometry3, material);
const asteroid2 = new THREE.Mesh(geometry3, material);

const gui = new GUI()
const playerFolder = gui.addFolder('Player')
const playerPositionFolder = playerFolder.addFolder('Position');
playerPositionFolder.add(player.position, "x", -1000 , 1000);
playerPositionFolder.add(player.position, "y", -1000 , 1000);
playerPositionFolder.add(player.position, "z", -1000, 1000);

const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "x", -1000, 1000);
cameraFolder.add(camera.position, "y", -1000, 1000);
cameraFolder.add(camera.position, "z", -1000, 1000);


player.position.set(0, 100, -100);

scene.add(player);
scene.add(cube);
scene.add(asteroid);
scene.add(asteroid2);

var orbitRadius = 200; // for example
const orbitAsteroids = 210;


let date, dateAsteroid, dateAsteroid2;

function setupKeyControls(cube: any) {
  // var cube = scene.getObjectByName("cube");
  document.onkeydown = function (e) {
    console.log(e);
    switch (e.keyCode) {
      case 37:
        if (cube != null) cube.position.z += 30;
        break;
      case 38:
        if (cube != null) cube.position.y += 30;
        break;
      case 39:
        if (cube != null) cube.position.z -= 30;
        break;
      case 40:
        if (cube != null) cube.position.y -= 30;
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
  sphere.receiveShadow = true;
  scene.add(sphere);

  //All settings before animation loop
  setupKeyControls(player);

  //ANIMATION LOOOOP
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
    controls.update();
    date = Date.now() * 0.001;
    dateAsteroid = Date.now() * 0.002;
    dateAsteroid2 = (Date.now() + 1000) * 0.002;

    asteroid.position.set(
      Math.cos(dateAsteroid) * orbitAsteroids,
      5,
      Math.sin(dateAsteroid) * orbitRadius
    );

    asteroid2.position.set(
      Math.cos(dateAsteroid2) * orbitAsteroids,
      5,
      Math.sin(dateAsteroid2) * orbitRadius
    );
    
    sphere.rotation.y += 0.01;
      
    stats.update();
  });
})();

