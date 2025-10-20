// Juego Caza Cempasúchil 🌼 - Día de Muertos
// Movimiento aleatorio desde distintas direcciones

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const audio = document.getElementById('audio');

const flowerImg = new Image();
flowerImg.src = 'assets/cempasuchil.jpg';

const flowers = [];
let score = 0;

// Función aleatoria
function rand(min, max) { return Math.random() * (max - min) + min; }

// Clase flor con movimiento variado
class Flower {
  constructor() {
    this.reset();
  }

  // Reiniciar flor con dirección aleatoria
  reset() {
    const side = Math.floor(rand(0, 4)); // 0: arriba, 1: abajo, 2: izquierda, 3: derecha
    const margin = 50;
    const speed = rand(1, 2.5);
    this.size = rand(40, 80);
    this.rotation = rand(0, Math.PI * 2);
    this.rotationSpeed = rand(-0.03, 0.03);
    this.alpha = 0;

    switch (side) {
      case 0: // Arriba → hacia abajo
        this.x = rand(margin, canvas.width - margin);
        this.y = -margin;
        this.vx = rand(-1, 1);
        this.vy = rand(1, 2.5);
        break;
      case 1: // Abajo → hacia arriba
        this.x = rand(margin, canvas.width - margin);
        this.y = canvas.height + margin;
        this.vx = rand(-1, 1);
        this.vy = -rand(1, 2.5);
        break;
      case 2: // Izquierda → derecha
        this.x = -margin;
        this.y = rand(margin, canvas.height - margin);
        this.vx = rand(1, 2.5);
        this.vy = rand(-1, 1);
        break;
      case 3: // Derecha → izquierda
        this.x = canvas.width + margin;
        this.y = rand(margin, canvas.height - margin);
        this.vx = -rand(1, 2.5);
        this.vy = rand(-1, 1);
        break;
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    if (this.alpha < 1) this.alpha += 0.02;

    // Salir del área → reaparecer
    if (
      this.x < -100 || this.x > canvas.width + 100 ||
      this.y < -100 || this.y > canvas.height + 100
    ) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(flowerImg, -this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }

  isClicked(px, py) {
    const dx = px - this.x;
    const dy = py - this.y;
    return Math.sqrt(dx * dx + dy * dy) < this.size / 2;
  }
}

// Crear flores iniciales
for (let i = 0; i < 12; i++) {
  flowers.push(new Flower());
}

// Manejar clics
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  for (let i = flowers.length - 1; i >= 0; i--) {
    if (flowers[i].isClicked(x, y)) {
      score++;
      scoreEl.textContent = score;
      // Reproducir audio (sonido al presionar)
      audio.currentTime = 0;
      audio.play().catch(() => {});
      flowers[i].reset();
      break;
    }
  }
});

// Animación principal
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const f of flowers) {
    f.update();
    f.draw();
  }
  requestAnimationFrame(loop);
}

loop();
