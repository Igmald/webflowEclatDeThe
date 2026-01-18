import * as THREE from "three";


import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';  
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';  
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';  
import GUI from 'lil-gui';

// GUI
const gui = new GUI();

// --- CORRECTION 1 : GESTION DU CANVAS ---
// On cherche le conteneur (la DIV Webflow)
const container = document.querySelector(".webgl");

// Si on ne trouve pas la div, on arrête tout pour éviter les erreurs
if (!container) {
    console.error("Erreur: Impossible de trouver l'élément .webgl");
} else {

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
        // Attention : vérifiez bien que ces noms existent dans votre GLB
        objects.printaniere = gltf.scene.getObjectByName('printemps');
        objects.fumee = gltf.scene.getObjectByName('fumee');
        objects.original = gltf.scene.getObjectByName('original');

        if(objects.original) {
             objects.original.position.x = -0.4;
             objects.original.position.y = -0.6;
        }
        if(objects.printaniere) objects.printaniere.position.x = 2;
        if(objects.fumee) objects.fumee.position.x = 3;
    });

    //RGBELoader
    const rgbeLoader = new RGBELoader();

    rgbeLoader.load('https://cdn.jsdelivr.net/gh/Igmald/webflowEclatDeThe@main/environmentMap.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
  // Rotation
  hdr.rotation = Math.PI

  scene.environment = hdr
  const sceneRotation = Math.PI * 0.5
  scene.environmentRotation.y = sceneRotation
  scene.backgroundRotation.y = sceneRotation
  // scene.background = hdr
    });

scene.environmentIntensity = 1
gui.add(scene, 'environmentIntensity', 0.1, 5, 0.01)
    
    // Lights
    const ambientLight = new THREE.AmbientLight("#ffffff", 0.1);
    scene.add(ambientLight);

    // Camera
    // On utilise container.clientWidth au lieu de window.innerWidth pour rester dans la boite
    let sizes = {
        width: container.clientWidth,
        height: container.clientHeight,
    };
    
    const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
    camera.position.z = 3;
    scene.add(camera);

    // Renderer
    // On laisse Three.js créer son propre canvas et on l'ajoute à la div
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // On injecte le canvas dans la div Webflow
    container.appendChild(renderer.domElement);

    // Controls (doit être après la création du renderer.domElement)
    const orbitControls = new OrbitControls(camera, renderer.domElement);

    // ToneMapping
    renderer.toneMapping = THREE.LinearToneMapping;
    gui.add(renderer, 'toneMapping', {
        no: THREE.NoToneMapping,
        linear: THREE.LinearToneMapping,
        reinhard: THREE.ReinhardToneMapping,
        cineon: THREE.CineonToneMapping,
        acesFilmic: THREE.ACESFilmicToneMapping
    });
    
    renderer.toneMappingExposure = 1;
    gui.add(renderer, "toneMappingExposure", 0, 2, 0.01);

    const clock = new THREE.Clock();
    let previousTime = 0;

    // Animation
    const thick = () => {
        const elapsedTime = clock.getElapsedTime();
        const deltaTime = elapsedTime - previousTime;
        previousTime = elapsedTime;

        // Animations objects
        if (objects.original) {
            objects.original.rotateY(Math.sin(elapsedTime) * 0.002);
        }

        // Update controls
        orbitControls.update();

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
