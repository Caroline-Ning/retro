import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// Setup
// npm run dev

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.render(scene, camera);

//建立物体的三个步骤1.geometry-物体基本参数，2.材料（本案例basic没有light source），3.mesh把前两者连起来
// const geometry = new THREE.TorusGeometry(13, 2, 8, 100);
// const material = new THREE.MeshStandardMaterial({ color: 0xc1c1c1 });
// const torus = new THREE.Mesh(geometry, material);
// torus.rotateX(30);
// scene.add(torus);

const ringTexture = new THREE.TextureLoader().load("concrete.jpeg");
const ring = new THREE.Mesh(
  new THREE.RingGeometry(12, 16, 60),
  new THREE.MeshStandardMaterial({ map: ringTexture })
);
ring.rotateX(30);
scene.add(ring);

//diamond
const diamond = new THREE.Mesh(
  new THREE.IcosahedronGeometry(4, 0),
  new THREE.MeshStandardMaterial({ color: 0x9157af })
);
scene.add(diamond);

//contact
const contactTexture = new THREE.TextureLoader().load("refer.jpg");
const contact = new THREE.Mesh(
  new THREE.BoxGeometry(8, 2.1, 2.1),
  new THREE.MeshBasicMaterial({ map: contactTexture })
);
scene.add(contact);

//plane
const planeTexture = new THREE.TextureLoader().load("grid.jpg");
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshBasicMaterial({ map: planeTexture })
);
plane.position.z = -15;
plane.rotateX((-90 * Math.PI) / 180);
scene.add(plane);
//light
const pointLight = new THREE.PointLight(0xffffff); //0x:十六进制
pointLight.position.set(10, 15, 30); //位置xyz
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xffffff);
pointLight2.position.set(-7, 12, 80);
scene.add(pointLight2);
// helper,针对pointLight这个参数,图上显示光源在哪里
const lightHelper = new THREE.PointLightHelper(pointLight);
const lightHelper2 = new THREE.PointLightHelper(pointLight2);

const gridHelper = new THREE.GridHelper(200, 20); //网格
// scene.add(lightHelper, gridHelper, lightHelper2);

//初始化orbit control class
//实时更新鼠标位置，根据鼠标位置来更新camera位置
const controls = new OrbitControls(camera, renderer.domElement);

// stars
function addStar() {
  const geometry = new THREE.SphereGeometry(0.2, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(300)); //这个helper自动生成-100到+100的数
  star.position.set(x, y, z);
  scene.add(star);
}

Array(500).fill().forEach(addStar);
const spaceTexture = new THREE.TextureLoader().load("space.jpeg");
// scene.background = spaceTexture; //把背景设置成这个texture

//moon
const moonTexture = new THREE.TextureLoader().load("moon2.jpg");
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(10, 32, 32),
  new THREE.MeshBasicMaterial({
    map: moonTexture,
  })
);
scene.add(moon);

moon.position.x = 12;
moon.position.z = 40;
moon.position.y = 5;

ring.position.x = 10.6;
ring.position.z = 40;
ring.position.y = 6;

diamond.position.x = -10;
diamond.position.z = 65;
diamond.position.y = 10;

contact.position.x = 1;
contact.position.z = 99.5;
contact.position.y = 9.6;
contact.rotation.y = 0.00001;
contact.rotation.x = -0.1;
contact.rotation.z = -0.001;

const oriZ = 20;
const ratio = -0.05;
camera.position.setZ(oriZ);
camera.position.setY(10);

//链接物体和网页

function moveCamera() {
  let t = document.body.getBoundingClientRect().top;

  //moon rotate
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  if (t < oriZ / ratio) {
    //move, until see moon
    camera.position.z = t * ratio;
    scene.add(plane);
    scene.add(moon);
    scene.add(ring);
    if (t < -1052 && t >= -1350) {
      scene.remove(plane);
    } else if (t < -1350 && t >= -3656) {
      //static, moon
      scene.remove(diamond);
      scene.remove(plane);
      camera.position.z = -1350 * ratio;
      scene.add(moon);
      scene.add(ring);
    } else if (t < -3656 && t >= -3943) {
      //move, until see diamond
      scene.add(diamond);
      scene.remove(plane);
      scene.remove(moon);
      scene.remove(ring);
      camera.position.z = (t + 3656 - 1350) * ratio; //正
    } else if (t < -3943 && t >= -4489) {
      //static, diamond
      scene.remove(plane);
      scene.remove(moon);
      scene.remove(ring);
      camera.position.z = (-3943 + 3656 - 1350) * ratio; //正
    } else if (t < -4489 && t >= -4878) {
      //move
      scene.add(diamond);
      scene.remove(plane);
      scene.remove(moon);
      scene.remove(ring);
      camera.position.z = (t + 3656 - 1350 + 4489 - 3943) * ratio;
    } else if (t < -4878 && t >= -4950) {
      //move, until see box
      scene.remove(diamond);
      scene.remove(plane);
      scene.remove(moon);
      scene.remove(ring);
      camera.position.z = (t + 3656 - 1350 + 4489 - 3943) * ratio;
    } else if (t < -4950) {
      //see box
      scene.remove(plane);
      camera.position.z = (-4950 + 3656 - 1350 + 4489 - 3943) * ratio;
    }
  } else {
    //static, very beginning
    scene.add(moon);
    scene.add(plane);
    scene.add(ring);
    camera.position.setZ(oriZ);
    camera.position.setY(10);
  }
}

//一旦滚动就fire this function
document.body.onscroll = moveCamera;

// renderer.render(scene, camera);//按理来说需要重新渲染才能看到
// 但我们可以建立function让页面循环渲染（？
function animate() {
  requestAnimationFrame(animate);

  diamond.rotation.x += -0.006;
  diamond.rotation.y += -0.006;
  diamond.rotation.z += 0.006;

  ring.rotation.z += 0.005;

  controls.update(); //鼠标交互update
  renderer.render(scene, camera);
}
animate();
