export default class PowerUp {
    constructor(x, y, player, type, change) {
        this.type = type;
        this.change = change;
        this.player = player;


        this.sprite = scene.physics.add.sprite(x, y, "characters", 0).setSize(22, 33).setOffset(23, 27);
        this.sprite.body.moves = false;
    }

    causeEffect() {
        switch (this.type) {
            case 1: //extra speed
                this.player.getBonusSpeed(change);
                break;
            case 2: //shoot cd
                this.player.getBonusShoot(change);
                break;
        }
    }
}