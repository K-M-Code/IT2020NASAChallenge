import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";

const scene = new THREE.Scene();

const size = 10000;
const divisions = 100;

const gridHelper = new THREE.GridHelper(size, divisions);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(1000);
scene.add(axesHelper);

const viewSize = 900;
const aspectRatio = window.innerWidth / window.innerHeight;

const camera = new THREE.OrthographicCamera(
  (-aspectRatio * viewSize) / 2,
  (aspectRatio * viewSize) / 2,
  viewSize / 2,
  -viewSize / 2,
  -1000,
  1000
);

camera.position.set(10, 5, 10);
//camera.lookAt(new THREE.Vector3(0, 0, 0));

const canvas = document.getElementById("c1") as HTMLCanvasElement;

const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry(100, 100, 100);
const geometry2 = new THREE.BoxGeometry(50, 50, 50);
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true,
});

const cube = new THREE.Mesh(geometry, material);
const cube2 = new THREE.Mesh(geometry2, material);
cube2.position.set(0, 100, -100);
scene.add(cube2);
scene.add(cube);

var orbitRadius = 200; // for example
var date;

function animate() {
  requestAnimationFrame(animate);
  date = Date.now() * 0.001;
  //cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube2.position.set(
    Math.cos(date) * orbitRadius,
    0,
    Math.sin(date) * orbitRadius
  );
  render();
}

function render() {
  renderer.render(scene, camera);
}

animate();
