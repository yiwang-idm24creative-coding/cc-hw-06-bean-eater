let eater;    // One eater object
let timer;      // One timer object
let drops = [1000]; // Array for raindrops
let totalDrops = 0; // Total number of drops
let bgMusic;   // Background music
let dingSound;

function preload() {
  // Load the background music and the sound effect
  bgMusic = loadSound('assets/bgMusic.mp3');  // Load background music
  dingSound = loadSound('assets/ding.mp3');   // Load sound effect
}

function setup() {
  createCanvas(800,1280);
  eater = new Eater(32); // Create the catcher with a radius of 32
  timer = new Timer(300);    // Timer that goes off every 300 milliseconds
  timer.start();             // Start the timer
  
  let startButton = createButton('Start Music');
  startButton.position(10, 10);
  startButton.mousePressed(() => {
    bgMusic.loop();  // Play the background music in a loop
    startButton.hide();  // Hide button after starting music
  });
}

function draw() {
  background(0);
  
  //FROM PART 1: THE EATER
  // Update and display the catcher
  eater.setLocation(mouseX, mouseY);
  eater.display();
  
  //FROM PART 3: THE TIME
  // Generate new drops if the timer is finished
  if (timer.isFinished()) {
    drops[totalDrops] = new Drop(); // Add new drop
    totalDrops++;                   // Increment totalDrops
    if (totalDrops >= 1000) {       // Limit to 1000 drops
      totalDrops = 0;
    }
    timer.start();                  // Restart the timer
  }
  
  //FROM PART 4: THE BEANDROPS
  // Move and display all drops
  for (let i = 0; i < totalDrops; i++) {
    drops[i].move();
    drops[i].display();
    if (eater.intersect(drops[i])) {
      drops[i].caught(); 
      dingSound.play();
    }
  }
}

function playDingSound() {
  dingSound.play();  // Play the sound
  setTimeout(() => {
    dingSound.stop();  // Stop the sound after 1 second
  }, 1000); 
}

class Eater {
  constructor(tempR) {
    this.r = tempR;
    this.x = 0;
    this.y = 0;
  }

  setLocation(tempX, tempY) {
    this.x = tempX;
    this.y = tempY;
  }

  display() {
    noStroke();
    fill(252, 236, 0);
    arc(this.x, this.y, this.r * 2, this.r *2, radians(270), PI); 
  }

  intersect(d) {
    let distance = dist(this.x, this.y, d.x, d.y);
    if (distance < this.r + d.r) { 
      return true;
    } else {
      return false;
    }
  }
}

class Drop {
  constructor() {
    this.r = 8;
    this.x = random(width);
    this.y = -this.r * 4;
    this.speed = random(1, 5);
    this.isFinished = false;
  }

  move() {
    this.y += this.speed;
    if (this.y > height + this.r * 4) {
      this.isFinished = true;
    }
  }

  display() {
    noStroke();
    fill(22, 122, 2);
    ellipse(this.x, this.y, this.r * 2, this.r * 2); 
  }

  caught() {
    this.speed = 0;
    this.y = -1000; 
  }
}

class Timer {
  constructor(tempTotalTime) {
    this.totalTime = tempTotalTime;
    this.savedTime = 0;
  }

  start() {
    this.savedTime = millis(); 
  }

  isFinished() {
    let passedTime = millis() - this.savedTime;
    if (passedTime > this.totalTime) {
      return true;
    } else {
      return false;
    }
  }
}
