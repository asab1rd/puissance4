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
  getPlayer1 = () => this.players[0];
  getPlayer2 = () => this.players[1];
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
    console.log(this.gameArr);
    for (let i = this.numRows - 1; i >= 0; i--) {
      if (this.isCaseEmpty(this.gameArr[i], col)) {
        this.gameArr[i][col] = {
          col: parseInt(col),
          row: i,
          player: this.actualPlayer,
        };

        // const res = this.algoTest(this.gameArr[i][col], "yellow", [], "bottom");
        if (this.win2(this.gameArr[i][col], this.actualPlayer.color)) {
          // If It's a win we update players win and we refresh the game
          this.actualPlayer.win();
          return { hasWin: true, player: this.actualPlayer };
        }
        this.changePlayer();
        return this.gameArr[i][col];
      }
    }
    return false;
  };
  getGame = () => this.gameArr;
  refreshGame = () => {
    this.gameArr = this.createGame();
    this.changePlayer();
  };
  toString = () => this;
  changePlayer = () => {
    this.actualPlayer =
      this.actualPlayer === this.players[1] ? this.players[0] : this.players[1];
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

  /**
   * Algorithm to test If we have 4 consecutive same colors
   * starting by the given element
   * @param {object, string , array , string}
   * @returns {bool}
   */
  algoTest = (element, color, arr = [], flag = "left") => {
    if (element === null || element === undefined) {
      return false;
    }
    const x = element.col;
    const y = element.row;
    if (element.player.color == color) {
      // If the played element have the same color that the color we are looking for
      // We push the element in our array
      arr.push(element);
      if (arr.length === 4) {
        // If our array contains 4 elements, we have our four consecutive elements
        return true;
      } else if (arr.length === 3) {
        // If array Have 3 elements, we could have played in the middle
        // We wanna make sure that we dont have an element that has the same color
        // But placed before our first element
        if (flag != "bottom") {
          // We will compare the element before our first element (stocked at arr[0])
          // The flag will be inverted ex : if we are leftwise it will be rightwise
          const compare = this.connections(arr[0], this.invertDirection(flag));
          if (
            compare != null &&
            compare != undefined &&
            compare.player.color === color
          ) {
            return this.algoTest(compare, color, arr, flag);
          }
        }
        const nextElement = this.connections(this.gameArr[y][x], flag);
        return this.algoTest(nextElement, color, arr, flag);
        // we call it with the new element
      } else {
        // The next element will be given by a method that take a flag(direction)
        // And returns the next element in that direction
        const nextElement = this.connections(this.gameArr[y][x], flag);
        return this.algoTest(nextElement, color, arr, flag);
      }
    } else {
      return false;
    }
  };

  /**
   * @param { string }
   * @returns string (direction)
   */
  invertDirection = direction => {
    console.log(direction);
    switch (direction) {
      case "left":
        direction = "right";
        break;
      case "right":
        direction = "left";
        break;
      case "topRight":
        direction = "bottomLeft";
        break;
      case "topLeft":
        direction = "topRight";
        break;
      case "bottomRight":
        direction = "topLeft";
        break;
      case "bottomLeft":
        direction = "topRight";
        break;
    }
    return direction;
  };

  /**
   * Given an element (contain its position x,y) we wanna check who is the next element,
   * If the flag is not specified or is incorrect we will return all the next elements
   * If the flag is correct, we will take it as a direction
   * @returns { object, string }
   * @returns { object }
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
