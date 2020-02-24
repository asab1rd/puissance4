import { Game } from "./Game.js";
import { Player } from "./Player.js";

const game = new Game(3, 7);
const player1 = new Player("player1", "red");
const player2 = new Player("player2", "yellow");
game.addPlayers([player1, player2]);

const play = () => {
  let haveWinner,
    allFilled = false;
  let playedCol = null;
  const gameCols = game.getCols();

  $("#submit").click(function(e) {
    const playValue = $("#play").val();
    playedCol = playValue > 0 && playValue < gameCols ? playValue : null;
    if (playedCol != null && (!haveWinner || !allFilled)) {
      console.log(playedCol);
    }
    $("#play").val("");
  });
};
play();
