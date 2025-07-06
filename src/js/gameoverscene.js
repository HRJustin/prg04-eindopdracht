import { Scene, Label, Vector, Font, FontUnit, Color, Keys } from "excalibur";

export class GameOverScene extends Scene {
    constructor() {
        super();
        this.label = null;
        this.scoreLabel = null;
        this.prompt = null;
        this.spaceListenerAdded = false;
    }

    onInitialize(engine) {
        this.label = new Label({
            text: "Game Over",
            font: new Font({
                family: "Arial",
                size: 48,
                unit: FontUnit.Px,
                color: Color.Red
            }),
            anchor: new Vector(0.5, 0.5)
        });

        this.add(this.label);

        this.scoreLabel = new Label({
            text: "Final Score: TEST",
            font: new Font({
                family: "Arial",
                size: 32,
                unit: FontUnit.Px,
                color: Color.Green
            }),
            anchor: new Vector(0.5, 0.5)
        });

        this.add(this.scoreLabel);
        console.log("Score label initialized with TEST text");                      // Debugging

        this.prompt = new Label({
            text: "Press Space to Restart",
            font: new Font({
                family: "Arial",
                size: 24,
                unit: FontUnit.Px,
                color: Color.Black
            }),
            anchor: new Vector(0.5, 0.5)
        });
        this.add(this.prompt);

        // // this.engine = engine;
        // const centerX = engine.drawWidth / 2;
        // const centerY = engine.drawHeight / 2;

        // const label = new Label({
        //     text: "Game Over",
        //     pos: new Vector(centerX, centerY - 60),
        //     font: new Font({
        //         family: "Arial",
        //         size: 48,
        //         unit: FontUnit.Px,
        //         color: Color.Red
        //     }),
        //     anchor: new Vector(0.5, 0.5)
        // });

        // this.add(label);

        // const prompt = new Label({
        //     text: "Press Space to Restart",
        //     pos: new Vector(centerX, centerY + 60),
        //     font: new Font({
        //         family: "Arial",
        //         size: 24,
        //         unit: FontUnit.Px,
        //         color: Color.Black
        //     }),
        //     anchor: new Vector(0.5, 0.5)
        // });

        // this.scoreLabel = new Label({
        //     text: "",
        //     pos: new Vector(centerX, centerY),
        //     font: new Font({
        //         family: "Arial",
        //         size: 32,
        //         unit: FontUnit.Px,
        //         color: Color.Black
        //     }),
        //     anchor: new Vector(0.5, 0.5)
        // });

        // this.add(this.scoreLabel);

        // this.add(prompt);
    }

    onActivate(context, data) {
        console.log("GameOverScene onActivate triggered", data);             // Debugging
        const engine = context.engine;
        const centerX = engine.drawWidth / 2;
        const centerY = engine.drawHeight / 2;

        this.label.pos = new Vector(centerX, centerY - 60);
        this.scoreLabel.pos = new Vector(centerX, centerY);
        console.log("Score label position:", this.scoreLabel.pos);            // Debugging
        console.log("Current scene name:", context.engine.currentScene);      // Debugging
        this.prompt.pos = new Vector(centerX, centerY + 60);

        // Shows final score
        if (data && typeof data.score === 'number') {
            this.showFinalScore(data.score);
        }

        // Removes previous listener if any
        if (this._spaceListener) {
            context.engine.input.keyboard.off("press", this._spaceListener);
        }

        // Defines and stores the new listener
        this._spaceListener = (event) => {
            if (event.key === Keys.Space) {
                engine.startGame();
            }
        };

        context.engine.input.keyboard.on("press", this._spaceListener);
    }

    onDeactivate(context) {
        // Cleans up listener when leaving the scene
        if (this._spaceListener) {
            context.engine.input.keyboard.off("press", this._spaceListener);
            this._spaceListener = null;
        }
    }

    showFinalScore(score) {
        console.log("Setting final score to:", score, "Label exists:", !!this.scoreLabel); // Debugging
        if (this.scoreLabel) {
            this.scoreLabel.text = `Final Score: ${score}`;
        }
    }
}
