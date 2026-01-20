import * as THREE from "three";

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

//import GUI from "lil-gui";

// GUI
//const gui = new GUI();


// container
const container = document.querySelectorAll(".webgl");

// Verification div
if (!container) {
  console.error("Erreur: Impossible de trouver l'élément .webgl");
} else {
  // Scene
  const scene = new THREE.Scene();

  // Models
  //Draco
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
  //GLTF
  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  // getObjects
  let objects = {
    original: null,
  };

  // GLTFLoader
  gltfLoader.load(
    "https://cdn.jsdelivr.net/gh/Igmald/webflowEclatDeThe@29345eef125436c72e541a2ae83b2a308e70cdec/Product-thea.glb",
    (gltf) => {
      scene.add(gltf.scene);

      // Move objects
     // objects.printaniere = gltf.scene.getObjectByName("printemps");
      //objects.fumee = gltf.scene.getObjectByName("fumee");
      objects.original = gltf.scene.getObjectByName("original");

      if (objects.original) {
        objects.original.position.x = -0.4;
        objects.original.position.y = -0.6;
      }
     // if (objects.printaniere) objects.printaniere.position.x = 2;
     // if (objects.fumee) objects.fumee.position.x = 3;
    },
  );

  //HDRLoader
  const hdrLoader = new HDRLoader();

  hdrLoader.load(
    "https://cdn.jsdelivr.net/gh/Igmald/webflowEclatDeThe@main/environmentMap.hdr",
    (hdr) => {
      hdr.mapping = THREE.EquirectangularReflectionMapping;
      // Rotation
      hdr.rotation = Math.PI;

      scene.environment = hdr;
      const sceneRotation = Math.PI * 0.5;
      scene.environmentRotation.y = sceneRotation;
      scene.backgroundRotation.y = sceneRotation;
      // scene.background = hdr
    },
  );

  scene.environmentIntensity = 1.20;
  //gui.add(scene, "environmentIntensity", 0.1, 5, 0.01);

  // Lights
  const ambientLight = new THREE.AmbientLight("#ffffff", 0.1);
  scene.add(ambientLight);

  // Camera
  let sizes = {
    width: container.clientWidth,
    height: container.clientHeight,
  };

  const camera = new THREE.PerspectiveCamera(
    35,
    sizes.width / sizes.height,
    0.1,
    100,
  );
  camera.position.z = 3;
  scene.add(camera);

  // Renderer
  // Creation canvas
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Canvas div webflow
  //container.appendChild(renderer.domElement);

  // Controls
  // const orbitControls = new OrbitControls(camera, renderer.domElement);

  // ToneMapping
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  /*gui.add(renderer, "toneMapping", {
    no: THREE.NoToneMapping,
    linear: THREE.LinearToneMapping,
    reinhard: THREE.ReinhardToneMapping,
    cineon: THREE.CineonToneMapping,
    acesFilmic: THREE.ACESFilmicToneMapping,
  });

  renderer.toneMappingExposure = 1;
  gui.add(renderer, "toneMappingExposure", 0, 2, 0.01);
*/
  const clock = new THREE.Clock();
  let previousTime = 0;

  // Animation
  const thick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Animations objects
    if (objects.original) {
        objects.original.rotateY(Math.sin(elapsedTime) * 0.001);
        objects.original.position.y = -0.6 + Math.sin(elapsedTime) * 0.02;
    }

    // Update controls
    // orbitControls.update();

    // Renderer
    renderer.render(scene, camera);

    // Window
    window.requestAnimationFrame(thick);
  };

  thick();

  // Resize
  window.addEventListener("resize", () => {
    // Update sizes based on container, not window
    sizes.width = container.clientWidth;
    sizes.height = container.clientHeight;

    // Camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}
