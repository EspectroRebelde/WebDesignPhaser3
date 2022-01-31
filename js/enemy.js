//adaptado de
//https://github.com/mikewesthad/phaser-3-tilemap-blog-posts/blob/master/examples/post-3/04-dungeon-final/js/player.js

import Vector2D from "./utils.js";

export default class Enemy {
  constructor(scene, x, y, player, type) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.player = player;
    this.type = type;

    const anims = scene.anims;
    anims.create({
      key: "naked-walk",
      frames: anims.generateFrameNumbers("characters", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });
    anims.create({
      key: "naked-walk-back",
      frames: anims.generateFrameNumbers("characters", { start: 19, end: 22 }),
      frameRate: 8,
      repeat: -1,
    });


    this.sprite = scene.physics.add.sprite(x, y, "characters", 0).setSize(22, 33).setOffset(23, 27);

    this.sprite.anims.play("naked-walk-back");

  }

  getDirection2Points(xOrigin, yOrigin, xDestination, yDestination) {
    let x = xDestination - xOrigin;
    let y = yDestination - yOrigin;

    let distance = Math.sqrt(x * x + y * y);

    return new Vector2D(x / distance, y / distance);
  }

  freeze() {
    this.sprite.body.moves = false;
  }

  update (delta) {
    const sprite = this.sprite;
    const speed = this.player.speed*1;
    const prevVelocity = sprite.body.velocity.clone();

    let playerTileX = this.player.scene.groundLayer.worldToTileX(this.player.sprite.x);
    let playerTileY = this.player.scene.groundLayer.worldToTileY(this.player.sprite.y);
    let enemyTileX = this.scene.groundLayer.worldToTileX(this.sprite.x);
    let enemyTileY = this.scene.groundLayer.worldToTileY(this.sprite.y);

    // Stop any previous movement from the last frame
    sprite.body.setVelocity(0);

    if (this.player.scene.dungeon.getRoomAt(playerTileX, playerTileY) === this.scene.dungeon.getRoomAt(enemyTileX, enemyTileY)) {
      sprite.alpha = 1;
      //make the enemy move
      let directionX = this.sprite.x - this.player.sprite.x > 0 ? -1 : 1;
      let directionY = this.sprite.y - this.player.sprite.y > 0 ? -1 : 1;

      //move
      sprite.body.setVelocityX(speed * directionX);
      sprite.body.setVelocityY(speed * directionY);

      // Normalize and scale the velocity so that sprite can't move faster along a diagonal
      sprite.body.velocity.normalize().scale(speed);

      // Update the animation last and give left/right animations precedence over up/down animations
      if (directionX !== 0 && directionY > 0) {
        sprite.anims.play("naked-walk", true);
      } else if (directionY < 0) {
        sprite.anims.play("naked-walk-back", true);
      } else {
        sprite.anims.stop();

        // If we were moving, pick and idle frame to use
        if (prevVelocity.y < 0) {
          sprite.setTexture("characters", 19);
        } else {
          sprite.setTexture("characters", 0);
        }
      }
    }
    else {
      sprite.anims.stop();
      sprite.setTexture("characters", 0);
      sprite.alpha = 0.5;
    }
  }

  get _sprite() {return this.sprite;}

  destroy() {
    switch(this.type) {
        case 1:
          break;
        case 2:
        this.generateEnemies();
          break;
    }

    this.sprite.destroy();
    
  }

  //used as a sort of slime 
  generateEnemies() {
      let x1 = this.sprite.x - this.sprite.width;
      let x2 = this.sprite.x + this.sprite.width;

      this.scene.generateEnemy(x1, this.sprite.y, 1);
      this.scene.generateEnemy(x2, this.sprite.y, 1);

  }
}