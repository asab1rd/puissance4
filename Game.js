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

        // const res = this.algoTest(this.gameArr[i][col], "yellow", [], "bottom");
        console.log(this.win2(this.gameArr[i][col], "yellow"));
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
  win2 = (element, color) => {
    let hasWin = {};
    const flags = [
      "left",
      "right",
      "bottom",
      "topRight",
      "topLeft",
      "bottomLeft",
      "bottomRight",
    ];
    hasWin = flags.some(flag => {
      return this.algoTest(element, color, [], flag);
    });
    return hasWin;
  };
  algoTest = (element, color, arr = [], flag = "left") => {
    if (element === null || element === undefined) {
      return false;
    }
    const x = element.col;
    const y = element.row;
    if (element.player.color == color) {
      arr.push(element);
      if (arr.length === 4) {
        return true;
      } else {
        const nextElement = this.connections(this.gameArr[y][x], flag);
        return this.algoTest(nextElement, color, arr, flag);
      }
    } else {
      return false;
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
