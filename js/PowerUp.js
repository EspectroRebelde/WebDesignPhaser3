class PowerUp {
    constructor(x, y, type, change) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.change = change;


        this.sprite = scene.physics.add.sprite(x, y, "characters", 0).setSize(22, 33).setOffset(23, 27);
        this.sprite.body.moves = false;
    }

    causeEffect() {
        switch (this.type) {
            case 1: //extra speed
                break;
        }
    }
}