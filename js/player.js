import TILES from "./tile-mapping.js";

/**
 * Gamepad Input, NOT FULLY IMPLEMENTED
 * @type {{disconnect: gamepadAPI.disconnect, controller: {}, buttons: string[], turbo: boolean, update: gamepadAPI.update, axesStatus: *[], logic: gamepadAPI.logic, connect: gamepadAPI.connect}}
 */
let gamepadAPI = {
  controller: {},
  turbo: false,
  connect: function(evt) {
    gamepadAPI.controller = evt.gamepad;
    gamepadAPI.turbo = true;
    console.log('Gamepad connected');
  },
  disconnect: function() {
    gamepadAPI.turbo = false;
    delete gamepadAPI.controller;
    console.log('Gamepad disconnected');
  },
  update: function() {
    if (!('ongamepadconnected' in window)) {
      let gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
      gamepadAPI.controller = gamepads[0];
      gamepadAPI.buttonsStatus = [];
      let c = gamepadAPI.controller || {};
      let axes = [];
      if (c.axes) {
        for (let a = 0, x = c.axes.length; a < x; a++) {
          axes.push(c.axes[a].toFixed(2));
        }
      }
      gamepadAPI.axesStatus = axes;
    }
  },
  logic: function() {
    if (!('ongamepadconnected' in window) && gamepadAPI.turbo && gamepadAPI.controller) {
      //A
      if (gamepadAPI.controller.buttons[0].pressed) {

      }
      //B
      if (gamepadAPI.controller.buttons[1].pressed) {

      }
      //X
      if (gamepadAPI.controller.buttons[2].pressed) {
        genericVars.gamepadRequested = true;
      }
      else {
        genericVars.gamepadRequested = false;
      }
      //Y
      if (gamepadAPI.controller.buttons[3].pressed) {

      }
      //LB
      if (gamepadAPI.controller.buttons[4].pressed) {

      }
      //RB
      if (gamepadAPI.controller.buttons[5].pressed) {

      }
      //LT
      if (gamepadAPI.controller.buttons[6].pressed) {

      }
      //RT
      if (gamepadAPI.controller.buttons[7].pressed) {

      }
      //Select
      if (gamepadAPI.controller.buttons[8].pressed) {

      }
      //Start
      if (gamepadAPI.controller.buttons[9].pressed) {

      }
      //LStickButton
      if (gamepadAPI.controller.buttons[10].pressed) {

      }
      //RStickButton
      if (gamepadAPI.controller.buttons[11].pressed) {

      }
      //Up
      if (gamepadAPI.controller.buttons[12].pressed) {

      }
      //Down
      if (gamepadAPI.controller.buttons[13].pressed) {

      }
      //Left
      if (gamepadAPI.controller.buttons[14].pressed) {

      }
      //Right
      if (gamepadAPI.controller.buttons[15].pressed) {

      }
    }
  },
  buttons: [ // XBox360 layout
    'A','B','X','Y',
    'LB','RB','LT','RT',
    'Select', 'Start',
    'L3', 'R3',
    'Up', 'Down', 'Left', 'Right'
  ],
  axesStatus: []
};
window.addEventListener("gamepadconnected", gamepadAPI.connect);
window.addEventListener("gamepaddisconnected", gamepadAPI.disconnect);

let genericVars = {
  executing : false,
  gamepadRequested : false,
}


export default class Player {
  constructor(scene, x, y, bulletManager) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.speed = 300;
    this.initialSpeed = 300;
    this.durationSpeed = 10000;
    this.deltaSpeed = 0;
    this.hasKey = false;

    this.bulletManager = bulletManager;
    this.initialCdShoot = 500;
    this.cdShoot = 500;
    this.durationShoot = 2000;
    this.deltaShoot = 0;

    this.health = 10;

    const anims = scene.anims;
    anims.create({
      key: "king-walk",
      frames: anims.generateFrameNumbers("characters", { start: 23, end: 26 }),
      frameRate: 8,
      repeat: -1,
    });
    anims.create({
      key: "king-walk-back",
      frames: anims.generateFrameNumbers("characters", { start: 42, end: 45 }),
      frameRate: 8,
      repeat: -1,
    });

    this.sprite = scene.physics.add.sprite(x, y, "characters", 0).setSize(22, 33).setOffset(23, 27);

    this.sprite.anims.play("king-walk-back");

