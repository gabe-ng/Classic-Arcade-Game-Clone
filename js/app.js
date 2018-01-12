// random integer generator - credits: https://gist.github.com/alfredwesterveld/8864936
const randomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
};

//arrays to store possible obstacle poisitions
let obstacleXPosition = [0, 100, 200, 300, 400, 500, 600]
let obstacleYPosition = [130, 215, 300, 380, 465]

//arrays to hold players previous X, Y positions
let prevX = [];
let prevY = [];

//determines if game is over
let win = false;

//sound variables and functions
let splash = 'splash';
let rescue = 'rescued';
let blocked = 'rock';
let caught = 'shark';
let congrats = 'tada';
let background = 'ocean';

function loadSounds() {
  createjs.Sound.registerSound('sounds/splash.wav', splash);
  createjs.Sound.registerSound('sounds/rescued.wav', rescue);
  createjs.Sound.registerSound('sounds/rock.mp3', blocked);
  createjs.Sound.registerSound('sounds/shark.wav', caught);
  createjs.Sound.registerSound('sounds/tada.wav', congrats);
  createjs.Sound.registerSound('sounds/ocean.wav', background);

};

function playSplash() {
  createjs.Sound.play(splash);
};

function playRescue() {
  createjs.Sound.play(rescue);
};

function playBlocked() {
  createjs.Sound.play(blocked);
};

function playCaught() {
  createjs.Sound.play(caught);
};

function playCongrats() {
  createjs.Sound.play(congrats);
};

function stopCongrats() {
  createjs.Sound.stop(congrats);
}

function playBackground() {
  createjs.Sound.play(background);
};

function stopBackground() {
  createjs.Sound.stop(background);
}

//loads all sounds
loadSounds();

// enemies our player must avoid
class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = randomInt(110, 220);
    this.sprite = 'images/shark-fin.png';
    this.spriteHeight = 90;
    this.spriteWidth = 150;
  }

  // update the enemy's position
  // parameter: dt, a time delta between ticks
  // dt ensures the game runs at the same speed for all computers
  update(dt) {
    this.x += this.speed * dt;
    if (this.x > 725) {
      this.x = 0;
    }
  }

  // draws enemy characters
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.spriteHeight, this.spriteWidth);
  }
};

class FastEnemy extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.speed = randomInt(275, 350);;
  }

};


class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.referenceY = y;
    this.lives = 3;
    this.up = true;
    this.face = 50;
    this.row = 7;
    this.col = 3;
    this.sprite = 'images/char-boy.png';
  }

  // updates player position and checks for collisions
  // parameter: dt, a time delta between ticks
  // dt ensures the game runs at the same speed for all computers
  update(dt) {
    this.checkEnemyCollision();
    this.checkObstacleCollision();
  }


  // draws player
  render() {
    //checks to see if game is over or not
    (!win) ?
    (ctx.drawImage(Resources.get(this.sprite), this.x, this.y)) :
    (ctx.drawImage(Resources.get(this.sprite), this.x, this.y), playerWon())
  }

  // method that controls player movement
  handleInput(key) {
    this.currentPosition();
    switch (key) {
      case 'left':
        player.x -= 100;
        this.boundary();
        this.col--;
        if (player.y < 555) {
          playSplash();
        };
        break;
      case 'up':
        player.y -= 85;
        //check for score
        this.scored();
        this.row--;
        if (player.y < 555) {
          playSplash();
        };
        break;
      case 'right':
        player.x += 100;
        this.boundary();
        this.col++;
        if (player.y < 555) {
          playSplash();
        };
        break;
      case 'down':
        player.y += 85;
        this.boundary();
        this.row++;
        if (player.y < 555) {
          playSplash();
        };
        break;
      case 'enter':
        if (win = true) {
          gameReset();
        }
    }
  };

  // prevent player from leaving the game canvas
  boundary() {
    if (player.x < 0) {
      player.x = 0;
      console.log('Player can\'t go past this point');
    } else if (player.x > 610) {
      player.x = 600;
      console.log('Player can\'t go past this point');
    } else if (player.y > 580) {
      player.y = 570;
      console.log('Player can\'t go past this point');
    }
  }

  checkEnemyCollision() {
    for (var e = 0; e < allEnemies.length; e++) {
      if (allEnemies[e].x < player.x + 50 &&
        allEnemies[e].x + 50 > player.x &&
        allEnemies[e].y < player.y + 40 &&
        40 + allEnemies[e].y > player.y) {
        player.died();
      }
    }
  }


  // check to see if player reaches the water
  scored() {
    if (player.y < 120) {
      console.log('Player rescued a friend!')
      player.resetPosition();
      allObstacles.forEach(function(obstacles) {
        obstacles.positionReset();
      });
      // removes a captured friend
      capturedFriends.pop();
      // turns the caputred friend into a freed friend
      if (freedFriends.length === 0) {
        freedFriends.push(freedFriend1);
      } else if (freedFriends.length === 1) {
        freedFriends.push(freedFriend2);
      } else if (freedFriends.length === 2) {
        freedFriends.push(freedFriend3);
      } else if (freedFriends.length === 3) {
        freedFriends.push(freedFriend4);
      };
      // checks to see if all friends are rescued and game is over
      if (capturedFriends.length === 0) {
        win = true;
      }
      playRescue();
    }
  }

  died() {
    console.log('Shark food!')
    player.resetPosition();
    playCaught();
  }

  //resets the player to initial position
  resetPosition() {
    player.x = 300;
    player.y = 555;
    player.row = 7;
    player.col = 3;
  }

  //captures the player's previous position
  currentPosition() {
    prevX.pop();
    prevX.push(this.x);
    prevY.pop();
    prevY.push(this.y);
  }
  //function used by obstacles to stop movement
  stopMove() {
    this.x = prevX[0];
    this.y = prevY[0];
  }

  checkObstacleCollision() {
    for (var o = 0; o < allObstacles.length; o++) {
      if (allObstacles[o].x < player.x + 75 &&
        allObstacles[o].x + 75 > player.x &&
        allObstacles[o].y < player.y + 40 &&
        40 + allObstacles[o].y > player.y) {
        console.log('Path is blocked!');
        player.stopMove();
        playBlocked();
      }
    }
  }
};

