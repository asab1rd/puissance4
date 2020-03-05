(function($) {
  jQuery.fn.FourInARow = function(settings) {
    const Game = class {
      maxPlayers = 2;
      constructor(numRows = 6, numCols = 7) {
        this.numRows = numRows;
        this.numCols = numCols;
        this.players = [];
        this.actualPlayer = null;
        this.gameArr = this.createGame();
        this.lastPlayed = null;
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
            this.lastPlayed = this.gameArr[i][col];
            this.changePlayer();
            return this.gameArr[i][col];
          }
        }
        return false;
      };
      undo = () => {
        if (this.lastPlayed != null) {
          this.gameArr[this.lastPlayed.row][this.lastPlayed.row];
          this.lastPlayed = null;
        }
      };
      getGame = () => this.gameArr;
      refreshGame = () => {
        this.gameArr = this.createGame();
        this.changePlayer();
      };
      toString = () => this;
      changePlayer = () => {
        this.actualPlayer =
          this.actualPlayer === this.players[1]
            ? this.players[0]
            : this.players[1];
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
              const compare = this.connections(
                arr[0],
                this.invertDirection(flag),
              );
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
              bottomLeft:
                y + 2 > this.numRows ? null : this.gameArr[y + 1][x - 1],
              bottomRight:
                y + 2 > this.numRows ? null : this.gameArr[y + 1][x + 1],
            };
            break;
        }
      };
    };

    const Player = class {
      constructor(name, color) {
        this.name = name;
        this.color = color;
        this.numwin = 0;
      }
      win = () => {
        this.numwin++;
      };
    };
  };

  //END SETTINGS

  const game = new Game(settings.rows, settings.cols);
  const player1 = new Player(settings.player1.name, settings.player1.color);
  const player2 = new Player(settings.player2.name, settings.player2.color);
  game.addPlayers([player1, player2]);
  let actualPlayer = player1;
  const play = () => {
    let haveWinner,
      allFilled = false;
    let playedCol = null;
    const gameCols = game.getCols();

    $("#submit").click(function(e) {
      const playValue = $("#play").val();
      playedCol = playValue > 0 && playValue < gameCols ? playValue : null;
      if (playedCol != null && (!haveWinner || !allFilled)) {
        game.feedRow(playedCol);
        console.log(game.gameArr);
      }
      $("#play").val("");
      $("#array").html(game.totoString());
    });
    //   console.log(game.totoString());
  };
  // play();
  init();
  function init() {
    // APPEND MY GAME TO HTML
    for (let i = 0; i < game.getRows(); i++) {
      let div = `<div class="row" data-row="${i}">`;
      for (let j = 0; j < game.getCols(); j++) {
        div += `<span class="rounded-circle myround" data-column="${j}" data-row="${i}"> </span>`;
      }
      div += "</div>";
      $("#myGame").append(div);
    }

    // IF WE CLICK ON A CIRCLE
    $(".rounded-circle").click(function(e) {
      // console.log(game.getGame());
      e.preventDefault();
      let circle = {
        row: $(this).attr("data-row"),
        col: $(this).attr("data-column"),
      };
      console.log(game);
      // console.log(circle);
      let playedCol = null;
      const gameCols = game.getCols();
      playedCol = circle.col >= 0 && circle.col < gameCols ? circle.col : null;
      if (playedCol != null) {
        circle = game.feedRow(playedCol);
        // console.log(circle);
        const selector = `[data-row = '${circle.row}'][data-column = '${circle.col}']`;
        console.log(circle);
        $(selector).addClass(circle.player.color);
        if (circle.hasWin) {
          $("#message").html(circle.player.name + " Won");
          $("#hasWon")
            .fadeIn(1000)
            .fadeOut(1000);
          $(".rounded-circle").removeClass(
            `${game.getPlayer1().color} , ${game.getPlayer2().color}`,
          );
          game.refreshGame();
          return;
        }
      }
    });
  }
})(jQuery);
