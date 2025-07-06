import { Actor, Vector, Color, CollisionType, Shape } from "excalibur"

export class Platform extends Actor {
    #speed;

    constructor(x, y, width, height) {
        super({
            pos: new Vector(x, y),
            width,
            height,
            color: Color.Brown,
            collisionType: CollisionType.Fixed
        })

        this.#speed = 100 // pixels per second to the left

        // this.collider.useBoxCollider(width, height)
    }

    get speed() {
        return this.#speed;
    }

    set speed(value) {
        if (typeof value === "number" && value >= 0) {
            this.#speed = value;
        }
    }

    onInitialize() {
        const shape = Shape.Box(this.width, this.height, Vector.Zero);
        this.collider.set(shape);
    }
}