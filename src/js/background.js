import { Actor, Vector } from "excalibur"

export class Background extends Actor {
    constructor(sprite, x, y) {
        super()
        this.pos = new Vector(x, y)
        this.z = -1 //Behind all actors
        this.graphics.use(sprite)
    }

    onPreUpdate(engine, delta) {
        this.pos.x -= 1 //  Moves background to the left every frame

        const spriteWidth = this.graphics.current.width

        // Loops background when it's off screen
        if (this.pos.x <= -spriteWidth / 2) {
            this.pos.x += spriteWidth * 2
        }
    }
}
