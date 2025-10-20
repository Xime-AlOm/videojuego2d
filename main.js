const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const audio = document.getElementById('audio');

const flowerImg = new Image();
flowerImg.src = 'assets/cempasuchil.png';

const bg = new Image();
bg.src = 'assets/fondo.jpeg';

const flowers = [];
let score = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 240; // espacio barras
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

class Flower {
  constructor() { this.reset(); }
  reset() {
    const side = Math.floor(rand(0, 4));
    const margin = 50;
    this.size = rand(40, 80);
    this.rotation = rand(0, Math.PI*2);
    this.rotationSpeed = rand(-0.03,0.03);
    this.alpha = 0;
    switch(side){
      case 0: this.x = rand(margin,canvas.width-margin); this.y=-margin; this.vx=rand(-1,1); this.vy=rand(1,2.5); break;
      case 1: this.x = rand(margin,canvas.width-margin); this.y=canvas.height+margin; this.vx=rand(-1,1); this.vy=-rand(1,2.5); break;
      case 2: this.x=-margin; this.y=rand(margin,canvas.height-margin); this.vx=rand(1,2.5); this.vy=rand(-1,1); break;
      case 3: this.x=canvas.width+margin; this.y=rand(margin,canvas.height-margin); this.vx=-rand(1,2.5); this.vy=rand(-1,1); break;
    }
  }
  update() {
    this.x += this.vx; this.y += this.vy; this.rotation += this.rotationSpeed;
    if(this.alpha<1) this.alpha+=0.02;
    if(this.x<-100||this.x>canvas.width+100||this.y<-100||this.y>canvas.height+100) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x,this.y);
    ctx.rotate(this.rotation);
    ctx.drawImage(flowerImg,-this.size/2,-this.size/2,this.size,this.size);
    ctx.restore();
  }
  isClicked(px,py){
    const dx=px-this.x, dy=py-this.y;
    return Math.sqrt(dx*dx+dy*dy)<this.size/2;
  }
}

for(let i=0;i<15;i++) flowers.push(new Flower());

canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  for(let i=flowers.length-1;i>=0;i--){
    if(flowers[i].isClicked(x,y)){
      score++;
      scoreEl.textContent=score;
      audio.currentTime=0;
      audio.play().catch(()=>{});
      flowers[i].reset();
      break;
    }
  }
});

function loop() {
  if(bg.complete) ctx.drawImage(bg,0,0,canvas.width,canvas.height);
  else { ctx.fillStyle="black"; ctx.fillRect(0,0,canvas.width,canvas.height); }
  for(const f of flowers){ f.update(); f.draw(); }
  requestAnimationFrame(loop);
}
loop();