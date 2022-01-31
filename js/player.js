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


export default class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.speed = 300;
    this.initialSpeed = 300;

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

  freeze() {
    this.sprite.body.moves = false;
  }

  update() {
    const keys = this.keys;
    const sprite = this.sprite;
    const prevVelocity = sprite.body.velocity.clone();
    gamepadAPI.update();

    // Stop any previous movement from the last frame
    sprite.body.setVelocity(0);

    // Horizontal movement
    if (keys.left.isDown || keys.a.isDown || gamepadAPI.axesStatus[0] < -0.5) {
      sprite.body.setVelocityX(-this.speed);
      sprite.setFlipX(true);
    } else if (keys.right.isDown || keys.d.isDown || gamepadAPI.axesStatus[0] > 0.5) {
      sprite.body.setVelocityX(this.speed);
      sprite.setFlipX(false);
    }

    // Vertical movement
    if (keys.up.isDown || keys.w.isDown || gamepadAPI.axesStatus[1] < -0.5) {
      sprite.body.setVelocityY(-this.speed);
    } else if (keys.down.isDown || keys.s.isDown || gamepadAPI.axesStatus[1] > 0.5) {
      sprite.body.setVelocityY(this.speed);
    }

    // Normalize and scale the velocity so that sprite can't move faster along a diagonal
    sprite.body.velocity.normalize().scale(this.speed);

    // Update the animation last and give left/right animations precedence over up/down animations
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

  getBonusSpeed(speed) {
      this.speed += speed;
  }

  restoreSpeed() {
      this.speed = this.initialSpeed;
  }

  destroy() {
    this.sprite.destroy();
  }
}
