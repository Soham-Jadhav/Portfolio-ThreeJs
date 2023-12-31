import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
import gsap from 'gsap';

// console.log(OrbitControls);
const gui = new dat.GUI();
const world = {
  plane: {
    width: 20,
    height: 20,
    widthSegments: 18,
    heightSegments: 18,
  },
};

gui.add(world.plane, 'width', 1, 50).onChange(() => {
  generatePlane();
});
gui.add(world.plane, 'height', 1, 50).onChange(() => {
  generatePlane();
});
gui.add(world.plane, 'widthSegments', 1, 100).onChange(() => {
  generatePlane();
});
gui.add(world.plane, 'heightSegments', 1, 100).onChange(() => {
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

  // console.log(planeMesh.geometry.attributes.position.array);
  const { array } = planeMesh.geometry.attributes.position;

  for (let i = 0; i <= array.length; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];

    array[i] = x;
    array[i + 1] = y;
    array[i + 2] = z + Math.random();
  }

  // Instanciate color for each pixel on the planeMesh
  const colors = [];
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4);
  }

  // Set colors using custom color attribute
  planeMesh.geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(new Float32Array(colors), 3)
    // new THREE.BufferAttribute(new Float32Array([1, 0, 0]), 3)
  )
}

const raycaster = new THREE.Raycaster();
// console.log(raycaster);

const scene = new THREE.Scene();
// console.log(scene);

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
// console.log(camera);

const renderer = new THREE.WebGLRenderer();
// console.log(renderer);

renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);

document.body.appendChild(renderer.domElement);

// const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
// const boxGeometery = new THREE.BoxGeometry(1, 1, 1);

// const boxMesh = new THREE.Mesh(boxGeometery, boxMaterial);
// scene.add(boxMesh);

const planeGeometry = new THREE.PlaneGeometry(
  world.plane.width, 
  world.plane.height, 
  world.plane.widthSegments, 
  world.plane.heightSegments
);
const planeMaterial = new THREE.MeshPhongMaterial({
  // color: 0xff0000, 
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true,
})

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

// Make rigid pattern on the planeMesh
// console.log(planeMesh.geometry.attributes.position.array);
const { array } = planeMesh.geometry.attributes.position;
for (let i = 0; i <= array.length; i += 3) {
  const x = array[i];
  const y = array[i + 1];
  const z = array[i + 2];

  array[i] = x;
  array[i + 1] = y;
  array[i + 2] = z + Math.random();
}

// Instanciate color for each pixel on the planeMesh
const colors = [];
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  colors.push(0, 0.19, 0.4);
}

// Set colors using custom color attribute
planeMesh.geometry.setAttribute(
  'color',
  new THREE.BufferAttribute(new Float32Array(colors), 3)
  // new THREE.BufferAttribute(new Float32Array([1, 0, 0]), 3)
)

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

// Add custom rotation abilities to scene
new OrbitControls(camera, renderer.domElement);

camera.position.z = 5;

// renderer.render(scene, camera);

const mouse = {
  x: undefined,
  y: undefined,
};
let animationId;

function animate() {
  animationId = requestAnimationFrame(animate);

  renderer.render(scene, camera);
  // boxMesh.rotation.x += 0.01;
  // boxMesh.rotation.z += 0.01;
  planeMesh.rotation.x += 0.01;
  planeMesh.rotation.z += 0.01;

  // Add/Set raycaster 
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(planeMesh);
  // console.log(intersects);

  // Set color on hover
  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes;

    // console.log(intersects[0].face);
    // intersects[0].object.geometry.attributes.color.setX(0, 0);

    // intersects[0].object.geometry.attributes.color.setX(intersects[0].face.a, 0);
    // intersects[0].object.geometry.attributes.color.setX(intersects[0].face.b, 0);
    // intersects[0].object.geometry.attributes.color.setX(intersects[0].face.c, 0);
    // intersects[0].object.geometry.attributes.color.needsUpdate = true;

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
  // console.log(event);
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
  // console.log(mouse);
});
