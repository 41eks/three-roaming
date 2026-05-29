// const fbxLoader = new FBXLoader();
const glbLoader = new GLTFLoader();

import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
export function loadGLB(path: string) {
  return new Promise<THREE.Group>((resolve, reject) => {
    glbLoader.load(
      path,
      (gltf: GLTF) => {
        gltf.scene.animations = gltf.animations;
        resolve(gltf.scene)
      },  // 用 resolve 代替 return
      undefined,
      (error) => reject(error)
    );
  });
}
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';