import * as THREE from "three";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';  
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';  
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';  
import GUI from 'lil-gui';


// GUI
const gui = new GUI()
// Canvas
const canvas = document.querySelector(".webgl");

// Scene
const scene = new THREE.Scene();

// Models
const gltfLoader = new GLTFLoader();

// getObjects
let objects = {
  printaniere: null,
  fumee: null,
  original: null,
}

// GLTFLoader
gltfLoader.load("https://cdn.jsdelivr.net/gh/Igmald/webflowEclatDeThe@main/Product-thea.glb", (gltf) => {
  scene.add(gltf.scene);

  // Move objects
   objects.printaniere = gltf.scene.getObjectByName('printemps')
   objects.fumee = gltf.scene.getObjectByName('fumee')
   objects.original = gltf.scene.getObjectByName('original')

  objects.original.position.x = -0.4
  objects.original.position.y = -0.6
  objects.printaniere.position.x = 2
  objects.fumee.position.x = 3
});

// HDRLoader

const hdrLoader = new HDRLoader();

hdrLoader.load('https://cdn.jsdelivr.net/gh/Igmald/webflowEclatDeThe@main/environmentMap.hdr', (hdr) => {
  hdr.mapping = THREE.EquirectangularReflectionMapping;

  // Rotation
  hdr.rotation = Math.PI

  scene.environment = hdr
  const sceneRotation = Math.PI * 0.5
  scene.environmentRotation.y = sceneRotation
  scene.backgroundRotation.y = sceneRotation
  // scene.background = hdr

})

// Environment
scene.environmentIntensity = 1
gui.add(scene, 'environmentIntensity', 0.1, 5, 0.01)

// Lights
const ambientLight = new THREE.AmbientLight("#ffffff", 0.1);
scene.add(ambientLight);

// Camera
let sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.z = 3;
scene.add(camera);

// Controls
const orbitControls = new OrbitControls(camera, canvas);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ToneMapping
renderer.toneMapping = THREE.LinearToneMapping
gui.add(renderer, 'toneMapping', {
  no: THREE.NoToneMapping,
  liner: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping

})
renderer.toneMappingExposure = 1
gui.add(renderer, "toneMappingExposure", 0, 2, 0.01)

const clock = new THREE.Clock()
let previousTime = 0
// Animation
const thick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime


  // Animations objects
    if(objects.original) {
        objects.original.rotateY(Math.sin(elapsedTime) * 0.002);
    }


  // Renderer

  renderer.render(scene, camera);

  // Window
  window.requestAnimationFrame(thick);
};

thick();

// Renderer
window.addEventListener("resize", () => {
  // Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Renderer

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

