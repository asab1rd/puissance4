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
    this.actualPlayer = players[0];
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
        this.changePlayer();
        this.gameArr[i][col] = this.actualPlayer.color;
        return { col: parseInt(col), row: i };
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

  connections = (element, flag = "all") => {
    const x = element.col;
    const y = element.row;
    console.log(x, y);
    switch (flag) {
      case "left":
        return this.gameArr[y][x - 1];
        break;
      case "right":
        return this.gameArr[y][x + 1];
        break;
      case "bottom":
        return y + 2 > this.numRows ? null : this.gameArr[y + 1][x];
        break;
      case "topLeft":
        return y - 1 < 0 ? null : this.gameArr[y - 1][x - 1];
        break;
      case "topRight":
        return y - 1 < 0 ? null : this.gameArr[y - 1][x + 1];
        break;
      case "bottomLeft":
        return y + 2 > this.numRows ? null : this.gameArr[y + 1][x - 1];
        break;
      case "bottomRight":
        return y + 2 > this.numRows ? null : this.gameArr[y + 1][x + 1];
        break;
      default:
        return {
          left: this.gameArr[y][x - 1],
          right: this.gameArr[y][x + 1],
          // top: y - 1 < 0 ? null : this.gameArr[y - 1][x],
          bottom: y + 2 > this.numRows ? null : this.gameArr[y + 1][x],
          topLeft: y - 1 < 0 ? null : this.gameArr[y - 1][x - 1],
          topRight: y - 1 < 0 ? null : this.gameArr[y - 1][x + 1],
          bottomLeft: y + 2 > this.numRows ? null : this.gameArr[y + 1][x - 1],
          bottomRight: y + 2 > this.numRows ? null : this.gameArr[y + 1][x + 1],
        };
        break;
    }
  };
};
