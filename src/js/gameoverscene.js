import { Scene, Label, Vector, Font, FontUnit, Color, Keys } from "excalibur";

export class GameOverScene extends Scene {
    #label;
    #scoreLabel;
    #prompt;
    #spaceListener;

    constructor() {
        super();
    }

    onInitialize(engine) {
        this.#label = new Label({
            text: "Game Over",
            font: new Font({
                family: "Arial",
                size: 48,
                unit: FontUnit.Px,
                color: Color.Red
            }),
            anchor: new Vector(0.5, 0.5)
        });

        this.#scoreLabel = new Label({
            text: "Final Score: TEST",
            font: new Font({
                family: "Arial",
                size: 32,
                unit: FontUnit.Px,
                color: Color.Green
            }),
            anchor: new Vector(0.5, 0.5)
        });

        this.#prompt = new Label({
            text: "Press Space to Restart",
            font: new Font({
                family: "Arial",
                size: 24,
                unit: FontUnit.Px,
                color: Color.Black
            }),
            anchor: new Vector(0.5, 0.5)
        });
        this.add(this.#label);
        this.add(this.#scoreLabel);
        console.log("Score label initialized with TEST text");                      // Debugging
        this.add(this.#prompt);
    }

    onActivate(context, data) {
        console.log("GameOverScene onActivate triggered", data);               // Debugging
        const engine = context.engine;
        const centerX = engine.drawWidth / 2;
        const centerY = engine.drawHeight / 2;

        this.#label.pos = new Vector(centerX, centerY - 60);
        this.#scoreLabel.pos = new Vector(centerX, centerY);
        console.log("Score label position:", this.#scoreLabel.pos);            // Debugging
        console.log("Current scene name:", context.engine.currentScene);       // Debugging
        this.#prompt.pos = new Vector(centerX, centerY + 60);

        // Shows final score
        if (data && typeof data.score === 'number') {
            this.setFinalScore(data.score);
        }

        this.#addKeyboardListener(engine);
    }

    onDeactivate(context) {
        this.#removeKeyboardListener(context.engine);
    }

    #addKeyboardListener(engine) {
        this.#spaceListener = (event) => {
            if (event.key === Keys.Space) {
                engine.startGame();
            }
        };
        engine.input.keyboard.on("press", this.#spaceListener);
    }

    #removeKeyboardListener(engine) {
        if (this.#spaceListener) {
            engine.input.keyboard.off("press", this.#spaceListener);
            this.#spaceListener = null;
        }
    }

    setFinalScore(score) {
    this.#scoreLabel.text = `Final Score: ${score}`;
  }
}
