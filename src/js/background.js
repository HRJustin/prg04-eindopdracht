import { Actor, Vector } from "excalibur"

export class Background extends Actor {
    #speed;

    constructor(sprite, x, y, speed = 1) {
        super()
        this.pos = new Vector(x, y);
        this.z = -1 //Behind all actors
        this.graphics.use(sprite);
        this.#speed = speed;
    }

    get speed() {
        return this.#speed;
    }

    set speed(value) {
        if (typeof value === "number" && value >= 0) {
            this.#speed = value;
        }
    }

    get spriteWidth() {
        return this.graphics.current.width;
    }

    onPreUpdate(engine, delta) {
        this.pos.x -= this.#speed;

        if (this.pos.x <= -this.spriteWidth / 2) {
            this.pos.x += this.spriteWidth * 2;
        }
    }
}
//     onPreUpdate(engine, delta) {
//         this.pos.x -= 1 //  Moves background to the left every frame

//         const spriteWidth = this.graphics.current.width

//         // Loops background when it's off screen
//         if (this.pos.x <= -spriteWidth / 2) {
//             this.pos.x += spriteWidth * 2
//         }
//     }
// }
