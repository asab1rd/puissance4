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
        this.gameArr[i][col] = {
          col: parseInt(col),
          row: i,
          player: this.actualPlayer,
        };
        this.win(this.gameArr[i][col]);
        return this.gameArr[i][col];
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

  win = element => {
    let x = element.col;
    let y = element.row;
    const actualColor = element.player.color;
    let win = false;
    const stack = [];
    if (x >= 3) {
      //Left could be ok
      let match = true;
      for (let i = 1; i < 4 && match; i++) {
        const leftConnection = this.gameArr[y][x - i];
        if (
          leftConnection === null ||
          actualColor != leftConnection.player.color
        ) {
          match = false;
        }
      }
      win = match;
    } else if (this.numCols - x >= 4) {
      let match = true;
      for (let i = 1; i < 4 && match; i++) {
        const leftConnection = this.gameArr[y][x + i];
        if (
          leftConnection === null ||
          actualColor != leftConnection.player.color
        ) {
          match = false;
        }
      }
      win = match;
    }
    if (this.numRows - y >= 4) {
      let match = true;
      for (let i = 1; i < 4 && match; i++) {
        const leftConnection = this.gameArr[y + i][x];
        console.log(leftConnection);
        if (
          leftConnection === null ||
          actualColor != leftConnection.player.color
        ) {
          match = false;
        }
      }
      win = match;
    }

    if (win === true) {
      alert(this.actualPlayer + "win");
    }
  };

  /***
   *Obsolete
   */
  connections = (element, flag = "all") => {
    if (element === null) {
      return false;
    }
    const x = element.col;
    const y = element.row;
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
