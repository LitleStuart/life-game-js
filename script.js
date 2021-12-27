let interval;
let cells = [];
const CELL_SIZE = 20;

const game = document.getElementById("game");
const inputWidth = document.getElementById("width");
const inputHeight = document.getElementById("height");
if (
  document.documentElement.clientWidth < document.documentElement.clientHeight
) {
  inputWidth.value = 17;
  inputHeight.value = 25;
}
const width = Number(document.getElementById("width").value);
const height = Number(document.getElementById("height").value);
game.innerHTML = `<canvas id="world" width="${width * CELL_SIZE}" height="${
  height * CELL_SIZE
}"></canvas>`;
const world = document.getElementById("world");
const ctx = world.getContext("2d");
ctx.clearRect(0, 0, width * CELL_SIZE, height * CELL_SIZE);
ctx.strokeRect(0, 0, width * CELL_SIZE, height * CELL_SIZE);

function makeWorld() {
  cells = [];
  const width = Number(document.getElementById("width").value);
  const height = Number(document.getElementById("height").value);
  world.setAttribute("width", width * CELL_SIZE);
  world.setAttribute("height", height * CELL_SIZE);
  ctx.clearRect(0, 0, width * CELL_SIZE, height * CELL_SIZE);
  ctx.strokeRect(0, 0, width * CELL_SIZE, height * CELL_SIZE);

  for (let i = 0; i < width; i++) {
    cells[i] = [];
    for (let j = 0; j < height; j++) {
      cells[i][j] = 0;
      ctx.strokeRect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

world.onclick = (event) => {
  const x = Math.floor(event.offsetX / CELL_SIZE);
  const y = Math.floor(event.offsetY / CELL_SIZE);
  changeCell(x, y);
};

function drawCell(x, y) {
  x = Number(x);
  y = Number(y);
  if (cells[x][y]) {
    ctx.clearRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  } else {
    ctx.clearRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }
}

function changeCell(x, y) {
  x = Number(x);
  y = Number(y);
  if (cells[x][y]) {
    ctx.clearRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    cells[x][y] = 0;
  } else {
    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    cells[x][y] = 1;
  }
}

function inGoodConditionsCentralCell(x, y) {
  x = Number(x);
  y = Number(y);
  let countAliveCells = 0;
  for (let i = x - 1; i <= x + 1; i++) {
    for (let j = y - 1; j <= y + 1; j++) {
      if (i === x && j === y) continue;
      countAliveCells += cells[i][j];
    }
  }
  if (cells[x][y]) return countAliveCells >= 2 && countAliveCells <= 3;
  return countAliveCells == 3;
}

function inGoodConditionsBorderCell(x, y) {
  x = Number(x);
  y = Number(y);
  let x1 = x - 1;
  let x2 = x + 1;
  let y1 = y - 1;
  let y2 = y + 1;
  let countAliveCells = 0;
  if (x == 0) {
    x1 = cells.length - 1;
  } else if (x == cells.length - 1) {
    x2 = 0;
  }
  if (y == 0) {
    y1 = cells[0].length - 1;
  } else if (y == cells[0].length - 1) {
    y2 = 0;
  }
  countAliveCells += cells[x1][y1];
  countAliveCells += cells[x][y1];
  countAliveCells += cells[x2][y1];
  countAliveCells += cells[x1][y];
  countAliveCells += cells[x2][y];
  countAliveCells += cells[x1][y2];
  countAliveCells += cells[x][y2];
  countAliveCells += cells[x2][y2];
  if (cells[x][y]) return countAliveCells >= 2 && countAliveCells <= 3;
  return countAliveCells == 3;
}

function step() {
  const newCells = [];
  const width = cells.length;
  const height = cells[0].length;
  for (let x = 1; x < width - 1; x++) {
    newCells[x] = [];
    for (let y = 1; y < height - 1; y++) {
      newCells[x][y] = Number(inGoodConditionsCentralCell(x, y));
    }
  }
  newCells[0] = [];
  newCells[width - 1] = [];
  for (let x = 0; x < width; x++) {
    newCells[x][0] = Number(inGoodConditionsBorderCell(x, 0));
    newCells[x][height - 1] = Number(inGoodConditionsBorderCell(x, height - 1));
  }
  for (let y = 1; y < height - 1; y++) {
    newCells[0][y] = Number(inGoodConditionsBorderCell(0, y));
    newCells[width - 1][y] = Number(inGoodConditionsBorderCell(width - 1, y));
  }
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      cells[x][y] = newCells[x][y];
      drawCell(x, y);
    }
  }
}

function random() {
  const width = cells.length;
  const height = cells[0].length;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      cells[x][y] = Math.round(Math.random());
      drawCell(x, y);
    }
  }
}

function start() {
  clearInterval(interval);
  interval = setInterval(step, 300);
}

function stop() {
  clearInterval(interval);
}
