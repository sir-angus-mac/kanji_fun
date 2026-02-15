function convexHull(points) {
  points = points.map(p => ({x: p[0], y: p[1]}));

  points.sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);

  const cross = (o, a, b) =>
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

  const lower = [];
  for (let p of points) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0)
      lower.pop();
    lower.push(p);
  }

  const upper = [];
  for (let i = points.length - 1; i >= 0; i--) {
    let p = points[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0)
      upper.pop();
    upper.push(p);
  }

  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

function shrinkHull(hull, amount = 1) {
  // Compute center
  let cx = hull.reduce((s,p)=>s+p.x,0)/hull.length;
  let cy = hull.reduce((s,p)=>s+p.y,0)/hull.length;

  return hull.map(p => {
    let dx = p.x - cx;
    let dy = p.y - cy;
    let len = Math.hypot(dx, dy);
    if (len === 0) return p;

    // Move inward
    return {
      x: p.x - (dx / len) * amount,
      y: p.y - (dy / len) * amount
    };
  });
}

function expandHull(hull, amount = 1) {
  let cx = hull.reduce((s,p)=>s+p.x,0)/hull.length;
  let cy = hull.reduce((s,p)=>s+p.y,0)/hull.length;

  return hull.map(p => {
    let dx = p.x - cx;
    let dy = p.y - cy;
    let len = Math.hypot(dx, dy);
    if (len === 0) return p;

    return {
      x: p.x + (dx / len) * amount,
      y: p.y + (dy / len) * amount
    };
  });
}

function shrinkAmountFor(strokeCount) {
  if (strokeCount >= 7) {
    // Complex kanji → smaller borders
    return Math.round(Math.pow(strokeCount, 1.4));
  }

  // Simple characters → bigger borders
  // Boost the low end so kana don’t look tiny
  return Math.round(20 + Math.pow(strokeCount, 1.8));
}

class Rect {
  constructor(x, y, strokes, img, scale = 0.5) {
    this.img = img;

    // Flatten strokes
    let all = strokes.flat(); 

    let strokeCount = strokes.length;
    let shrink = shrinkAmountFor(strokeCount);

    // Use Matter.js built-in hull
    let hull = convexHull(all);
    hull = expandHull(hull, shrink); // adjust this number

    // Center + scale
    let cx = hull.reduce((s,p)=>s+p.x,0)/hull.length;
    let cy = hull.reduce((s,p)=>s+p.y,0)/hull.length;

    let verts = hull.map(p => ({
      x: (p.x - cx) * scale,
      y: (p.y - cy) * scale
    }));

    this.body = Bodies.fromVertices(x, y, verts, {
      friction: 0.8,
      restitution: 0.2
    }, true);

    Composite.add(engine.world, this.body);
  }

  display() {
  let pos = this.body.position;
  let angle = this.body.angle;

  push();
  translate(pos.x, pos.y);
  rotate(angle);

  // Draw the image
  imageMode(CENTER);
  image(this.img, 0, 0, 100, 100); 

  // // Draw border
  // noFill();
  // stroke(255, 0, 0);   // red border
  // strokeWeight(2);

  // beginShape();
  // for (let v of this.body.vertices) {
  //   vertex(v.x - pos.x, v.y - pos.y);
  // }
  // endShape(CLOSE);

  pop();
}
}