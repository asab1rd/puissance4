export const Game = class {
  maxPlayers = 2;
  constructor(numRows = 6, numCols = 7) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.players = [];
    this.gameArr = this.createGame();
  }

  addPlayers = players => {
    if (this.players.length <= this.maxPlayers) {
      players.forEach(player => {
        this.players.push(player);
      });
    }
  };
  getPlayers = () => this.players;
  getRows = () => this.numRows;
  getCols = () => this.numCols;
  createGame = () => {
    let arr = new Array(this.numRows);
    for (let i = 0; i < this.numRows; i++) {
      arr[i] = new Array(this.numCols);
      for (let j = 0; j < arr[i].length; j++) {
        arr[i][j] = null;
      }
    }
    return arr;
  };

  isCaseEmpty = (rowArr, col) => rowArr[col] === null;

  feedRow = (col, player) => {
    for (let i = this.numRows - 1; i < 0; i--) {
      if (isCaseEmpty(this.gameArr[i], col)) {
        this.gameArr[i][col] = player.color;
      }
    }
  };
  getGame = () => this.gameArr;

  toString = () => this;
};
