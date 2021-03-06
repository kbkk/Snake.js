const playground = document.querySelector('canvas');
const ctx = playground.getContext('2d');
const scoreBox = document.querySelector('#scoreBox');
document.addEventListener("keydown", moveSnake);
scoreBox.addEventListener("animationend", endAnimation, false);
playground.width = 500;
playground.height = 500;

const gridSize = 20;
const snakeColor = "#ffff99";
const foodColor = "#990033";
const specialFoodColor = "#53d724";

let tileCount = playground.width / gridSize;
let velocityX = 0;
let velocityY = 0;
const trail = [];
const fruits = [];
let snakeTail = 5;
let oldX = 0, oldY = 0;

function getRandomTileCoord() {
  return Math.floor(Math.random() * tileCount);
}

let snakeX = playground.width / 2 - gridSize / 2;
let snakeY = playground.height / 2 - gridSize / 2;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawPlayground() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, playground.width, playground.height);
}

function moveSnake(ev) {

  switch (ev.keyCode) {
    case 37:
      velocityX = -1;
      velocityY = 0;
      break;
    case 38:
      //move up
      velocityX = 0;
      velocityY = -1;
      break;
    case 39:
      //move right
      velocityX = 1;
      velocityY = 0;
      break;
    case 40:
      //move down
      velocityX = 0;
      velocityY = 1;
      break;
  }

  // don't allow moving in the opposite direction
  // as it would end with suicide
  if ((velocityX !== 0 && oldX !== 0 && velocityX !== oldX)
    || (velocityY !== 0 && oldY !== 0 && velocityY !== oldY)) {
    velocityX = oldX;
    velocityY = oldY;
  }
}

function drawFruits() {
  for (let i = 0; i < fruits.length; i++) {
    const fruit = fruits[i];

    ctx.fillStyle = fruit.color;
    ctx.fillRect(fruit.x * gridSize, fruit.y * gridSize, gridSize - 2, gridSize - 2);
  }
}

function handleSnakeEat() {
  for (let i = 0; i < fruits.length; i++) {
    const fruit = fruits[i];

    if (snakeX === fruit.x && snakeY === fruit.y) {
      snakeTail += fruit.points;
      scoreBox.innerHTML = snakeTail - 5;
      scoreBox.classList.add("animated");


      fruits.splice(i, 1);

      if (getRandomInt(1, 10) === 10)
        spawnSpecialFruit();
      else
        spawnFruit();
    }
  }
}

function insideSnake(x, y) {
  for (let i = 0; i < trail.length; i++)
    if (trail[i].x === x && trail[i].y === y) return true;
  return false;
}

function getNonSnakeCoord() {
  let x, y;

  do {
    x = getRandomTileCoord();
    y = getRandomTileCoord();
  }
  while (insideSnake(x, y));

  return {x: x, y: y};
}

function spawnFruit() {
  const coord = getNonSnakeCoord();
  fruits.push({x: coord.x, y: coord.y, points: 1, color: foodColor});
}

function spawnSpecialFruit() {
  const coord = getNonSnakeCoord();
  fruits.push({x: coord.x, y: coord.y, points: 3, color: specialFoodColor});
}

function onGameOver() {
  alert("Game over! Your score: " + (snakeTail - 5) + " points. Wanna play again?");
  location.reload();
}

function drawSnake() {
  oldY = velocityY;
  oldX = velocityX;

  snakeX += velocityX;
  snakeY += velocityY;

  if (snakeX < 0) {
    snakeX = tileCount - 1;
  }
  if (snakeX > tileCount - 1) {
    snakeX = 0;
  }
  if (snakeY < 0) {
    snakeY = tileCount - 1;
  }
  if (snakeY > tileCount - 1) {
    snakeY = 0;
  }

  drawPlayground();

  ctx.fillStyle = snakeColor;

  for (let i = 0; i < trail.length; i++) {
    const {x, y} = trail[i];
    ctx.fillRect(x * gridSize, y * gridSize, gridSize - 2, gridSize - 2);

    if ((x === snakeX && y === snakeY) && (snakeX !== 0 || snakeY !== 0)) {
      ctx.fillRect(x * gridSize, y * gridSize, gridSize - 2, gridSize - 2);
      setTimeout(onGameOver, 100);
    }
  }

  trail.push({x: snakeX, y: snakeY});

  while (trail.length > snakeTail) {
    trail.shift();
  }
}
function endAnimation(){
  console.log("end animation plssss");
  scoreBox.classList.remove("animated");
}
function onGameFrame() {
  drawSnake();
  drawFruits();
  handleSnakeEat();
}

(function onGameInit() {
  spawnFruit();
  setInterval(onGameFrame, 100);
}());
