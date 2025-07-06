import { Scene, Label, Vector, Font, FontUnit, Color, Keys, Actor } from "excalibur";

export class Leaderboard extends Scene {
    #title;
    #prompt;
    #scoreLabels = [];
    #spaceListener;

    onInitialize(engine) {
        this.engine = engine;

        const centerX = engine.drawWidth / 2;

        this.#title = new Label({
            text: "Leaderboard",
            pos: new Vector(centerX, 100),
            font: new Font({
                family: "Arial",
                size: 40,
                unit: FontUnit.Px,
                color: Color.Black,
            }),
            anchor: new Vector(0.5, 0.5),
        });

        this.#prompt = new Label({
            text: "Press Space to Start",
            pos: new Vector(centerX, 400),
            font: new Font({
                family: "Arial",
                size: 20,
                unit: FontUnit.Px,
                color: Color.Gray,
            }),
            anchor: new Vector(0.5, 0.5),
        });

        this.add(this.#title);
        this.add(this.#prompt);

        // Sample scores (replace with real ones later)
        const scores = ["1. Alice - 100", "2. Bob - 80", "3. Carol - 60"];
        scores.forEach((score, i) => {
            const scoreLabel = new Label({
                text: score,
                pos: new Vector(centerX, 160 + i * 40),
                font: new Font({
                    family: "Arial",
                    size: 24,
                    unit: FontUnit.Px,
                    color: Color.Black,
                }),
                anchor: new Vector(0.5, 0.5),
            });
            this.#scoreLabels.push(scoreLabel);
            this.add(scoreLabel);
        });
    }

    onActivate(ctx) {
        this.#spaceListener = (evt) => {
            if (evt.key === Keys.Space) {
                ctx.engine.startGame();
            }
        };
        ctx.engine.input.keyboard.on("press", this.#spaceListener);
    }

    onDeactivate(ctx) {
        if (this.#spaceListener) {
            ctx.engine.input.keyboard.off("press", this.#spaceListener);
            this.#spaceListener = null;
        }
    }
}