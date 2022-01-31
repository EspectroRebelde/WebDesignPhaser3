import Bullet from "./Bullet.js";
import {AABB} from "./utils.js";

export default class BulletManager {
    constructor(enemies, scene) {
        this.bullets = [];
        this.enemies = enemies;
        this.scene = scene;

        this.bulletTimeout = 500;
    }

    update(delta) {
        //movement
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update(delta);
        }

        //collisions
        for (let i = 0; i < this.bullets.length; i++) {
            let deleteBullet = false;

            //enemy
            for (let e = 0; e < this.enemies.length; e++) {
                if (AABB(this.bullets[i], this.enemies[e])) {
                    deleteBullet = true;
                    this.enemies[e].destroy();
                    this.enemies.splice(e, 1);
                    e--;
                }
            } 


           if(this.bullets[i].deltaActive >= this.bulletTimeout) {
             deleteBullet = true;
           }

            if (deleteBullet) {
                this.bullets[i].destroy();
                this.bullets.splice(i, 1);
                i--;
            }
        }
    }

    shootBullet(x, y, dirX, dirY) {
        let bullet = new Bullet(x, y, dirX, dirY, this.scene);
        this.bullets.push(bullet);
    }
}