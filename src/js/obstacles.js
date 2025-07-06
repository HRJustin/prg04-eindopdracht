import { Actor, Vector, Color, CollisionType, Shape } from "excalibur";

export class Obstacle extends Actor {
    constructor(x, y, width = 30, height = 30, color = Color.Red) {
        super({
            pos: new Vector(x, y),
            width,
            height,
            color,
            collisionType: CollisionType.Fixed
        });

        this.name = "obstacle";
        this.isObstacle = true; // Tags for inheritance classes (Collision => gameoverscene fix.)
        this.damage = 1;
    }

    onInitialize(engine) {
        this.collider.set(Shape.Box(this.width, this.height));
    }

    onPreUpdate(engine, delta) {
        if (this.pos.x + this.width / 2 < 0) {
            this.kill(); // Removes off-screen obstacles
            console.log("Obstacle killed");
        }
    }
}

// All obstacle inheritance classes:
export class RedBarrel extends Obstacle {
    constructor(x, y) {
        super(x, y, 30, 30, Color.Red);
        this.name = "red-barrel";
        this.damage = 2
    }
}

export class GreenBarrel extends Obstacle {
    constructor(x, y) {
        super(x, y, 30, 30, Color.Green);
        this.name = "green-barrel";
    }
}