    this.keys = scene.input.keyboard.createCursorKeys();
    this.keys.w = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keys.a = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keys.s = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keys.d = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    //shooting
      this.keys.e = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
      //if we press this key, we shoot in the direction where the player looks at??
  }

  set _scene(newScene) {this.scene = newScene};
  set _x(newX) {this.x = newX};
  set _y(newY) {this.y = newY};
  set _bulletManager(newBulletManager) {this.bulletManager = newBulletManager};

  freeze() {
    this.sprite.body.moves = false;
  }

  update(delta) {
    const keys = this.keys;
    const sprite = this.sprite;
    const prevVelocity = sprite.body.velocity.clone();
    gamepadAPI.update();

    if (this.health <= 0) {
      this.updateText("Dead");
      this.freeze();
    }

    //shoot delta
    this.deltaShoot += delta;
    
    if (this.initialSpeed !== this.speed) {
        this.deltaSpeed += delta;
        if (this.deltaSpeed >= this.durationSpeed) {
            this.deltaSpeed = 0;
            this.restoreSpeed();
        }
    }

    if(this.initialCdShoot !== this.cdShoot) {
        this.deltaShoot += delta;
        if(this.deltaShoot >= this.durationShoot) {
          this.deltaShoot = 0;
          this.restoreShootSpeed();
        }
    }

    // Stop any previous movement from the last frame
    sprite.body.setVelocity(0);

    // Horizontal movement
    if (keys.left.isDown || keys.a.isDown || gamepadAPI.axesStatus[0] < -0.5) {
      sprite.setFlipX(true);
      if(!keys.e.isDown) {
          sprite.body.setVelocityX(-this.speed);
      } else {
        if(this.deltaShoot >= this.cdShoot) {
          this.deltaShoot = 0;
          this.bulletManager.shootBullet(sprite.x, sprite.y, -1, 0);
        }
      }
      
    } else if (keys.right.isDown || keys.d.isDown || gamepadAPI.axesStatus[0] > 0.5) {
      sprite.setFlipX(false);
      if(!keys.e.isDown) {
          sprite.body.setVelocityX(this.speed);
      } else {
        if(this.deltaShoot >= this.cdShoot) {
          this.deltaShoot = 0;
          this.bulletManager.shootBullet(sprite.x, sprite.y, 1, 0);
        }
      }
    }

    // Vertical movement
    if (keys.up.isDown || keys.w.isDown || gamepadAPI.axesStatus[1] < -0.5) {
      if(!keys.e.isDown) {
          sprite.body.setVelocityY(-this.speed);
      } else {
        if(this.deltaShoot >= this.cdShoot) {
          this.deltaShoot = 0;
          this.bulletManager.shootBullet(sprite.x, sprite.y, 0, -1);
        }
      }

    } else if (keys.down.isDown || keys.s.isDown || gamepadAPI.axesStatus[1] > 0.5) {
      if(!keys.e.isDown) {
          sprite.body.setVelocityY(this.speed);
      } else {
        if(this.deltaShoot >= this.cdShoot) {
          this.deltaShoot = 0;
          this.bulletManager.shootBullet(sprite.x, sprite.y, 0, 1);
        }
      }
    }
    

    // Normalize and scale the velocity so that sprite can't move faster along a diagonal
    sprite.body.velocity.normalize().scale(this.speed);

    // Update tkeymation last and give left/right animations precedence over up/down animations
    if (!this.keys.e.isDown){
      if (keys.left.isDown || keys.right.isDown || keys.down.isDown || keys.s.isDown || keys.a.isDown || keys.d.isDown || gamepadAPI.axesStatus[0] > 0.5 || gamepadAPI.axesStatus[0] < -0.5 || gamepadAPI.axesStatus[1] > 0.5) {
        sprite.anims.play("king-walk", true);
      } else if (keys.up.isDown || keys.w.isDown || gamepadAPI.axesStatus[1] < -0.5) {
        sprite.anims.play("king-walk-back", true);
      } else {
        sprite.anims.stop();

        // If we were moving, pick and idle frame to use
        if (prevVelocity.y < 0) sprite.setTexture("characters", 42);
        else sprite.setTexture("characters", 23);
      }
    }
    else {
      if (keys.up.isDown || keys.w.isDown || gamepadAPI.axesStatus[1] < -0.5) sprite.setTexture("characters", 42); 
      else sprite.setTexture("characters", 23);
    }

    //Pick-Ups
    if ((keys.space.isDown || genericVars.gamepadRequested) && !genericVars.executing) {
      genericVars.executing = true;
      let playerTileX = this.scene.groundLayer.worldToTileX(this.sprite.x);
      let playerTileY = this.scene.groundLayer.worldToTileY(this.sprite.y);
      let room = this.scene.dungeon.getRoomAt(playerTileX, playerTileY);
      if (room.chest){
        if (this.isPointInRadius(room.centerX, room.centerY, playerTileX, playerTileY, 1)) {
          if (room.chest.chest) {
            console.log("Chest found")
            this.openChest(room.chest);
            room.chest = {
              chest: false,
              doorKey: false
            }
            this.updateChest(room);
          }
        }
      }
    }
    else if (!keys.space.isDown && !genericVars.gamepadRequested) {
      genericVars.executing = false;
    }
  }

  openChest(chest) {
    if (chest.doorKey) {
      console.log("Door key found")
      this.hasKey = true;
      this.updateText("Key");
    }
    else if (chest.speedBoost) {
      this.getBonusSpeed(this.speed*0.2);
      this.updateText("Speed");
    }
    else if (chest.shootBonus) {
      this.getBonusShoot(this.cdShoot*0.2);
      this.updateText("Shoot");
    }
  }

  isPointInRadius(x1, y1, x2, y2, radius) {
    let x = x2 - x1;
    let y = y2 - y1;
    let distance = Math.sqrt(x * x + y * y);
    return distance <= radius;
  }

  getBonusSpeed(speed) {
      this.speed += speed;
      this.deltaSpeed = 0;
  }

  getBonusShoot(time) {
      this.cdShoot -= time;
      this.deltaShoot = 0;
  }

  updateText(newType){
    /*this.scene.add.text.destroy();*/
    if (newType !== "Dead") {
      if (this.hasKey) {
        if (newType === "Speed") {
          this.scene.add
              .text(16, 16, `Find the stairs.\nCurrent level: ${this.scene.level}\nIncreased movement speed!`, {
                font: "18px monospace",
                fill: "#000000",
                padding: {x: 20, y: 10},
                backgroundColor: "#ffffff",
              })
              .setScrollFactor(0);
        } else if (newType === "Shoot") {
          this.scene.add
              .text(16, 16, `Find the stairs.\nCurrent level: ${this.scene.level}\nIncreased reload speed!`, {
                font: "18px monospace",
                fill: "#000000",
                padding: {x: 20, y: 10},
                backgroundColor: "#ffffff",
              })
              .setScrollFactor(0);
        } else {
          this.scene.add
              .text(16, 16, `Find the stairs.\nCurrent level: ${this.scene.level}`, {
                font: "18px monospace",
                fill: "#000000",
                padding: {x: 20, y: 10},
                backgroundColor: "#ffffff",
              })
              .setScrollFactor(0);
        }
      } else {
        if (newType === "Speed") {
          this.scene.add
              .text(16, 16, `Find the key.\nCurrent level: ${this.scene.level}\nIncreased movement speed!`, {
                font: "18px monospace",
                fill: "#000000",
                padding: {x: 20, y: 10},
                backgroundColor: "#ffffff",
              })
              .setScrollFactor(0);
        } else if (newType === "Shoot") {
          this.scene.add
              .text(16, 16, `Find the key.\nCurrent level: ${this.scene.level}\nIncreased reload speed!`, {
                font: "18px monospace",
                fill: "#000000",
                padding: {x: 20, y: 10},
                backgroundColor: "#ffffff",
              })
              .setScrollFactor(0);
        } else {
          this.scene.add
              .text(16, 16, `Find the key.\nCurrent level: ${this.scene.level}`, {
                font: "18px monospace",
                fill: "#000000",
                padding: {x: 20, y: 10},
                backgroundColor: "#ffffff",
              })
              .setScrollFactor(0);
        }
      }
    }
    else {
      this.scene.add
          .text(16, 16, `You died at level: ${this.scene.level}\nReload to try again.`, {
            font: "18px monospace",
            fill: "#000000",
            padding: {x: 20, y: 10},
            backgroundColor: "#ffffff",
          })
          .setScrollFactor(0);
    }
  }

  restoreSpeed() {
      this.speed = this.initialSpeed;
  }

  restoreShootSpeed() {
    this.cdShoot = this.initialCdShoot;
  }

  updateChest(room) {
    this.scene.stuffLayer.putTilesAt(TILES.POT, room.centerX, room.centerY);
  }

  destroy() {
    this.sprite.destroy();
  }
}
