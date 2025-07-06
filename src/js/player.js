import { Actor, Vector, Color, Keys, CollisionType, Shape, SpriteSheet, Animation } from "excalibur"
import { Obstacle } from "./obstacles.js";
import { Platform } from "./platform.js";
import { Resources, ResourceLoader } from './resources.js'

export class Player extends Actor {
    constructor(x, y) {
        super({
            pos: new Vector(x, y),
            width: 40,
            height: 100,
            color: Color.Blue,
            collisionType: CollisionType.Active                              // Change to Active for physics!!!
        })
        console.log("Player created");                                       // Debugging

        this.isGrounded = false;
        this.platformsTouching = [];                                         // Tracks all platforms player is touching
    }

    onPreUpdate(engine) {
        if (engine.input.keyboard.isHeld(Keys.Space) && this.platformsTouching.length > 0) {
            this.vel.y = -500;                                                // Jump
            this.platformsTouching = [];                                      // Clears platforms to prevent double-jump
        }
    }

    onInitialize(engine) {
        const runSheet = SpriteSheet.fromImageSource({
            image: Resources.PlayerSpriteSheet,
            grid: {
                rows: 1,
                columns: 3,
                spriteWidth: 50,
                spriteHeight: 100
            }
        });

        // Makes the player walking animation
        const runAnimation = Animation.fromSpriteSheet(runSheet, [0, 1, 2], 100);

        this.graphics.use(runAnimation);

        this.collider.set(Shape.Box(40, 100));

        this.on("collisionstart", (event) => {
            const other = event.other.owner ?? event.other;
            const engine = this.scene.engine;

            // console.log("Collision started with:", other.name);                // Debugging

            if (other.isMedpack) {
                if (engine.hearts.addHeart()) {
                    console.log("Heart added from medpack.");
                } else {
                    console.log("Hearts already full.");
                }
                other.kill();
            }

            if (other.isObstacle) {
                const damage = other.damage ?? 1; // Fallback to 1 if not defined
                console.log(`Player hit by ${other.name}, damage: ${damage}`);                  // Debugging
                const dead = engine.hearts.loseHeart(other.damage ?? 1);

                if (dead) {
                    engine.goToScene("gameover", { score: engine.score });     // Passes Score
                }
            }

            // Platform collision
            if (other instanceof Platform) {
                // Adds platform if not already in array
                if (!this.platformsTouching.includes(other)) {
                    this.platformsTouching.push(other);
                }
            }
        });

        this.on("collisionend", (event) => {
            const other = event.other.owner ?? event.other;

            if (other instanceof Platform) {
                // Removes platform from array
                this.platformsTouching = this.platformsTouching.filter(platform => platform !== other);
            }
        });

        // Crouching
        engine.input.keyboard.on("press", (event) => {
            if (event.key === Keys.S) {
                this.scale = new Vector(1, 0.5) // Crouching (makes player shorter)
            }
        });

        engine.input.keyboard.on("release", (event) => {
            if (event.key === Keys.S) {
                this.scale = new Vector(1, 1) // Standing up
            }
        });

        engine.input.keyboard.on("press", (event) => {
            if (event.key === Keys.G) {
                console.log("Force go to GameOver scene");
                engine.goToScene("gameover");
            }
        });
    }
}