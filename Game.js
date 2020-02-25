export const Game = class {
  maxPlayers = 2;
  constructor(numRows = 6, numCols = 7) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.players = [];
    this.actualPlayer = null;
    this.gameArr = this.createGame();
  }

  addPlayers = players => {
    this.actualPlayer = players[1];
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
  generateHtmlFromGame = () => {};
  isCaseEmpty = (rowArr, col) => rowArr[col] === null;

  /**
   * WILL FEED A "Round" if it is empty, or will feed the round just above
   */
  feedRow = col => {
    for (let i = this.numRows - 1; i >= 0; i--) {
      if (this.isCaseEmpty(this.gameArr[i], col)) {
        this.gameArr[i][col] = this.actualPlayer.color;
        this.changePlayer();
        return { col: col, row: i };
      }
    }
    return false;
  };
  getGame = () => this.gameArr;

  toString = () => this;
  changePlayer = () => {
    this.actualPlayer =
      this.actualPlayer === this.players[1] ? this.players[0] : this.players[1];
  };
  /**
   * To test With my inputs
   */
  totoString = () => {
    let string = "";
    for (let i = 0; i < this.numRows; i++) {
      string += "<p>";
      for (let j = 0; j < this.numCols; j++) {
        string += this.gameArr[i][j] === null ? "null" : this.gameArr[i][j];
        string += " ";
      }
      string += "</p>";
    }
    return string;
  };
};
