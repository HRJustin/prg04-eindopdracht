import { Actor, Vector, Color, CollisionType } from "excalibur"

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

        this.collider.useBoxCollider(width, height)
    }
}
