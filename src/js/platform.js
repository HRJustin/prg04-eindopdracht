import { Actor, Vector, Color, CollisionType, Shape } from "excalibur"

export class Platform extends Actor {
    constructor(x, y, width, height) {
        super({
            pos: new Vector(x, y),
            width,
            height,
            color: Color.Brown,
            collisionType: CollisionType.Fixed
        })

        this.speed = 100 // pixels per second to the left

        // this.collider.useBoxCollider(width, height)
    }

    onInitialize() {
        const shape = Shape.Box(this.width, this.height, Vector.Zero);
        this.collider.set(shape);
    }
}