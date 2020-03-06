(function($) {
  jQuery.fn.FourInARow = function(settings, id = "#myGame") {
    /**
     * Game class
     * @param {rows} numRows
     * @param {cols} numCols
     */
    const Game = class {
      maxPlayers = 2;
      constructor(numRows = 6, numCols = 7) {
        this.numRows = parseInt(numRows);
        this.numCols = parseInt(numCols);
        this.players = [];
        this.actualPlayer = null;
        this.gameArr = this.createGame();
        this.lastPlayed = null;
      }
      /**
       * Add player to the players array
       */
      addPlayers = players => {
        this.actualPlayer = players[0];
        if (this.players.length <= this.maxPlayers) {
          players.forEach(player => {
            this.players.push(player);
          });
        }
      };
      getPlayers = () => this.players;
      getPlayer1 = () => this.players[0]; //Player 1
      getPlayer2 = () => this.players[1]; //Player 2
      setPlayers = players => {
        this.players[0].numwin = players[0].numwin;
        this.players[1].numwin = players[1].numwin;
      };
      getRows = () => this.numRows; // Get Rows
      getCols = () => this.numCols; // Get Cols
      /**
       * Create Game Array
       * @return {array}
       */
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
       * @param {int} col
       * @return {object|bool}
       */
      feedRow = col => {
        col = parseInt(col);
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
            this.lastPlayed = this.gameArr[i][col];
            return this.gameArr[i][col];
          }
        }
        return false;
      };
      /**
       * Return the game array
       * @returns {array}
       */
      getGame = () => this.gameArr;
      refreshGame = () => {
        this.gameArr = this.createGame();
        this.changePlayer();
      };
      undo = () => {
        if (this.lastPlayed) {
          // console.log(this.lastPlayed);
          this.gameArr[this.lastPlayed.row][this.lastPlayed.col] = null;
          let lastPlayedHtmlElement = $(
            $(".game-row")[this.lastPlayed.row],
          ).children()[this.lastPlayed.col];
          let itsColor = $(lastPlayedHtmlElement).data("color");
          $(lastPlayedHtmlElement).removeAttr("data-color");
          $(lastPlayedHtmlElement).removeClass(itsColor);
          this.lastPlayed = null;
          this.changePlayer();
        }
      };
      updateScoreInHtml = () => {
        $("#score-player1").html(this.getPlayer1().numwin);
        $("#score-player2").html(this.getPlayer2().numwin);
      };
      updateLocalStorage = () => {
        let mygameSettings = {
          player1: this.getPlayer1(),
          player2: this.getPlayer2(),
          cols: this.numCols,
          rows: this.numRows,
        };
        localStorage.setItem("mygameHtml", $("#myGame").html());
        localStorage.setItem("mygame", JSON.stringify(this));
        localStorage.setItem("mygameSettings", JSON.stringify(mygameSettings));

        // console.log(JSON.parse(localStorage.mygame), this);
      };
      resetGame = () => {
        localStorage.clear();
        document.location.reload(true);
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
      winMsg = () => {
        return `<div class="container-fluid won-container" id="hasWon">
        <div class="row" id="message"></div>
      </div>`;
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
    /**END Class GAME */
    /**
     * Class PLAYER
     * @param {string} name
     * @param {string} color
     */
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
    /**END CLASS PLAYER */

    /**
     * GAME CREATION & Play Control
     */

    let game = new Game(settings.rows, settings.cols);
    const player1 = new Player(settings.player1.name, settings.player1.color);
    const player2 = new Player(settings.player2.name, settings.player2.color);
    game.addPlayers([player1, player2]);

    init(id);
    function init(id) {
      // APPEND MY GAME TO HTML
      for (let i = 0; i < game.getRows(); i++) {
        let div = `<div class="row game-row justify-content-around" data-row="${i}">`;
        let coco = parseInt(12 / game.getCols());
        for (let j = 0; j < game.getCols(); j++) {
          div += `<span class="rounded-circle myround col-${coco}" data-column="${j}" data-row="${i}"> </span>`;
        }
        div += "</div>";
        $(id).append(div);
        // .fadeIn(3000);
      }
      const turnHtml = `<div class="container-fluid">
          <div class="row player-container">
            <div class="play-player-container">
            <span class="player player1" id="turn-player1">Player 1</span>
            <div class="score" id="score-player1"></div>
            </div>
            <div class="play-player-container">
            <span class="player player2" id="turn-player2">Player 2</span>
            <div class="score" id="score-player2"></div>
            </div>
          </div>
          <div class="row undo-btn justify-content-around">
            <button type="button" class="btn btn-dark" id="undo"> Undo</button>
            <button type="button" class="btn btn-danger" id="reset"> ! RESET !</button>
          </div>
        </div>`;
      /**
       * TURN HTML
       */
      $(turnHtml).insertBefore(".row[data-row='0']");
      $("#turn-player1").html(settings.player1.name);
      $("#turn-player2").html(settings.player2.name);
      $("#score-player1").addClass(game.getPlayer1().color);
      $("#score-player2").addClass(game.getPlayer2().color);
      // console.log($($(".row")[0]));

      $("#settings").fadeOut(1000);
      /**
       * WE WANT TO CHECKIF WE HAVE A PLAYER IN OUR LOCALSTORAGE
       */
      if (localStorage.getItem("mygame") != undefined) {
        let localStorageGame = JSON.parse(localStorage.mygame);
        game.setPlayers(localStorageGame.players);
        game.gameArr = localStorageGame.gameArr;
        // game.changePlayer();
        if (localStorageGame.actualPlayer.name != game.actualPlayer.name) {
          game.changePlayer();
          console.log(game.actualPlayer, localStorageGame.actualPlayer);
        }

        $("#myGame")
          .html(localStorage.mygameHtml)
          .css("opacity", "1");
      } else {
        $(id).animate(
          {
            opacity: 1,
          },
          2000,
          "linear",
          () => $("#settings").remove(),
        );
      }

      game.updateScoreInHtml();
      $("#undo").click(function(e) {
        e.preventDefault();
        console.log(game.gameArr);
        game.undo();
        console.log(game.gameArr);
      });
      $("#reset").click(function(e) {
        e.preventDefault();
        game.resetGame();
      });
      // IF WE CLICK ON A CIRCLE
      $(".rounded-circle").click(function(e) {
        e.preventDefault();
        console.log(game);
        let circle = {
          row: $(this).attr("data-row"),
          col: $(this).attr("data-column"),
        };

        let playedCol = null;
        const gameCols = game.getCols();
        playedCol =
          circle.col >= 0 && circle.col < gameCols ? circle.col : null;
        if (playedCol != null) {
          circle = game.feedRow(playedCol);
          const selector = `[data-row = '${circle.row}'][data-column = '${circle.col}']`;
          $(selector).addClass(circle.player.color);
          $(selector).data("color", circle.player.color);
          // localStorage.setItem("game",)

          if (circle.hasWin) {
            $("body").append(game.winMsg());
            $("#message").html(circle.player.name + " Won");
            $("#hasWon")
              .fadeIn(2000)
              .fadeOut(2000);
            $(".rounded-circle").removeClass(
              `${game.getPlayer1().color} , ${game.getPlayer2().color}`,
            );
            game.refreshGame();
            game.updateScoreInHtml();
            // return;
          }
          game.updateLocalStorage();
        }
      });
    }
  }; //END JQ PLUGIN

  //END SETTINGS
})(jQuery);

$(function() {
  if (localStorage.mygameSettings != undefined) {
    $("#settings").remove();
    let settings = JSON.parse(localStorage.mygameSettings);
    $("#body").FourInARow(settings);
  } else {
    let settings = {
      player1: { name: "player1", color: "red-darken" },
      player2: { name: "player2", color: "yellow-darken" },
      cols: 7,
      rows: 6,
    };

    //Chose color
    $(".player1").click(function(e) {
      e.preventDefault();
      $(".player1 .chose-color").removeClass("active");
      $(e.target).addClass("active");
      settings.player1.color = $(e.target).data("color");
    });
    $(".player2").click(function(e) {
      e.preventDefault();
      $(".player2 .chose-color").removeClass("active");
      $(e.target).addClass("active");
      settings.player2.color = $(e.target).data("color");
    });

    //Submit
    $("#submit-settings").click(function(e) {
      e.preventDefault();
      if ($("#player1").val() != "") {
        settings.player1.name = $("#player1").val(); //We take his name if the input is not empty
      }
      if ($("#player2").val() != "") {
        settings.player2.name = $("#player2").val();
      }
      if ($("#setting-cols").val() != "" && $("#setting-rows").val() != "") {
        settings.cols = $("#setting-cols").val();
        settings.rows = $("#setting-rows").val();
      } //We take his name if the input is not empty
      // $("#settings").fadeOut(300);

      $("#body").FourInARow(settings);
      // $("#settings").remove();
    });
  }
});
