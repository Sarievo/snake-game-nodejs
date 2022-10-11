const prompt = require("prompt-sync")({ sigint: true });
const { getSize } = require("./util.js");
const readlineModule = require("readline");
readlineModule.emitKeypressEvents(process.stdin);

const size = getSize(4);
console.log("Matrix size is: ", size);
// 0 := blank, 1 := snake

// default head and tail pos
const initColPos = size >> 1;
let queue = [];
for (let i = 0; i < 3; ++i) {
  // queue.push([0, initColPos])
  queue.unshift([i, initColPos]);
  // matrix[i][initColPos] = 1;
}

const validate = (x, y) => {
  for (const [snakeX, snakeY] of queue) {
    if (snakeX === x && snakeY === y) return false;
  }
  return true;
};

const generateApple = () => {
  let cand = [];
  for (let i = 0; i < size; ++i) {
    for (let j = 0; j < size; ++j) {
      if (validate(i, j)) cand.push([i, j]);
    }
  }
  const index = Math.floor(Math.random() * cand.length);
  return cand[index];
};

let [appleX, appleY] = generateApple();
const getRepr = () => {
  // 0 - SPACE
  // 1 - SNAKE
  // 2 - APPLE
  let matrix = Array(size)
    .fill(0)
    .map(() => Array(size).fill(0));
  matrix[appleX][appleY] = 2;
  for (const [x, y] of queue) matrix[x][y] = 1;
  return matrix;
};

const charTable = ["⬜", "⬛", "🍎"];
const renderMatrix = () => {
  console.clear();
  console.log("- Press [ESC] to Exit -");
  console.log(`Going ${to}...`);
  const matrix = getRepr();
  for (const line of matrix) {
    for (const sym of line) process.stdout.write(charTable[sym]);
    process.stdout.write("\n");
  }
  // console.log(queue.join(':'));
  console.log(`Apple position: [${appleX}, ${appleY}]`);
};

let to = "down";

renderMatrix();

setInterval(() => {
  let top = queue[0];
  // let last = queue[queue.length - 1];

  const checkColide = (nX, nY) => {
    for (const [x, y] of queue) {
      if (x === nX && y === nY) {
        console.log("You collide into yourself!");
        process.exit(1);
      }
    }
  };

  let nX, nY;
  if (to === "up") {
    [nX, nY] = [top[0] - 1, top[1]];
    checkColide(nX, nY);
    queue.unshift([nX, nY]);
  } else if (to === "right") {
    [nX, nY] = [top[0], top[1] + 1];
    checkColide(nX, nY);
    queue.unshift([nX, nY]);
  } else if (to === "left") {
    [nX, nY] = [top[0], top[1] - 1];
    checkColide(nX, nY);
    queue.unshift([nX, nY]);
  } else if (to === "down") {
    [nX, nY] = [top[0] + 1, top[1]];
    checkColide(nX, nY);
    queue.unshift([nX, nY]);
  }

  if (nX < 0 || nX >= size || nY < 0 || nY >= size) {
    console.log("You hit a boundary!");
    process.exit(1);
  }

  if (queue.length === size * size) {
    renderMatrix();
    console.log("- You Win -");
    process.exit(1);
  }

  if (nX === appleX && nY === appleY) {
    [appleX, appleY] = generateApple();
  } else {
    queue.pop();
  }
  renderMatrix();
}, 400);

process.stdin.setRawMode(true);
process.stdin.on("keypress", (_, key) => {
  // console.log(key)
  if (key.name === "escape") {
    process.exit();
  }
  // console.log(key)
  const directions = new Set(["up", "right", "left", "down"]);
  if (directions.has(key.name)) to = key.name;
});
