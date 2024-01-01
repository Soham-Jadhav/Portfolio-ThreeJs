import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import gsap from 'gsap';

const gui = new dat.GUI();
const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegments: 50,
    heightSegments: 50,
  },
};

gui.add(world.plane, 'width', 1, 1000).onChange(() => {
  generatePlane();
});
gui.add(world.plane, 'height', 1, 1000).onChange(() => {
  generatePlane();
});
gui.add(world.plane, 'widthSegments', 1, 500).onChange(() => {
  generatePlane();
});
gui.add(world.plane, 'heightSegments', 1, 500).onChange(() => {
  generatePlane();
});

function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );

  // Make rigid pattern on the planeMesh
  const { array } = planeMesh.geometry.attributes.position;
  let randomValues = [];
  for (let i = 0; i <= array.length; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];

    array[i] = x + (Math.random() - 0.5) * 3;
    array[i + 1] = y + (Math.random() - 0.5) * 3;
    array[i + 2] = z + (Math.random() - 0.5) * 3;

    randomValues.push(
      (Math.random() - 0.5) * Math.PI * 2,
      (Math.random() - 0.5) * Math.PI * 2,
      (Math.random() - 0.5) * Math.PI * 2
    );
  }

  // Store some random values & the position of the vertices as attributes to the planeMesh
  planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array;
  planeMesh.geometry.attributes.position.randomValues = randomValues;

  // Instanciate color for each pixel on the planeMesh
  const colors = [];
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4);
  }

  // Set colors using custom color attribute
  planeMesh.geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  )
}

const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

document.body.appendChild(renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(
  world.plane.width,
  world.plane.height,
  world.plane.widthSegments,
  world.plane.heightSegments
);
const planeMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true,
})

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

// Make rigid pattern on the planeMesh
const { array } = planeMesh.geometry.attributes.position;
let randomValues = [];
for (let i = 0; i <= array.length; i += 3) {
  const x = array[i];
  const y = array[i + 1];
  const z = array[i + 2];

  array[i] = x + (Math.random() - 0.5) * 3;
  array[i + 1] = y + (Math.random() - 0.5) * 3;
  array[i + 2] = z + (Math.random() - 0.5) * 3;

  randomValues.push(
    (Math.random() - 0.5) * Math.PI * 2,
    (Math.random() - 0.5) * Math.PI * 2,
    (Math.random() - 0.5) * Math.PI * 2
  );
}

// Store some random values & the position of the vertices as attributes to the planeMesh
planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array;
planeMesh.geometry.attributes.position.randomValues = randomValues;

// Instanciate color for each pixel on the planeMesh
const colors = [];
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  colors.push(0, 0.19, 0.4);
}

// Set colors using custom color attribute
planeMesh.geometry.setAttribute(
  'color',
  new THREE.BufferAttribute(new Float32Array(colors), 3)
)

// Instantiate added arttributes to the planeMesh
generatePlane();

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, -1, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

// Add custom rotation abilities to scene
new OrbitControls(camera, renderer.domElement);

camera.position.z = 50;

const mouse = {
  x: undefined,
  y: undefined,
};
let frame = 0;
let animationId;

function animate() {
  animationId = requestAnimationFrame(animate);
  frame += 0.01;

  renderer.render(scene, camera);

  // Add random motion to the vertices along all axis
  const { array, originalPosition, randomValues } = planeMesh.geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    array[i] = originalPosition[i] + Math.cos(frame + randomValues[i]) * 0.005;
    array[i + 1] = originalPosition[i + 1] + Math.sin(frame + randomValues[i + 1]) * 0.005;
  }
  planeMesh.geometry.attributes.position.needsUpdate = true;

  // Add/Set raycaster 
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(planeMesh);

  // Set color on hover
  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes;

    // Plane vertex 1
    color.setX(intersects[0].face.a, 0.1);
    color.setY(intersects[0].face.a, 0.5);
    color.setZ(intersects[0].face.a, 1);

    // Plane vertex 2
    color.setX(intersects[0].face.b, 0.1);
    color.setY(intersects[0].face.b, 0.5);
    color.setZ(intersects[0].face.b, 1);

    // Plane vertex 3
    color.setX(intersects[0].face.c, 0.1);
    color.setY(intersects[0].face.c, 0.5);
    color.setZ(intersects[0].face.c, 1);

    color.needsUpdate = true;

    const initialColor = {
      r: 0,
      g: 0.19,
      b: 0.4,
    };

    const hoverColor = {
      r: 0.1,
      g: 0.5,
      b: 1,
    };

    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      duration: 1,
      onUpdate: () => {
        // Plane vertex 1
        color.setX(intersects[0].face.a, hoverColor.r);
        color.setY(intersects[0].face.a, hoverColor.g);
        color.setZ(intersects[0].face.a, hoverColor.b);

        // Plane vertex 2
        color.setX(intersects[0].face.b, hoverColor.r);
        color.setY(intersects[0].face.b, hoverColor.g);
        color.setZ(intersects[0].face.b, hoverColor.b);

        // Plane vertex 3
        color.setX(intersects[0].face.c, hoverColor.r);
        color.setY(intersects[0].face.c, hoverColor.g);
        color.setZ(intersects[0].face.c, hoverColor.b);

        color.needsUpdate = true;
      }
    });
  }
}

animate();

addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});
