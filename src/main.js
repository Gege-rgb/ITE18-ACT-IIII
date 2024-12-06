import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Scene
const scene = new THREE.Scene();

// Galaxy Parameters
const starCount = 100000; // Increase the number of stars for a more vibrant galaxy
const arms = 6; // More arms for complexity
const radius = 25; // A larger radius for a wider galaxy
const coreCount = 2000; // More stars in the core for a denser center
const spiralTightness = 1.5; // Tighter spiral arms

// Geometry and Material for Stars
const positionsArray = new Float32Array(starCount * 3);
const coreArray = new Float32Array(coreCount * 3);

// Creating Spiral Galaxy Shape
for (let i = 0; i < starCount; i++) {
  const angle = Math.random() * Math.PI * 2;
  const armAngle = Math.floor(Math.random() * arms) * ((Math.PI * 2) / arms);
  const radiusFactor = Math.pow(Math.random(), spiralTightness) * radius;

  positionsArray[i * 3] = Math.cos(angle + armAngle) * radiusFactor;
  positionsArray[i * 3 + 1] = (Math.random() - 0.5) * 4;
  positionsArray[i * 3 + 2] = Math.sin(angle + armAngle) * radiusFactor;
}

// Creating Dense Core for Galaxy (Bright center)
for (let i = 0; i < coreCount; i++) {
  coreArray[i * 3] = (Math.random() - 0.5) * 2;
  coreArray[i * 3 + 1] = (Math.random() - 0.5) * 2;
  coreArray[i * 3 + 2] = (Math.random() - 0.5) * 2;
}

// Create Star Geometry
const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionsArray, 3)
);

// // Create Core Geometry
const coreGeometry = new THREE.BufferGeometry();
coreGeometry.setAttribute("position", new THREE.BufferAttribute(coreArray, 3));

// Materials for Stars with Pulsing Effect
const starMaterial = new THREE.PointsMaterial({
  color: new THREE.Color(0x8a2be2), // Purple color for stars
  size: 0.1,
  transparent: true,
  opacity: 0.8,
  sizeAttenuation: true,
  depthWrite: false, // Stars don’t write to depth buffer, allowing glowing effect
  blending: THREE.AdditiveBlending, // Glowing effect
});

// Core Material for Dense Center
const coreMaterial = new THREE.PointsMaterial({
  color: new THREE.Color(0xffffff), // Brighter white color for the core
  size: 0.2,
  transparent: true,
  opacity: 1,
  sizeAttenuation: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});

// Create Points for Stars and Core
const stars = new THREE.Points(starGeometry, starMaterial);
const core = new THREE.Points(coreGeometry, coreMaterial);

// Add Stars and Core to the Scene
scene.add(stars);
scene.add(core);

// Camera Setup
const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);
camera.position.z = 30;
scene.add(camera);

// Lighting Setup
const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft ambient light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Main light
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Create Nebula (Soft Background Glow Effect)
const nebulaGeometry = new THREE.SphereGeometry(40, 64, 64);
const nebulaMaterial = new THREE.MeshBasicMaterial({
  color: 0x2e004f, // Deep purple color
  opacity: 0.1,
  transparent: true,
  side: THREE.BackSide,
});
const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
scene.add(nebula);

// Renderer Setup
const canvas = document.querySelector("canvas.webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Orbit Controls for Interactivity
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Handle Window Resizing
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Shimmer (Pulsing Stars and Color Shift)
const shimmerSpeed = 0.5; // Speed of shimmer effect
const colorShiftSpeed = 0.1; // Speed of color shift for stars

// Animation Loop
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Rotate the galaxy (Core and Arms)
  stars.rotation.y = elapsedTime * 0.3;
  core.rotation.y = elapsedTime * 0.1; // Core spins faster

  // Shimmer effect for stars
  const time = Date.now() * shimmerSpeed;
  const starOpacity = Math.abs(Math.sin(time * 0.003)) * 0.8 + 0.2;
  stars.material.opacity = starOpacity;

  // Color shift effect for stars (pulsing colors)
  stars.material.color.setHSL(
    Math.sin(elapsedTime * colorShiftSpeed) * 0.5 + 0.5,
    1.0,
    0.5
  );

  // Shimmer effect for core
  const coreOpacity = Math.abs(Math.sin(time * 0.004)) * 0.6 + 0.4;
  core.material.opacity = coreOpacity;

  // Update controls
  controls.update();

  // Render the scene
  renderer.render(scene, camera);

  // Call the next frame
  window.requestAnimationFrame(tick);
};

// Start Animation
tick();
