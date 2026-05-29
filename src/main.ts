
import { createAnimationUpdater } from './animation';

import * as THREE from 'three';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import {
  ground, boxes

} from './building';
import { scene, camera, renderer } from './universal';
scene.background = new THREE.Color(0xbfd1e5);

scene.add(ground);
// scene.add(boxes);
boxes.forEach(box => {
  scene.add(box);
})


// // camera.position.set(10, 10, 10);
// camera.position.set(0, 6, -12);

// // 2. 让相机初始就看向角色出生点
// camera.lookAt(5, 0, 5);
// === 【修改点 1】给相机和控制器一个好看的初始观测点 ===
camera.position.set(0, 6, -12); // 初始化在玩家后上方
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);   // 初始看向出生点
controls.enableDamping = true;
controls.update();
controls.addEventListener("change", () => {
  // console.log(camera.position);
})
import { loadGLB } from './handleGLB';

// import { input } from './InputManager';
import { updateMovement } from './calcDirection';

const player = await loadGLB('ShinChan.glb').then((model) => {
  model.scale.set(0.01, 0.01, 0.01);
  model.position.set(0, 0, 0);
  scene.add(model);
  return model;
});
const velocity = new THREE.Vector3(0, 0, 0.1);
const originLength = velocity.length();
const movestate = updateMovement(camera, player);


const updateAnimationListener = createAnimationUpdater(player);

// 1. 使用 Timer 替代 Clock
const timer = new THREE.Timer();

export type Updatable = (dt: number) => void;
const queue: Updatable[] = [];
queue.push(updateAnimationListener);
queue.push(() => {
  movestate(originLength);
});

// 准备一个临时的向量，用于计算每帧的相对位移
const cameraOffset = new THREE.Vector3();
function animate() {
  requestAnimationFrame(animate);
  timer.update();
  const dt = timer.getDelta();
  // 1. 先让 OrbitControls 把这一帧的阻尼、鼠标旋转全部计算完毕！
  // 这样它计算出来的相机位置就是最终静止、没有残余惯性的位置
  controls.update();

  // 2. 【核心：实现你的想法】在玩家移动前，计算此时此刻最干净的差值
  const diff = new THREE.Vector3().copy(camera.position).sub(player.position);




  queue.forEach((listener) => listener(dt));
  controls.target.copy(player.position);
  // === 1. 计算移动前，相机相对于玩家的【旋转角度和距离】 ===
  // 这一步能完美保留你用鼠标右键旋转出来的视角，以及滚轮缩放的距离
  cameraOffset.copy(camera.position).sub(controls.target);

  // === 2. 执行队列（玩家开始移动，player.position 发生改变） ===
  queue.forEach((listener) => listener(dt));

  // 4. 将玩家的新位置，加上刚才算好的差值，强行赋给相机
  camera.position.copy(player.position).add(diff);

  // 5. 让控制器的目标死死咬住玩家的新位置
  controls.target.copy(player.position);


  renderer.render(scene, camera);
}
animate();