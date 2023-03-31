let gameState = "start"
function setup() {
  createCanvas(400, 600);
}

function draw() {
  if (gameState == "start") {
    startScreen()
  }
  else if (gameState == "playing") {
    playScreen()
  }
}
function startScreen() {
  background("#22A4F1")
  textFont("sans-serif")
  textSize(50)
  textAlign(CENTER, CENTER)
  text('Balloon', width / 2, 60);
  text('Game', width / 2, 110);
  textFont('sans-serif');
  textSize(18);
  fill(0);
  text('Click to play', width / 2, height / 2);
}
function playScreen() {
  frameRate(30)
  background("skyblue");
  for (let balloon of Game.balloons) {
    balloon.display();
    balloon.move(Game.score);

    if (balloon.y <= balloon.size / 2 && balloon.constructor.name != "BlackBalloon") {
      noLoop()
      clearInterval(interval);
      background("#00FFA9")
      Game.balloons.length = 0
      let finalScore = Game.score
      Game.score = " "
      textFont("sans-serif")
      fill("white")
      textSize(50)
      textAlign(CENTER, CENTER)
      text('Finish', width / 2, 60);
      text(`Your score: ${finalScore}`, width / 2, 110);
      textFont('sans-serif');
      textSize(18);
      fill(0);
      text('Click to play again', width / 2, height / 2);
    }
  }
  textSize(32)
  fill("black")
  text(Game.score, 20, 40)
  if (frameCount % 30 === 0) {
    Game.addCommonBalloon()
  }
  if (frameCount % 60 === 0) {
    Game.addUniqBalloon();
  }
  if (frameCount % 120 === 0) {
    Game.addBlackBalloon();
  }
}
function mousePressed() {
  if (gameState == "start") {
    gameState = "playing"
  }
  if (!isLooping()) {
    loop();
    Game.score = 0
    interval = setInterval(() => {
      Game.sendStats()
    }, 5000)
  }
  Game.countOfClick += 1
  Game.checkIfBalloonBurst()
}

let interval = setInterval(() => {
  Game.sendStats()
}, 5000)

class Game {
  static balloons = [];
  static score = 0;
  static countOfBlue = 0
  static countOfGreen = 0
  static countOfBlack = 0
  static countOfClick = 0

  static addCommonBalloon() {
    let CommonBalloon = new commonBalloon("blue", 50)
    this.balloons.push(CommonBalloon)
  }
  static addUniqBalloon() {
    let uniqBalloon = new UniqBalloon("green", 30)
    this.balloons.push(uniqBalloon)
  }
  static addBlackBalloon() {
    let blackBalloon = new BlackBalloon("black", 50)
    this.balloons.push(blackBalloon)
  }
  static checkIfBalloonBurst() {
    Game.balloons.forEach((balloon, index) => {
      let distance = dist(balloon.x, balloon.y, mouseX, mouseY);
      if (distance <= balloon.size / 2) {
        balloon.burst(index)
      }
    })
  }
  static sendStats() {
    const statistics = {
      score: Game.score,
      countOfBlack: this.countOfBlack,
      countOfBlue: this.countOfBlue,
      countOfGreen: this.countOfGreen,
      countOfClick: this.countOfClick,
    }

    fetch('/stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(statistics)
    })

  }
}

class commonBalloon {
  constructor(color, size) {
    this.x = random(width)
    this.y = random(height - 10, height + 50)
    this.color = color
    this.size = size
  }
  display() {
    if (!this.pop) {
      fill(this.color);
      ellipse(this.x, this.y, this.size);
      line(this.x, this.y + this.size / 2, this.x, this.y + 2 * this.size);
    }
  }
  move(score) {
    if (score < 100) {
      this.y -= 1
    }
    else if (score >= 100 && score < 200) {
      this.y -= 1.5
    }
    else if (score >= 200) {
      this.y -= 2
    }
  }
  burst(index) {
    Game.balloons.splice(index, 1)
    Game.score += 1
    Game.countOfBlue += 1
  }
}
class UniqBalloon extends commonBalloon {
  constructor(color, size) {
    super(color, size)
  }
  burst(index) {
    Game.balloons.splice(index, 1)
    Game.score += 10
    Game.countOfGreen += 1
  }
}
class BlackBalloon extends commonBalloon {
  constructor(color, size) {
    super(color, size)
  }
  burst(index) {
    Game.balloons.splice(index, 1)
    Game.score -= 10
    Game.countOfBlack += 1
  }
}