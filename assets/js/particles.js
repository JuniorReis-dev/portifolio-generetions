const canvas = document.createElement("canvas");
canvas.id = "particles-background";
document.body.insertBefore(canvas, document.body.firstChild);

const canvasStyle = document.createElement("style");
canvasStyle.textContent = `
  #particles-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    display: block;
  }

  body {
    background-color: #0a0a14;
    color: white;
  }

  .section {
    position: relative;
    z-index: 1;
  }

  .scroll-indicator {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 14px;
    opacity: 0.7;
    transition: opacity 0.3s ease;
    z-index: 100;
    backdrop-filter: blur(5px);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
  }

  .scroll-indicator:hover {
    opacity: 1;
  }

  .scroll-indicator .icon {
    display: inline-block;
    margin-left: 8px;
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-5px);
    }
    60% {
      transform: translateY(-3px);
    }
  }
`;
document.head.appendChild(canvasStyle);

const scrollIndicator = document.createElement("div");
scrollIndicator.className = "scroll-indicator";
scrollIndicator.innerHTML = 'Role para explorar <span class="icon">↓</span>';
document.body.appendChild(scrollIndicator);

setTimeout(() => {
  scrollIndicator.style.opacity = "0";
  setTimeout(() => {
    if (scrollIndicator.parentNode) {
      scrollIndicator.style.display = "none";
    }
  }, 1000);
}, 5000);

document.addEventListener("DOMContentLoaded", function () {
  const script = document.createElement("script");
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
  script.onload = function () {
    if (typeof initParticles === "function") {
      initParticles();
    } else {
      console.error(
        "Função initParticles não encontrada após carregar Three.js."
      );
    }
  };
  script.onerror = function () {
    console.error("Falha ao carregar Three.js da CDN.");
  };
  document.head.appendChild(script);
});

function initParticles() {
  const particleCount = 10000;
  const particleSize = 0.02;
  const particleColor = 0xffffff;

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  let isClicked = false;
  let clickIntensity = 0;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  const particlesBackgroundCanvas = document.getElementById(
    "particles-background"
  );
  if (!particlesBackgroundCanvas) {
    console.error(
      "Elemento canvas com ID 'particles-background' não encontrado."
    );
    return;
  }

  const renderer = new THREE.WebGLRenderer({
    canvas: particlesBackgroundCanvas,
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);

  const particlesGeometry = new THREE.BufferGeometry();
  const positions = [];
  const velocities = [];
  const originalPositions = [];

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 25;
    const y = (Math.random() - 0.5) * 25;
    const z = (Math.random() - 0.5) * 25;

    positions.push(x, y, z);
    originalPositions.push(x, y, z);

    velocities.push(
      (Math.random() - 0.5) * 0.003,
      (Math.random() - 0.5) * 0.003,
      (Math.random() - 0.5) * 0.003
    );
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );

  const particleMaterial = new THREE.PointsMaterial({
    color: particleColor,
    size: particleSize,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });

  const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
  scene.add(particleSystem);

  document.addEventListener("mousemove", onDocumentMouseMove);
  document.addEventListener("mousedown", onDocumentMouseDown);
  document.addEventListener("mouseup", onDocumentMouseUp);

  function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.03;
    mouseY = (event.clientY - windowHalfY) * 0.03;
  }

  function onDocumentMouseDown(event) {
    if (event.button === 0) {
      isClicked = true;
      clickIntensity = 1.0;

      const clickSceneX = (event.clientX / window.innerWidth) * 2 - 1;
      const clickSceneY = -(event.clientY / window.innerHeight) * 2 + 1;

      const currentPositions = particlesGeometry.attributes.position.array;
      for (let i = 0; i < currentPositions.length; i += 3) {
        const dx = currentPositions[i] - clickSceneX * 10;
        const dy = currentPositions[i + 1] - clickSceneY * 10;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 10) {
          const force = (1 - distance / 10) * 0.05;
          velocities[i] += dx * force;
          velocities[i + 1] += dy * force;
          velocities[i + 2] += (Math.random() - 0.5) * 0.02;
        }
      }
    }
  }

  function onDocumentMouseUp() {
    isClicked = false;
  }

  function animate() {
    requestAnimationFrame(animate);

    targetX += (mouseX - targetX) * 0.005;
    targetY += (-mouseY - targetY) * 0.005;

    particleSystem.rotation.x += 0.0002 + targetY * 0.0001;
    particleSystem.rotation.y += 0.0002 + targetX * 0.0001;

    const time = Date.now() * 0.0002;
    particleSystem.rotation.z = time * 0.02;

    const currentPositions = particlesGeometry.attributes.position.array;
    if (clickIntensity > 0) {
      clickIntensity *= 0.98;
    }

    for (let i = 0; i < currentPositions.length; i += 3) {
      currentPositions[i] += velocities[i];
      currentPositions[i + 1] += velocities[i + 1];
      currentPositions[i + 2] += velocities[i + 2];

      velocities[i] *= 0.99;
      velocities[i + 1] *= 0.99;
      velocities[i + 2] *= 0.99;

      const returnForce = 0.0005;
      velocities[i] +=
        (originalPositions[i] - currentPositions[i]) * returnForce;
      velocities[i + 1] +=
        (originalPositions[i + 1] - currentPositions[i + 1]) * returnForce;
      velocities[i + 2] +=
        (originalPositions[i + 2] - currentPositions[i + 2]) * returnForce;

      if (Math.random() < 0.01) {
        velocities[i] += (Math.random() - 0.5) * 0.002;
        velocities[i + 1] += (Math.random() - 0.5) * 0.002;
        velocities[i + 2] += (Math.random() - 0.5) * 0.002;
      }
    }

    particlesGeometry.attributes.position.needsUpdate = true;

    camera.position.z = 5 + Math.sin(time) * 0.1;

    renderer.render(scene, camera);
  }

  window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
  });

  animate();
}
