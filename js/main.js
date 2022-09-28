import * as THREE from "../node_modules/three/build/three.module.js";
import { TrackballControls } from "../node_modules/three/examples/jsm/controls/TrackballControls.js";

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.6, 1200);
camera.position.z = 50; // <- New code

const light = new THREE.PointLight(0xFFFFFF, 1, 100);
light.position.set(5, 5, 5);
scene.add(light);

// Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor("#233143");
renderer.setSize(window.innerWidth, window.innerHeight);


document.body.appendChild(renderer.domElement);

// Make Canvas Responsive
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})


// Create Box
// const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
// const boxMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
// const boxMesh = new THREE.Mesh(boxGeometry, 
// boxMaterial);
// boxMesh.rotation.set(40, 0, 40);
// scene.add(boxMesh);

//ball
const geometry = new THREE.SphereGeometry( 15, 32, 16 );
const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
const sphere = new THREE.Mesh( geometry, material );
sphere.rotation.set(40, 0, 40);
scene.add( sphere );

// Lights
const lights = [];
const lightHelpers = []; // <- New code
const lightValues = [
    {colour: 0x14D14A, intensity: 8, dist: 12, x: 1, y: 0, z: 8},
    {colour: 0xBE61CF, intensity: 6, dist: 12, x: -2, y: 1, z: -10},
    {colour: 0x00FFFF, intensity: 3, dist: 10, x: 0, y: 10, z: 1},
    {colour: 0x00FF00, intensity: 6, dist: 12, x: 0, y: -10, z: -1},
    {colour: 0x16A7F5, intensity: 6, dist: 12, x: 10, y: 3, z: 0},
    {colour: 0x90F615, intensity: 6, dist: 12, x: -10, y: -1, z: 0}
];
for (let i=0; i<2; i++) {
    lights[i] = new THREE.PointLight(
        lightValues[i]['colour'], 
        lightValues[i]['intensity'], 
        lightValues[i]['dist']);
    lights[i].position.set(
        lightValues[i]['x'], 
        lightValues[i]['y'], 
        lightValues[i]['z']);
    scene.add(lights[i]);

    // New Code: Add light helpers for each light
    lightHelpers[i] = new THREE.PointLightHelper(lights[i], 0.7);
    scene.add(lightHelpers[i]);
}

//Trackball Controls for Camera 
const controls = new TrackballControls(camera, renderer.domElement); 
controls.rotateSpeed = 4;
controls.dynamicDampingFactor = 0.15;

const rendering = function() {
    requestAnimationFrame(rendering);
    // Constantly rotate box
    scene.rotation.z -= 0.005;
    scene.rotation.x -= 0.01;
    renderer.render(scene, camera);
}

rendering();