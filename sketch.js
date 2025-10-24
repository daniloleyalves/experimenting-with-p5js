let particles = [];
let numParticles = 800; // Reduced from 2000
let time = 0;
let treePoints = [];
let rootPosition = { x: 0, y: 0 }; // Will be set in setup
let treeGrowth = 0; // Growth progress from 0 to 1
let growthRate = 0.0008; // How fast the tree grows (adjust this for speed)

class Particle {
  constructor(startProgress = 0) {
    // Start from actual root position (bottom center of tree)
    this.x = rootPosition.x + random(-5, 5);
    this.y = rootPosition.y + random(-5, 5);
    this.history = [];
    this.maxHistory = floor(random(10, 25)); // Reduced trail length

    // Expanded to 16 branch types for more fullness
    this.branchType = floor(random(0, 16));
    this.branchVariation = random(0.7, 1.3);
    this.age = startProgress;

    // 75% settle into tree, 25% circulate
    this.settled = false;
    this.settlePoint = null;
    this.shouldSettle = random() < 0.75;

    // Don't prepopulate - let the tree grow naturally
  }

  reset() {
    // Return to root position
    this.x = rootPosition.x + random(-5, 5);
    this.y = rootPosition.y + random(-5, 5);
    this.history = [];
    this.age = 0;
    this.settled = false;
    this.settlePoint = null;
    this.branchType = floor(random(0, 16));
    this.branchVariation = random(0.7, 1.3);
    this.shouldSettle = random() < 0.75;
  }

