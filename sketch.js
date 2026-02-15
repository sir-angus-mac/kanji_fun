/*
----- Coding Tutorial by Patt Vira ----- 
Name: Intro to matter.js (with p5.js)
Video Tutorial: https://youtu.be/cLXNxn5N-2Y

Connect with Patt: @pattvira
https://www.pattvira.com/
----------------------------------------
*/
const kanaData = {
    ...window.kanaData1,
    ...window.kanaData2,
    ...window.kanaData3,
    ...window.kanaData4,
    ...window.kanaData5,
    ...window.kanaData6,
    ...window.kanaData7,
    ...window.kanaData8,
    ...window.kanaData9,
    ...window.kanaData10,
    ...window.kanaData11,
    ...window.kanaData12,
    ...window.kanaData13,
    ...window.kanaData14,
    ...window.kanaData15,
    ...window.kanaData16,
    ...window.kanaData17,
    ...window.kanaData18,
    ...window.kanaData19,
    ...window.kanaData20,
    ...window.kanaData21,
    ...window.kanaData22,
    ...window.kanaData23,
    ...window.kanaData24,
    ...window.kanaData25,
    ...window.kanaData26,
    ...window.kanaData27,
    ...window.kanaData28,
    ...window.kanaData29,
    ...window.kanaData30,
    ...window.kanaData31,
    ...window.kanaData32,
    ...window.kanaData33,
    ...window.kanaData34,
    ...window.kanaData35,
    ...window.kanaData36,
    ...window.kanaData37,
    ...window.kanaData38,
    ...window.kanaData39,
    ...window.kanaData40,
};

const {Engine, Body, Bodies, Composite} = Matter;

let engine;
let boxes = []; let ground;

function setup() {
  let c = createCanvas(windowWidth, windowHeight - 60);

  c.style('width', windowWidth + 'px');
  c.style('height', (windowHeight - 60) + 'px');

  engine = Engine.create();

  ground = new Ground(
    windowWidth / 2,
    (windowHeight - 60) - 30,   // 30px above bottom of canvas
    windowWidth,
    20
  );
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



let lastValue = "";
let ch_count = 0;
let step = 0;

const box = document.getElementById("myBox");

box.addEventListener("input", () => {
  const current = box.value;

  if (current !== lastValue) {
    ch_count = current.length;
    step = 0;  // reset step
    lastValue = current;
  }
});




const slider = document.getElementById("scaleSlider");


function mousePressed() {
  if (ch_count > 0) {
    let strokes;
    const value = document.getElementById("myBox").value;
    if (box.value[step] in kanaData) {
      strokes = kanaData[box.value[step]]["strokes"]; 
      let image;  
      image = createCharImage(strokes);
      let scale = Number(slider.value);
      let img_dim = 200 * scale;   // linear mapping

      boxes.push(new Rect(mouseX, mouseY, strokes, image, img_dim, scale));
    }
    step += 1;
    if (step >= ch_count) {
      step = 0; 
    }
  }
}