class Obstacle {
  constructor(image) {
    this.x = obstacleXPosition[Math.floor(Math.random() * obstacleXPosition.length)];
    this.y = obstacleYPosition[Math.floor(Math.random() * obstacleYPosition.length)];
    this.sprite = image;
    this.spriteHeight = 80;
    this.spriteWidth = 100;
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.spriteWidth, this.spriteHeight);
  }
  update(dt) {

  }
  // resets the poisitons everytime a friend is rescued
  positionReset() {
    this.x = obstacleXPosition[Math.floor(Math.random() * obstacleXPosition.length)];
    this.y = obstacleYPosition[Math.floor(Math.random() * obstacleYPosition.length)];
    this.render();
  }
};

class Friend {
  constructor(x, y, image) {
    this.x = x;
    this.y = y;
    this.sprite = image;
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  update(dt) {

  }

};

// clears game board and congradulates player
function playerWon() {
  allEnemies = [];
  allObstacles = [];

  ctx.fillStyle = 'rgb(9, 246, 246)';
  ctx.font = 'bold 36pt Pirata One';
  ctx.textAlign = 'center';
  ctx.fillText('CONGRATULATIONS!', 353, 363);
  ctx.font = 'bold 23pt Pirata One';
  ctx.fillText('Press Enter to Play Again!', 353, 440);
  ctx.lineWidth = 1;

  playCongrats();
  setTimeout(stopCongrats, 6000);
};

// resets game to start state
function gameReset() {
  allEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6];
  allObstacles = [rock1, rock2, rock3, rock4, rock5, rock6];
  capturedFriends = [capturedFriend1, capturedFriend2, capturedFriend3, capturedFriend4];
  freedFriends = [];
  win = false;
  stopBackground();
  setTimeout(playBackground, 1500);
};

// instantiate objects
let player = new Player(300, 555);

let capturedFriend1 = new Friend(150, 25, 'images/char-cat-girl-sad.png')
let capturedFriend2 = new Friend(250, 25, 'images/char-pink-girl-sad.png')
let capturedFriend3 = new Friend(350, 25, 'images/char-princess-girl-sad.png')
let capturedFriend4 = new Friend(450, 25, 'images/char-horn-girl-sad.png')

let freedFriend1 = new Friend(0, 555, 'images/char-horn-girl.png');
let freedFriend2 = new Friend(100, 555, 'images/char-princess-girl.png');
let freedFriend3 = new Friend(500, 555, 'images/char-pink-girl.png');
let freedFriend4 = new Friend(600, 555, 'images/char-cat-girl.png');

let rock1 = new Obstacle('images/sea-rock.png');
let rock2 = new Obstacle('images/sea-rock.png');
let rock3 = new Obstacle('images/sea-rock.png');
let rock4 = new Obstacle('images/sea-rock2.png');
let rock5 = new Obstacle('images/sea-rock2.png');
let rock6 = new Obstacle('images/sea-rock2.png');

let enemy1 = new Enemy(10, 140);
let enemy2 = new Enemy(10, 215);
let enemy3 = new Enemy(10, 300);
let enemy4 = new Enemy(10, 385);
let enemy5 = new FastEnemy(300, 215);
let enemy6 = new FastEnemy(300, 385);

// arrays holding all objects
let allEnemies = [enemy1, enemy2, enemy3, enemy4, enemy5, enemy6];
let allObstacles = [rock1, rock2, rock3, rock4, rock5, rock6];
let capturedFriends = [capturedFriend1, capturedFriend2, capturedFriend3, capturedFriend4]
let freedFriends = [];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    13: 'enter',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