  updatePosition() {
    // If settled, stay in place and gently sway
    if (this.settled && this.settlePoint) {
      let sway = sin(time * 2 + this.settlePoint.x * 0.1) * 2;
      this.x = this.settlePoint.x + sway;
      this.y =
        this.settlePoint.y + cos(time * 1.5 + this.settlePoint.y * 0.1) * 1;
      return;
    }

    let progress = map(this.y, rootPosition.y, height * 0.05, 0, 1);
    progress = constrain(progress, 0, 1);

    // Scale the tree size based on growth
    // Sapling starts at 20% size, grows to 100%
    let sizeScale = map(treeGrowth, 0, 1, 0.2, 1.0);

    let targetX = 0;
    let targetY = height * 0.1;

    // 16 branch types for a much fuller tree
    // All branch distances are scaled by growth
    switch (this.branchType) {
      case 0: // Main trunk
        targetX = 0;
        targetY = lerp(rootPosition.y * 0.95, height * 0.08, treeGrowth);
        break;
      case 1: // Left main branch
        targetX = -280 * progress * this.branchVariation * sizeScale;
        targetY =
          lerp(rootPosition.y * 0.9, height * 0.28, treeGrowth) +
          sin(progress * PI) * 70 * sizeScale;
        break;
      case 2: // Right main branch
        targetX = 280 * progress * this.branchVariation * sizeScale;
        targetY =
          lerp(rootPosition.y * 0.9, height * 0.28, treeGrowth) +
          sin(progress * PI) * 70 * sizeScale;
        break;
      case 3: // Upper left branch
        targetX = -220 * progress * this.branchVariation * sizeScale;
        targetY =
          lerp(rootPosition.y * 0.85, height * 0.12, treeGrowth) +
          cos(progress * PI * 0.5) * 50 * sizeScale;
        break;
      case 4: // Upper right branch
        targetX = 220 * progress * this.branchVariation * sizeScale;
        targetY =
          lerp(rootPosition.y * 0.85, height * 0.12, treeGrowth) +
          cos(progress * PI * 0.5) * 50 * sizeScale;
        break;
      case 5: // Center-left branch
        targetX = -140 * progress * this.branchVariation * sizeScale;
        targetY =
          lerp(rootPosition.y * 0.88, height * 0.22, treeGrowth) +
          sin(progress * TWO_PI) * 40 * sizeScale;
        break;
      case 6: // Center-right branch
        targetX = 140 * progress * this.branchVariation * sizeScale;
        targetY =
          lerp(rootPosition.y * 0.88, height * 0.22, treeGrowth) +
          sin(progress * TWO_PI) * 40 * sizeScale;
        break;
      case 7: // Far left branch
        targetX = -340 * progress * this.branchVariation * sizeScale;
        targetY =
          lerp(rootPosition.y * 0.92, height * 0.38, treeGrowth) +
          cos(progress * PI) * 60 * sizeScale;
        break;
      case 8: // Far right branch
        targetX = 340 * progress * this.branchVariation * sizeScale;
        targetY =
          lerp(rootPosition.y * 0.92, height * 0.38, treeGrowth) +
          cos(progress * PI) * 60 * sizeScale;
        break;
      case 9: // Upper center-left
        targetX = -100 * progress * this.branchVariation * sizeScale;
        targetY =
          lerp(rootPosition.y * 0.83, height * 0.1, treeGrowth) +
          sin(progress * PI * 1.5) * 30 * sizeScale;
        break;
      case 10: // Upper center-right
        targetX = 100 * progress * this.branchVariation * sizeScale;
        targetY =
          lerp(rootPosition.y * 0.83, height * 0.1, treeGrowth) +
          sin(progress * PI * 1.5) * 30 * sizeScale;
        break;
      case 11: // Middle spreading branch
        targetX =
          random(-180, 180) * progress * this.branchVariation * sizeScale;
        targetY =
          lerp(rootPosition.y * 0.87, height * 0.18, treeGrowth) +
          sin(progress * PI * 2) * 45 * sizeScale;
        break;
      case 12: // Lower left branch
        targetX = -260 * progress * this.branchVariation * sizeScale;
        targetY =
          lerp(rootPosition.y * 0.93, height * 0.45, treeGrowth) +
          cos(progress * PI * 0.8) * 55 * sizeScale;
        break;
      case 13: // Lower right branch
        targetX = 260 * progress * this.branchVariation * sizeScale;
        targetY =
          lerp(rootPosition.y * 0.93, height * 0.45, treeGrowth) +
          cos(progress * PI * 0.8) * 55 * sizeScale;
        break;
      case 14: // Wide left branch
        targetX = -380 * progress * this.branchVariation * sizeScale;
        targetY =
          lerp(rootPosition.y * 0.91, height * 0.32, treeGrowth) +
          sin(progress * PI * 1.2) * 50 * sizeScale;
        break;
      case 15: // Wide right branch
        targetX = 380 * progress * this.branchVariation * sizeScale;
        targetY =
          lerp(rootPosition.y * 0.91, height * 0.32, treeGrowth) +
          sin(progress * PI * 1.2) * 50 * sizeScale;
        break;
    }

    // Limit particle reach based on growth - can't go higher than tree has grown
    let maxHeight = lerp(rootPosition.y * 0.95, height * 0.05, treeGrowth);

    // Check if particle should settle into tree
    if (
      this.shouldSettle &&
      !this.settled &&
      progress > 0.15 &&
      this.y < maxHeight
    ) {
      // Higher chance to settle as it moves up (faster settling)
      // Also influenced by tree growth - more settling when tree is more mature
      if (random() < progress * 0.035 * pow(treeGrowth, 0.5)) {
        this.settled = true;
        this.settlePoint = { x: this.x, y: this.y };
        treePoints.push(this.settlePoint);
        return;
      }
    }

    let noiseVal = noise(
      this.x * 0.004,
      this.y * 0.004,
      time * 0.25 + this.branchType * 5
    );
    let angle = noiseVal * TWO_PI * 3;

    let dx = targetX - this.x;
    let dy = targetY - this.y;

    // Faster movement (increased speeds)
    let vx = cos(angle) * 2.0 + dx * 0.025;
    let vy = sin(angle) * 2.0 + dy * 0.035 - 2.2;

    this.x += vx;
    this.y += vy;
    this.age++;

    // If particle goes above growth limit, reset it
    if (this.y < maxHeight) {
      this.reset();
    }
  }

