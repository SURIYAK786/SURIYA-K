let isDrawing = false;
let startX, startY;
let boxes2D = [];

const canvas = document.getElementById('canvas2D');
const ctx = canvas.getContext('2d');
const img = document.getElementById('image2D');
const container = document.getElementById('canvasContainer');

let mode = '2D';
let scene, camera, renderer, cube;
let annotations3D = [];

img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
};

canvas.addEventListener('mousedown', (e) => {
  if (mode !== '2D') return;
  isDrawing = true;
  const rect = canvas.getBoundingClientRect();
  startX = e.clientX - rect.left;
  startY = e.clientY - rect.top;
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing || mode !== '2D') return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw2DBoxes();
  ctx.strokeStyle = 'red';
  ctx.strokeRect(startX, startY, x - startX, y - startY);
});

canvas.addEventListener('mouseup', (e) => {
  if (!isDrawing || mode !== '2D') return;
  isDrawing = false;
  const rect = canvas.getBoundingClientRect();
  const endX = e.clientX - rect.left;
  const endY = e.clientY - rect.top;
  boxes2D.push({
    x: startX,
    y: startY,
    width: endX - startX,
    height: endY - startY
  });
});

function draw2DBoxes() {
  ctx.strokeStyle = 'red';
  boxes2D.forEach(box => {
    ctx.strokeRect(box.x, box.y, box.width, box.height);
  });
}

function switchTo2D() {
  mode = '2D';
  canvas.style.display = 'block';
  img.style.display = 'block';
  if (renderer) renderer.domElement.style.display = 'none';
}

function switchTo3D() {
  mode = '3D';
  canvas.style.display = 'none';
  img.style.display = 'none';
  init3D();
  if (renderer) renderer.domElement.style.display = 'block';
}

function init3D() {
  if (renderer) return;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(800, 800);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  camera.position.z = 5;

  animate();
  // Add dummy annotation
  annotations3D.push({ x: 0, y: 0, z: 0, w: 1, h: 1, d: 1 });
}

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

function saveAnnotations() {
  const data = {
    mode,
    annotations: mode === '2D' ? boxes2D : annotations3D
  };

  fetch('/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()).then(res => {
    alert(res.message);
  });
}
