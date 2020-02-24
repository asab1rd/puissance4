import { Game } from "./Game.js";
import { Player } from "./Player.js";

const game = new Game(3, 7);
const player1 = new Player("player1", "red");
const player2 = new Player("player2", "yellow");
game.addPlayers([player1, player2]);
// console.log(game.getPlayers());
