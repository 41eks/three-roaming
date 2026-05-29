// import { camera } from "./universal";

import * as THREE from "three";
import { input } from "./InputManager";
// import { camera } from "./universal";


const target = new THREE.Vector3();
const moveDir = new THREE.Vector3();

const cameraForward = new THREE.Vector3();
const cameraRight = new THREE.Vector3();
const up = new THREE.Vector3(0, 1, 0);
// 相对静止的偏移量：在玩家身后 8 个单位，上方 5 个单位
const cameraOffset = new THREE.Vector3(0, 6, -12);
const cameraTarget = new THREE.Vector3();
export function updateMovement(
    camera: THREE.PerspectiveCamera,
    player: THREE.Group
) {

    function updateDir() {

        camera.getWorldDirection(cameraForward);

        cameraForward.y = 0;
        cameraForward.normalize();

        cameraRight.crossVectors(cameraForward, up).normalize();

        moveDir.set(0, 0, 0);

        if (input.isPressed("KeyW")) moveDir.add(cameraForward);
        if (input.isPressed("KeyS")) moveDir.sub(cameraForward);
        if (input.isPressed("KeyA")) moveDir.sub(cameraRight);
        if (input.isPressed("KeyD")) moveDir.add(cameraRight);

        if (moveDir.lengthSq() > 0) {
            moveDir.normalize();
        }
    }

    function updateLookAt() {

        if (moveDir.lengthSq() === 0) return;

        target.copy(player.position).add(moveDir);

        player.lookAt(target);
    };
    function updatePosition(length: number) {

        if (moveDir.lengthSq() === 0) return;

        player.position.addScaledVector(moveDir, length);
        // camera.position.addScaledVector(moveDir, length);
    }
    function updateCamera() {
        // // 【核心修改】不管玩家怎么旋转，相机与玩家在世界坐标系中永远保持固定的相对距离
        // // 这样做就是纯粹的“上帝固定视角”，相机绝对不会产生任何漂移、延迟或掉到脚底
        // cameraTarget.copy(player.position).add(cameraOffset);

        // // 直接赋值坐标，不用 lerp，实现 100% 相对静止
        // camera.position.copy(cameraTarget);

        // 相机死死盯着玩家的身体中心
        // camera.lookAt(player.position);
    }

    function updateMoveState(length: number) {

        // 一帧只算一次
        updateDir();

        updateLookAt();

        updatePosition(length);
        // updateCamera();

    }

    return updateMoveState;
}

