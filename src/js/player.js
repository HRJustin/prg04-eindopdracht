import { Actor, Vector, Color, Keys, CollisionType, Shape } from "excalibur"
import { Obstacle } from "./obstacles.js";

export class Player extends Actor {
    constructor(x, y) {
        super({
            pos: new Vector(x, y),
            width: 40,
            height: 60,
            color: Color.Blue,
            collisionType: CollisionType.Active // Change to Active for physics!!!
        })
        console.log("Player created");                                       // Debugging
    }

    onPreUpdate(engine) {
        if (engine.input.keyboard.isHeld(Keys.Space)) {
            const velY = this.vel.y;
            const isOnGround = Math.abs(velY) < 5;

            if (isOnGround) {
                this.vel.y = -500; // Jump
            }
        }
    }

    onInitialize(engine) {
        this.collider.set(Shape.Box(40, 60));

        this.on("collisionstart", (evt) => {
            const other = evt.other.owner ?? evt.other;

            console.log("Collision started with:", other.name);

            if (other.name === "obstacle") {
                console.log("Player collided with obstacle");                  // Debugging
                engine.goToScene("gameover");
            }
        });

        // Jumping and crouching
        engine.input.keyboard.on("press", (evt) => {
            if (evt.key === Keys.S) {
                this.scale = new Vector(1, 0.5) // Crouching (makes player shorter)
            }
        });

        engine.input.keyboard.on("release", (evt) => {
            if (evt.key === Keys.S) {
                this.scale = new Vector(1, 1) // Standing up
            }
        });

        engine.input.keyboard.on("press", (evt) => {
            if (evt.key === Keys.G) {
                console.log("Force go to GameOver scene");
                engine.goToScene("gameover");
            }
        });
    }
}