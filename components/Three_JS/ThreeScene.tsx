// "use client";
//
// import { useRef, useEffect, useState } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//
// export default function ThreeScene() {
//     const mountRef: any = useRef(null);
//     const sphereRef: any = useRef(null); // to rotate sphere
//
//     useEffect(() => {
//         const mount = mountRef.current;
//
//         // Renderer
//         const renderer = new THREE.WebGLRenderer({ antialias: true });
//         renderer.setSize(mount.clientWidth, mount.clientHeight);
//         renderer.shadowMap.enabled = true;
//         mount.appendChild(renderer.domElement);
//
//         // Scene
//         const scene = new THREE.Scene();
//         scene.background = new THREE.Color(0x0a0a0a);
//
//         // Camera
//         const camera = new THREE.PerspectiveCamera(
//             75,
//             mount.clientWidth / mount.clientHeight,
//             0.1,
//             1000
//         );
//         camera.position.set(0, 1, 4);
//
//         // Controls
//         const controls = new OrbitControls(camera, renderer.domElement);
//         controls.enableDamping = true;
//
//         // Sphere
//         const geometry = new THREE.SphereGeometry(1, 64, 64);
//         const material = new THREE.MeshStandardMaterial({ color: "cyan" });
//         const sphere = new THREE.Mesh(geometry, material);
//         sphere.castShadow = true;
//         scene.add(sphere);
//         sphereRef.current = sphere;
//
//         // Ground plane
//         const planeGeometry = new THREE.PlaneGeometry(10, 10);
//         const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 });
//         const plane = new THREE.Mesh(planeGeometry, planeMaterial);
//         plane.rotation.x = -Math.PI / 2;
//         plane.position.y = -1;
//         plane.receiveShadow = true;
//         scene.add(plane);
//
//         // Lighting
//         const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
//         scene.add(ambientLight);
//
//         const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//         directionalLight.position.set(2, 4, 2);
//         directionalLight.castShadow = true;
//         directionalLight.shadow.mapSize.set(1024, 1024);
//         scene.add(directionalLight);
//
//         // Animate
//         const animate = () => {
//             requestAnimationFrame(animate);
//
//             // Rotate the sphere a bit
//             sphere.rotation.y += 0.005;
//
//             controls.update();
//             renderer.render(scene, camera);
//         };
//         animate();
//
//         return () => {
//             mount.removeChild(renderer.domElement);
//             controls.dispose();
//         };
//     }, []);
//
//     return (
//         <div style={{ position: "relative", width: "100%", height: "100vh" }}>
//             <div
//                 ref={mountRef}
//                 style={{ width: "100%", height: "100vh", display: "block" }}
//             />
//             <div
//                 style={{
//                     position: "absolute",
//                     top: "50%",
//                     left: "50%",
//                     transform: "translate(-50%, 160px)",
//                     color: "white",
//                     fontSize: "2.5rem",
//                     fontWeight: "bold",
//                     fontFamily: "sans-serif",
//                     pointerEvents: "none",
//                 }}
//             >
//                 Simplify
//             </div>
//         </div>
//     );
// }
