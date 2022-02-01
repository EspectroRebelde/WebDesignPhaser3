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
    this.updateRatio = 100;
    this.updateTimer = 0;
    this.speed = 250;
    this.spriteName = type === 1 ? "characters" : "ghost";

    const anims = scene.anims;
    anims.create({
      key: "characters-walk",
      frames: anims.generateFrameNumbers("characters", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });
    anims.create({
      key: "characters-walk-back",
      frames: anims.generateFrameNumbers("characters", { start: 19, end: 22 }),
      frameRate: 8,
      repeat: -1,
    });
    anims.create({
      key: "ghost-walk",
      frames: anims.generateFrameNumbers("ghost", { start: 45, end: 47 }),
      frameRate: 4,
      repeat: -1,
    });
    anims.create({
      key: "ghost-walk-down",
      frames: anims.generateFrameNumbers("ghost", { start: 0, end: 2 }),
      frameRate: 4,
      repeat: -1,
    });
    anims.create({
      key: "ghost-walk-back",
      frames: anims.generateFrameNumbers("ghost", { start: 67, end: 69 }),
      frameRate: 4,
      repeat: -1,
    });


    this.sprite = scene.physics.add.sprite(x, y, this.spriteName, 0).setSize(22, 33).setOffset(23, 27);

    this.sprite.anims.play(this.spriteName + "-walk-back");

    this.sprite.alpha = 0;

  }

  get _sprite() {return this.sprite;}

  set _scene(newScene) {this.scene = newScene};
  set _x(newX) {this.x = newX};
  set _y(newY) {this.y = newY};
  set _player(newPlayer) {this.player = newPlayer};
  set _type(newType) {this.type = newType};
  set _speed(newSpeed) {this.speed = newSpeed};

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
    this.updateTimer += delta;
    if(this.updateTimer > this.updateRatio){
      this.updateTimer = 0;
      const sprite = this.sprite;
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
        sprite.body.setVelocityX(this.speed * directionX);
        sprite.body.setVelocityY(this.speed * directionY);

        // Normalize and scale the velocity so that sprite can't move faster along a diagonal
        sprite.body.velocity.normalize().scale(this.speed);

        // Update the animation last and give left/right animations precedence over up/down animations
        if (directionX !== 0 && directionY > 0) {
          if (directionX < 0) {
            sprite.setFlipX(true);
          }
          else if (directionX > 0) {
            sprite.setFlipX(false);
          }
          sprite.anims.play(this.spriteName+"-walk", true);
        } else if (directionY < 0) {
          sprite.anims.play(this.spriteName+"-walk-back", true);
        } else if (directionY > 0 && this.type === 1) {
          sprite.anims.play(this.spriteName+"-walk-down", true);
        } else {
          sprite.anims.stop();

          // If we were moving, pick and idle frame to use
          if (prevVelocity.y < 0) {
            sprite.setTexture(this.spriteName, 67);
          } else {
            sprite.setTexture(this.spriteName, 0);
          }
        }

        //If we collide with the player
        if (Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, this.player.sprite.x, this.player.sprite.y) < this.sprite.width) {
          this.player.health -= 1/delta;
        }


      }
      else {
        sprite.anims.stop();
        sprite.setTexture(this.spriteName, 0);
        sprite.alpha = 0;
      }
    }
  }

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
      let x1 = this.sprite.x - this.sprite.width/2;
      let x2 = this.sprite.x + this.sprite.width/2;

      this.scene.generateEnemy(x1, this.sprite.y, 1);
      this.scene.generateEnemy(x2, this.sprite.y, 1);

  }
}