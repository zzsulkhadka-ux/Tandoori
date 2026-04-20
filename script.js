const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg-canvas'),
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

const geometry = new THREE.CylinderGeometry(8, 10, 15, 32);
const material = new THREE.MeshStandardMaterial({ 
    color: 0x8B4513,
    roughness: 0.8,
    metalness: 0.1
});
const tandoor = new THREE.Mesh(geometry, material);
scene.add(tandoor);

const pointLight = new THREE.PointLight(0xff4500, 500);
pointLight.position.set(0, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(pointLight, ambientLight);

gsap.registerPlugin(ScrollTrigger);

gsap.to(tandoor.rotation, {
    y: Math.PI * 2,
    scrollTrigger: {
        trigger: "main",
        start: "top top",
        end: "bottom bottom",
        scrub: 1
    }
});

gsap.to(tandoor.position, {
    x: 10,
    z: 10,
    scrollTrigger: {
        trigger: ".about",
        start: "top bottom",
        end: "top top",
        scrub: 1
    }
});

gsap.to(tandoor.position, {
    x: -12,
    scrollTrigger: {
        trigger: ".menu",
        start: "top bottom",
        end: "top top",
        scrub: 1
    }
});

function animate() {
    requestAnimationFrame(animate);
    tandoor.rotation.x += 0.005;
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
