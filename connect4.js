/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let Width = 7;
let Height = 6;
let winningPieces;
let fullColumn = new Set();
const makeHTML = (HTMLtype, HTMLclass) => {
  const HTMLelement = document.createElement(HTMLtype);
  HTMLelement.classList.add(HTMLclass);
  return HTMLelement;
};
let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

//Creates an array filled with a null for number of Width
const createWidth = (num) => {
  let widthArr = [];
  for (let i = 1; i <= num; i++) widthArr.push(null);
  return widthArr;
};

// TODO: set "board" to empty Height x Width matrix array
//Creates an empty array for number of Height
//Runs createWidth for each empty array, created nested null arrays
/* Output will look like (if width is 3 and height 4):
board = [
  [null,null,null],
  [null,null,null],
  [null,null,null],
  [null,null,null]
]
*/
const makeBoard = () => {
  for (let i = 0; i < Height; i++) board.push(createWidth(Width));
  return board;
};
/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
  const htmlBoard = document.getElementById("board");
  //Creates a row above the gameboard to handle user interaction/placing game pieces.
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  //Creates the columns of gameboard, by adding one column(td) for Width
  for (let x = 0; x < Width; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  //Creates a row with a cell(td) for each column. And Creates a row for each number in Height.
  //Each cell has an ID based on X,Y coordinate
  for (let y = 0; y < Height; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < Width; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
};

/** findSpotForCol: given column x, return top empty y (null if filled) */
//board[y][x]

const findSpotForCol = (x) => {
  //Start iterating from bottom of board up, looking for first null slot
  for (let y = Height - 1; y >= 0; y--) {
    if (board[y][x] === null) {
      board[y][x] = currPlayer;
      //if y is 0, that is the last slot of that column. Add the filled column to fullColumn Set
      if (y === 0) fullColumn.add(x);
      return y;
    }
  }
  //If function iterates through entire column, and there is no empty slots, return null
  return null;
};

// Creates a div element (to represent a game piece) and places in given coordinates
const placeInTable = (y, x) => {
  const newPiece = makeHTML("div", "piece");
  const position = document.getElementById(`${y}-${x}`);
  if (currPlayer === 1) newPiece.style.backgroundColor = "red";
  if (currPlayer === 2) newPiece.style.backgroundColor = "blue";
  position.append(newPiece);
};

/** endGame: announce game end */

const endGame = (msg) => {
  alert(msg);
};

/** handleClick: handle click of column top to play piece */

const handleClick = (evt) => {
  //Prevents placing additonal pieces after game has finished
  if (!checkForWin() && fullColumn.size !== Width) {
    // get x 'coordinate' from ID of clicked cell
    let x = +evt.target.id;

    // get next spot in column (if column full, ignore click)
    let y = findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    // TODO: add line to update in-memory board
    placeInTable(y, x);

    // check for win
    //checkForWin function returns an array of the winning pieces, an empty array if there was no winner
    if (checkForWin()) {
      //Grabs winning pieces, selects the containing cell, and sets background color. To show user winning pieces.
      for (let x = 0; x < winningPieces.length; x++) {
        document.getElementById(
          `${winningPieces[x][0]}-${winningPieces[x][1]}`
        ).style.backgroundColor = "gold";
      }

      return endGame(`Player ${currPlayer} won!`);
    }
    // check for tie
    //if fullColumn has collected every x coordinate, the board is filled
    if (fullColumn.size === Width) return endGame(`Draw!`);
    // switch players
    currPlayer === 1 ? (currPlayer = 2) : (currPlayer = 1);
  }
};

/** checkForWin: check board cell-by-cell for "does a win start here?" */
//returns an array of the winning pieces

const checkForWin = () => {
  const _win = (cells) => {
    //horiz/vert/diagDR/diagDL will be passed as 'cells'
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      //checks for bounds of board and if pieces are currPlayer's
      //returns boolean
      ([y, x]) =>
        y >= 0 &&
        y < Height &&
        x >= 0 &&
        x < Width &&
        board[y][x] === currPlayer
    );
  };

  for (let y = 0; y < Height; y++) {
    for (let x = 0; x < Width; x++) {
      //Creates a variable that represents four pieces left-to-right
      let horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      //Creates a variable that represents four pieces up and down
      let vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      //creates a variable that represents four pieces down-left to up-right
      let diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      //creates a variable the represents four pieces down-right to up-right
      let diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];
      //filter + _win function creates a nested array, [0] is to un-nest
      winningPieces = [horiz, vert, diagDR, diagDL].filter(
        (fourCells) => _win(fourCells) === true
      )[0];
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
};

const resetGame = () => {
  let pieces = document.querySelectorAll(".piece");
  for (let x = 0; x < pieces.length; x++) pieces[x].remove();
  currPlayer = 1;
  board.length = 0;
  fullColumn.clear();
  makeBoard();
};
makeBoard();
makeHtmlBoard();
