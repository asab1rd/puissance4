export const AI = class {
  constructor(game) {
    this.game = game;
  }
  ai = () => {
    for (let i = 0; i < this.game.numRows; i++) {
      for (let j = 0; j < this.game.numCols; j++) {
        if (typeof this.game.gameArr[i][j] === Object) {
        }
      }
    }
  };
};

export const helper = class {
  constructor(flag = "all") {}
  exportAll = flag => {
    const objRet = {};
    switch (flag) {
      case value:
        break;
      default:
        return objRet;
        break;
    }
  };
};
