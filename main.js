import { Game } from "./Game.js";
import { Player } from "./Player.js";

const game = new Game(6, 7);
const player1 = new Player("player1", "red");
const player2 = new Player("player2", "yellow");
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
    // console.log(circle);
    let playedCol = null;
    const gameCols = game.getCols();
    playedCol = circle.col >= 0 && circle.col < gameCols ? circle.col : null;
    if (playedCol != null) {
      circle = game.feedRow(playedCol);
      const selector = `[data-row = '${circle.row}'][data-column = '${circle.col}']`;
      // console.log(game.actualPlayer);
      // console.log(game.getGame());
      console.log(game.connections(circle));
      $(selector).addClass(game.actualPlayer.color);
    }
  });
}
