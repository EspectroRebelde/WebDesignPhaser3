/**
 * Author: Michael Hadley, mikewesthad.com
 * Asset Credits:
 *  - Tileset, Michele "Buch" Bucelli (tileset artist) & Abram Connelly (tileset sponsor):
 *     https://opengameart.org/content/top-down-dungeon-tileset
 *  - Character, Michele "Buch" Bucelli:
 *      https://opengameart.org/content/a-platformer-in-the-forest
 */

import DungeonScene from "./dungeon-scene.js";

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth*0.75,
  height: window.innerHeight*0.75,
  backgroundColor: "#000",
  parent: "game-container",
  pixelArt: true,
  scene: DungeonScene,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
};

const game = new Phaser.Game(config);
const canvas = (document.getElementsByTagName("canvas"))[0];
canvas.style.border = "5px solid white";
//Position canvas in center of screen
canvas.style.position = "absolute";
canvas.style.left = "50%";
canvas.style.top = "50%";
canvas.style.transform = "translate(-50%, -50%)";