  update() {
    this.history.push({ x: this.x, y: this.y });
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    this.updatePosition();

    // Only circulating particles loop back to roots
    if (
      !this.settled &&
      (this.y < height * 0.05 || this.x < -width / 2 || this.x > width / 2)
    ) {
      this.reset();
    }
  }

  display() {
    if (this.history.length < 2) return;

    noFill();
    beginShape();

    for (let i = 0; i < this.history.length; i++) {
      let pos = this.history[i];
      let fade = i / this.history.length;
      let alpha = fade * (this.settled ? 150 : 100);

      // Settled particles glow more with warm color
      if (this.settled) {
        stroke(255, 240, 200, alpha);
        strokeWeight(fade * 2.5);
      } else {
        stroke(255, alpha);
        strokeWeight(fade * 1);
      }
      vertex(pos.x, pos.y);
    }

    endShape();

    // Draw a soft glow for settled particles
    if (this.settled && this.settlePoint) {
      fill(255, 240, 200, 40);
      noStroke();
      circle(this.settlePoint.x, this.settlePoint.y, 5);
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Set root position at bottom center
  rootPosition.x = 0;
  rootPosition.y = height * 0.9;

  // Start with just a few particles for the sapling
  let startingParticles = 50;
  for (let i = 0; i < startingParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  background(0, 0, 0, 30);

  translate(width / 2, 0);

  time += 0.015; // Slightly faster time for more dynamic growth

  // Gradually increase tree growth
  if (treeGrowth < 1.0) {
    treeGrowth += growthRate;
    treeGrowth = constrain(treeGrowth, 0, 1);

    // Add more particles as the tree grows
    let targetParticleCount = floor(lerp(50, numParticles, treeGrowth));
    while (particles.length < targetParticleCount) {
      particles.push(new Particle());
    }
  }

  // Draw particle beams - connect settled particles to form tree structure
  if (treePoints.length > 1) {
    for (let i = 0; i < treePoints.length; i++) {
      for (let j = i + 1; j < treePoints.length; j++) {
        let d = dist(
          treePoints[i].x,
          treePoints[i].y,
          treePoints[j].x,
          treePoints[j].y
        );

        // Connect points that are close enough
        if (d < 80) {
          // Calculate beam thickness based on vertical position (thicker at bottom)
          let avgY = (treePoints[i].y + treePoints[j].y) / 2;
          let heightProgress = map(avgY, rootPosition.y, height * 0.1, 0, 1);
          heightProgress = constrain(heightProgress, 0, 1);

          // Thicker beams at the base, thinner at the top
          let thickness = lerp(8, 1, heightProgress);

          // Distance fade - closer points have stronger connections
          let distanceFade = map(d, 0, 80, 1, 0.3);

          // Outer glow
          strokeWeight(thickness + 3);
          stroke(255, 240, 200, 8 * distanceFade);
          line(
            treePoints[i].x,
            treePoints[i].y,
            treePoints[j].x,
            treePoints[j].y
          );

          // Core beam
          strokeWeight(thickness);
          stroke(255, 250, 220, 35 * distanceFade);
          line(
            treePoints[i].x,
            treePoints[i].y,
            treePoints[j].x,
            treePoints[j].y
          );

          // Bright center line
          strokeWeight(thickness * 0.3);
          stroke(255, 255, 240, 80 * distanceFade);
          line(
            treePoints[i].x,
            treePoints[i].y,
            treePoints[j].x,
            treePoints[j].y
          );
        }
      }
    }
  }

  // Draw particles
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].display();
  }

  // Optional: Display growth percentage
  /*
  fill(255, 200);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  text('Tree Growth: ' + floor(treeGrowth * 100) + '%', -width/2 + 20, 20);
  text('Particles: ' + particles.length, -width/2 + 20, 40);
  text('Settled Points: ' + treePoints.length, -width/2 + 20, 60);
  */
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Update root position on resize
  rootPosition.y = height * 0.9;
  // Rebuild tree structure with new dimensions
  initializeTreeStructure();
}
