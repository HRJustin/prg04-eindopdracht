import { Actor, Vector, Color, CollisionType, Shape } from "excalibur";

export class Obstacle extends Actor {
    constructor(x, y) {
        super({
            pos: new Vector(x, y),
            width: 30,
            height: 30,
            color: Color.Red,
            collisionType: CollisionType.Fixed
        });

        this.name = "obstacle";
        this.speed = 100; // Speed to left
    }

    onInitialize(engine) {
        this.collider.set(Shape.Box(30, 30));
    }

    onPreUpdate(engine, delta) {
        this.pos.x -= (this.speed * delta) / 1000;

        if (this.pos.x + this.width / 2 < 0) {
            this.kill(); // Removes off-screen obstacles
        }
    }
}
