/*
----- Coding Tutorial by Patt Vira ----- 
Name: Intro to matter.js (with p5.js)
Video Tutorial: https://youtu.be/cLXNxn5N-2Y

Connect with Patt: @pattvira
https://www.pattvira.com/
----------------------------------------
*/

const {Engine, Body, Bodies, Composite} = Matter;

let engine;
let boxes = []; let ground;

function setup() {
  createCanvas(400, 400);
  engine = Engine.create();
 
  ground = new Ground(200, 300, 400, 10);
}

function createCharImage(strokes, scale = 1, padding = 20) {
  // Flatten all points to compute bounds
  let all = strokes.flat();
  let xs = all.map(p => p[0]);
  let ys = all.map(p => p[1]);

  let minX = Math.min(...xs);
  let maxX = Math.max(...xs);
  let minY = Math.min(...ys);
  let maxY = Math.max(...ys);

  let w = (maxX - minX) * scale + padding * 2;
  let h = (maxY - minY) * scale + padding * 2;

  let gfx = createGraphics(w, h);
  gfx.stroke(0);
  gfx.strokeWeight(6);
  gfx.noFill();

  // Draw each stroke
  for (let stroke of strokes) {
    gfx.beginShape();
    for (let [x, y] of stroke) {
      gfx.vertex((x - minX) * scale + padding, (y - minY) * scale + padding);
    }
    gfx.endShape();
  }

  return gfx;
}

function draw() {
  background(220);
  Engine.update(engine);
  for (let i=0; i<boxes.length; i++) {
    boxes[i].display();
  }
  ground.display();
}

function mousePressed() {
  let strokes;
  const value = document.getElementById("myBox").value;
  strokes = kanaData[value]["strokes"]; 
  let image;
  image = createCharImage(strokes);
  boxes.push(new Rect(mouseX, mouseY, strokes, image));
}
