class BulletManager {
    constructor(enemies) {
        this.bullets = [];
        this.enemies = enemies;
    }

    update() {
        //movement
        for (let i = 0; i < this.bullets.length; i++) {
            bullets[i].update();
        }

        //collisions
        for (let i = 0; i < this.bullets.length; i++) {
            let deleteBullet = false;
            /*
            //walls ?
            if () {

            }
            */

            //enemy
            for (let i = 0; i < this.enemies.length; i++) {
                if (AABB(bullet, enemies[i])) {
                    delteBullet = true;
                    this.enemies.splice(i, 1);
                    i--;
                }
            } 

            if (deleteBullet) {
                this.bullets.splice(i, 1);
                i--;
            }
        }
    }

    shootBullet(x, y, dirX, dirY) {
        let bullet = new Bullet(x, y, dirX, dirY);
        this.bullets.push(bullet);
    }
}