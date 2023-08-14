/*---- constants ----*/
const DEFAULTTURN = -1;
/*---- state variables ----*/
const players = {
  X: "",
  O: "",
};
let turn,
  board,
  winner = -1,
  turnCount = 0;
updateId = 1;
/*---- cached elements ----*/
const messagePane = document.getElementById("message");
const alertPane = document.getElementById("alert");
const gameBoard = document.getElementById("gameplay");
const infoPane = document.getElementById("infopane");
const controlButton = document.getElementById("control");
/*---- functions ----*/
const createAlert = (msg, position) => {
  if (msg == "reset") {
    messagePane.innerHTML = "&nbsp;";
    alertPane.innerHTML = "&nbsp";
  }
  switch (position) {
    case "alert":
      alertPane.innerText = msg;
      break;
    default:
      messagePane.innerText = msg;
      break;
  }
};
const gameOver = () => {
  if (winner != -1) {
    controlButton.innerText = "Play Again";
    controlButton.style.visibility = "visible";
    return true;
  }
  return false;
};
const playTurn = (e) => {
  checkPositions(e.target.dataset.row, e.target.dataset.column);
  if (gameOver()) {
    createAlert(
      `We already have a winner. Player ${turn} in ${turnCount} turns.`,
      "message"
    );
    return;
  }
  if (board[e.target.dataset.row][e.target.dataset.column] != 0) {
    createAlert(`Someone already played this position`, "message");
    return;
  }
  board[e.target.dataset.row][e.target.dataset.column] = turn;
  e.target.classList.add(turn);
  if (checkPositions(e.target.dataset.row, e.target.dataset.column)) {
    if (gameOver()) {
      createAlert(
        `We have a winner. Player ${turn} in ${turnCount} turns.`,
        "message"
      );
      return;
    }
  } else if (checkForTie()) {
    winner = "T";
    gameOver();
    createAlert(`We have a tie. Play Again?`, "message");

    return;
  } else {
    turnCount++;
    switchTurns();
  }
};
const checkForTie = () => {
  let count = 0;
  board.forEach((row, i) => {
    row.forEach((gamePosition, j) => {
      if (gamePosition != 0) count++;
    });
  });
  console.log(`Not a tie. ${count} positions played.`);
  if (count == 9) return true;
  return false;
};
const switchTurns = () => {
  turn == "X" ? (turn = "O") : (turn = "X");
  let currentPlayer = turn;
  createAlert(`It's Player ${currentPlayer}'s turn`, "message");
};
const render = () => {
  gameBoard.innerHTML = "&nbsp;";
  board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  board.forEach((row, i) => {
    row.forEach((gamePosition, j) => {
      let position = document.createElement("div");
      position.classList.add("game-position");
      position.id = `r${i}c${j}`;
      position.dataset.row = i;
      position.dataset.column = j;
      gameBoard.appendChild(position);
    });
  });
  resetTurn();
  switchTurns();
};
const resetTurn = () => {
  turn = `X`;
  turnCount = 0;
  winner = -1;
  controlButton.style.visibility = "hidden";
};
const adjacent = (row, column) => {
  if (row > 2 || row < 0 || column > 2 || column < 0) return;
  let count = 0,
    rCount = 2,
    value = board[row][column];
  if (value == 0) return false;
  // diagonal left to right
  for (let i = 0; i <= 2; i++) {
    if (board[i][i] == value) count++;
    //console.log("tests the board, diagonal left bottom to right top")
    if (count == 3) return true;
  }
  // diagonal right top to left bottom
  count = 0;
  for (let i = 0; i <= 2; i++) {
    if (board[i][rCount] == value) count++;
    rCount--;
  }
  //console.log("tests the board, diagonal right top to left bottom")
  if (count == 3) return true;

  //horizontal north of the board
  for (let i = 0; i <= 2; i++) {
    count = 0;
    for (let j = 2; j >= 0; j--) {
      if (board[j][i] == value) count++;
    }
    //console.log("tests the board, horizontal north")
    if (count == 3) return true;
  }
  //vertical left of the board
  for (let i = 0; i <= 2; i++) {
    count = 0;
    for (let j = 2; j >= 0; j--) {
      if (board[i][j] == value) count++;
    }
    //console.log("tests the board, vertical left")
    if (count == 3) return true;
  }
};
const checkPositions = (row, column) => {
  if (adjacent(row, column)) {
    winner = turn;
    return true;
  }
  return false;
};

const init = () => {
  render();
};
init();
/*---- event listeners ----*/
gameBoard.addEventListener("click", playTurn);
controlButton.addEventListener("click", render);
