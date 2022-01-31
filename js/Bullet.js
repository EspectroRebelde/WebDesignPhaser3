import Vector2D from "./utils.js";

export default class Bullet {
    constructor(x, y, dirX, dirY) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.dirX = dirX;
        this.dirY = dirY;

        this.sprite = scene.physics.add.sprite(x, y, "characters", 0).setSize(22, 33).setOffset(23, 27);

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

    update(delta) {
        const sprite = this.sprite;
        const speed = this.player.speed * 1;
        const prevVelocity = sprite.body.velocity.clone();

        let playerTileX = this.player.scene.groundLayer.worldToTileX(this.player.sprite.x);
        let playerTileY = this.player.scene.groundLayer.worldToTileY(this.player.sprite.y);
        let enemyTileX = this.scene.groundLayer.worldToTileX(this.sprite.x);
        let enemyTileY = this.scene.groundLayer.worldToTileY(this.sprite.y);

        // Stop any previous movement from the last frame
        sprite.body.setVelocity(0);

        //make the bullet move
        //let directionX = this.sprite.x - this.player.sprite.x > 0 ? -1 : 1;
        //let directionY = this.sprite.y - this.player.sprite.y > 0 ? -1 : 1;

        //move
        sprite.body.setVelocityX(speed * this.dirX);
        sprite.body.setVelocityY(speed * this.dirY);

        // Normalize and scale the velocity so that sprite can't move faster along a diagonal
        sprite.body.velocity.normalize().scale(speed);
       
    }

    get _sprite() { return this.sprite; }

    destroy() {
        this.sprite.destroy();
    }
}