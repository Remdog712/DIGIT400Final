import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/RGBELoader.js';

export function initModel() {
  const canvas = document.getElementById('modelCanvas');
  const scene = new THREE.Scene();

  // Camera setup but needs tweaked
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  // Renderer setup thanks forums
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  document.body.appendChild(renderer.domElement);

  // HDRI background setup (has to be .hdr because .exr didn't work - acquired CC0 from Polyhaven)
  const rgbeLoader = new RGBELoader();
  rgbeLoader.load(
    '/assets/autumn_field_puresky_1k.hdr',
    (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      scene.background = texture;
    },
    undefined,
    (error) => console.error('Error loading HDRI:', error)
  );

  // OrbitControls for moving the camera
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // GLTF model and animation loader (don't use FBX)
  let mixer;
  const loader = new GLTFLoader();
  loader.load(
    '/assets/PumpkinTest17.glb',
    (gltf) => {
      const model = gltf.scene;
      model.position.set(0, 0, 0);
      model.scale.set(1, 1, 1);
      scene.add(model);

      // Handle animations if they exist (wasn't working originally)
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
      }
    },
    undefined,
    (error) => console.error('Error loading model:', error)
  );

  // Adjust canvas on window resize (little more dynamic)
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation loop
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);

    // Update animations
    if (mixer) mixer.update(clock.getDelta());

    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}
