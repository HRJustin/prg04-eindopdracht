import { Actor, Vector } from "excalibur";
import { Resources } from "./resources.js";

export class Hearts extends Actor {
    heartActors = [];
    currentHearts = 3;

    onInitialize(engine) {
        this.pos = new Vector(10, 10); // Top-left corner
        this.anchor = Vector.Zero;
    }

    resetHearts() {
        this.currentHearts = 3;

        // Removes old heart actors
        for (let heart of this.heartActors) {
            heart.kill();
        }

        this.heartActors = [];

        for (let i = 0; i < this.currentHearts; i++) {
            const heartSprite = Resources.Heart.toSprite();
            const heartActor = new Actor({
                pos: new Vector(i * 20, 0),                                               // space between hearts
                width: 15,
                height: 14,
                anchor: Vector.Zero,
            });
            heartActor.graphics.use(heartSprite);
            this.addChild(heartActor);
            this.heartActors.push(heartActor);
        }
    }

    loseHeart(amount = 1) {
        this.currentHearts -= amount;
        this.currentHearts = Math.max(this.currentHearts, 0); // Prevent negative hearts

        // Remove visual heart actors
        while (this.heartActors.length > this.currentHearts) {
            const heartToRemove = this.heartActors.pop();
            heartToRemove.kill();
        }

        return this.currentHearts === 0;
    }

    addHeart() {
        if (this.currentHearts < 3) {
            this.currentHearts++;

            if (this.scene) {           //  Only update visuals if still in a scene
                this.updateHearts();
            }

            return true;
        }
        return false;
    }

    updateHearts() {
        // Removes all old hearts
        for (let heart of this.heartActors) {
            heart.kill();
        }

        this.heartActors = [];

        for (let i = 0; i < this.currentHearts; i++) {
            const heartSprite = Resources.Heart.toSprite();
            const heartActor = new Actor({
                pos: new Vector(i * 20, 0),
                width: 15,
                height: 14,
                anchor: Vector.Zero,
            });
            heartActor.graphics.use(heartSprite);
            this.addChild(heartActor);
            this.heartActors.push(heartActor);
        }
    }

    showHearts(amount) {
        this.resetHearts();
        while (this.heartActors.length > amount) {
            const heart = this.heartActors.pop();
            heart.kill();
        }
    }

    onPostUpdate(engine, delta) {
        if (this.heartActors.length === 0) {
            this.resetHearts();
        }
    }
}
