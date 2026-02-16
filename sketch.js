/*
----- Coding Tutorial by Patt Vira ----- 
Name: Intro to matter.js (with p5.js)
Video Tutorial: https://youtu.be/cLXNxn5N-2Y

Connect with Patt: @pattvira
https://www.pattvira.com/
----------------------------------------
*/
// kanaLoader.js

// Number of JSON files
const NUM_KANA_FILES = 50;

// Build file list: kana1.json → kana50.json
const kanaJsonFiles = Array.from({ length: NUM_KANA_FILES }, (_, i) => `kana${i + 1}.json`);

// Global dictionary to hold merged kana data
window.kanaDict = {};

// Load a single JSON file
async function loadJsonFile(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
}

// Load all kana JSON files and merge them
async function loadAllKana() { 
  const results = await Promise.all(kanaJsonFiles.map(loadJsonFile));

  // Merge all dictionaries into one
  for (const dict of results) {
    Object.assign(window.kanaDict, dict);
  }

  console.log("All kana JSON loaded.");
  console.log("Total characters:", Object.keys(window.kanaDict).length);
}

// Start loading immediately
// Start loading immediately and expose the promise
window.kanaReady = loadAllKana().then(() => {
  // Reveal the canvas after loading
  const canvas = document.querySelector("canvas");
  if (canvas) {
    canvas.style.display = "block";
  }
});




const {Engine, Body, Bodies, Composite} = Matter;

let engine;
let boxes = []; let ground;

function setup() {
  let c = createCanvas(windowWidth, windowHeight - 140);

  c.style('width', windowWidth + 'px');
  c.style('height', (windowHeight - 140) + 'px');

  engine = Engine.create();

  ground = new Ground(
    windowWidth / 2,
    (windowHeight - 140) - 30,   // 30px above bottom of canvas
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
    // console.log(box.value[step]); 
    if (box.value[step] in window.kanaDict) {
      strokes = window.kanaDict[box.value[step]]["strokes"]; 
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
