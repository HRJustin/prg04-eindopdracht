import { Actor, Vector, Color, Keys, CollisionType, Shape, SpriteSheet, Animation } from "excalibur"
import { Obstacle } from "./obstacles.js";
import { Platform } from "./platform.js";
import { Resources, ResourceLoader } from './resources.js'

export class Player extends Actor {
    #isGrounded = false;
    #platformsTouching = [];                                                 // Tracks all platforms player is touching

    constructor(x, y) {
        super({
            pos: new Vector(x, y),
            width: 40,
            height: 100,
            color: Color.Blue,
            collisionType: CollisionType.Active                              // Change to Active for physics!!!
        })
        console.log("Player created");                                       // Debugging
    }

    get isGrounded() {
        return this.#platformsTouching.length > 0;
    }

    onPreUpdate(engine) {
        if (engine.input.keyboard.isHeld(Keys.Space) && this.isGrounded) {
            this.vel.y = -500;                                                // Jump
            this.#platformsTouching = [];                                      // Clears platforms to prevent double-jump
        }
    }

    onInitialize(engine) {
        this.#setupAnimation();
        this.#setupCollider();
        this.#setupCollisionHandlers(engine);
        this.#setupKeyboardHandlers(engine);
    }

    #setupAnimation() {
        const runSheet = SpriteSheet.fromImageSource({
            image: Resources.PlayerSpriteSheet,
            grid: {
                rows: 1,
                columns: 3,
                spriteWidth: 50,
                spriteHeight: 100
            }
        });
        const runAnimation = Animation.fromSpriteSheet(runSheet, [0, 1, 2], 100);
        this.graphics.use(runAnimation);
    }

    #setupCollider() {
        this.collider.set(Shape.Box(40, 100));
    }

    #setupCollisionHandlers(engine) {
        this.on("collisionstart", (event) => {
            const other = event.other.owner ?? event.other;

            if (other.isMedpack) {
                if (engine.hearts.addHeart()) {
                    console.log("Heart added from medpack.");
                } else {
                    console.log("Hearts already full.");
                }
                other.kill();
            }

            if (other.isObstacle) {
                const damage = other.damage ?? 1;
                console.log(`Player hit by ${other.name}, damage: ${damage}`);
                const dead = engine.hearts.loseHeart(damage);
                if (dead) {
                    engine.goToScene("gameover", { score: engine.score });
                }
            }

            if (other.name === "bird" && other.isEnemy) {
                const damage = other.damage ?? 1;
                console.log(`Player hit by bird, damage: ${damage}`);
                const dead = engine.hearts.loseHeart(damage);
                if (dead) {
                    engine.goToScene("gameover", { score: engine.score });
                }
            }

            if (other instanceof Platform && !this.#platformsTouching.includes(other)) {
                this.#platformsTouching.push(other);
            }
        });

        this.on("collisionend", (event) => {
            const other = event.other.owner ?? event.other;
            if (other instanceof Platform) {
                this.#platformsTouching = this.#platformsTouching.filter(p => p !== other);
            }
        });
    }

    #setupKeyboardHandlers(engine) {
        engine.input.keyboard.on("press", (event) => {
            if (event.key === Keys.S) {
                this.scale = new Vector(1, 0.3);
            }
            if (event.key === Keys.G) {
                console.log("Force go to GameOver scene");
                engine.goToScene("gameover");
            }
        });

        engine.input.keyboard.on("release", (event) => {
            if (event.key === Keys.S) {
                this.scale = new Vector(1, 1);
            }
        });
    }
}
