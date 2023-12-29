import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

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

const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10);
const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, side: THREE.DoubleSide, flatShading: THREE.FlatShading })

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(planeMesh);

console.log(planeMesh.geometry.attributes.position.array);
const {array} = planeMesh.geometry.attributes.position;

for(let i = 0; i <= array.length; i += 3){
  const x = array[i];
  const y = array[i + 1];
  const z = array[i + 2];

  array[i] = x;
  array[i + 1] = y;
  array[i + 2] = z + Math.random();
}

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

camera.position.z = 5;

// renderer.render(scene, camera);

let animationId;

function animate(){
  animationId = requestAnimationFrame(animate);

  renderer.render(scene, camera);
  // boxMesh.rotation.x += 0.01;
  // boxMesh.rotation.z += 0.01;
  planeMesh.rotation.x += 0.01;
  planeMesh.rotation.z += 0.01;
}

animate();
  