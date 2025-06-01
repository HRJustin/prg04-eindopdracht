// import { Background } from './background';
// import { Resources } from './resources';

import { Scene, Label, Vector, Font, FontUnit, Color, Keys, Actor } from "excalibur";

export class Leaderboard extends Scene {
    onInitialize(engine) {
        this.engine = engine;
        
        const title = new Label({
            text: "Leaderboard",
            pos: new Vector(engine.drawWidth / 2, 100),
            font: new Font({
                family: "Arial",
                size: 40,
                unit: FontUnit.Px,
                color: Color.Black
            }),
            anchor: new Vector(0.5, 0.5)
        });

        const prompt = new Label({
            text: "Press Space to Start",
            pos: new Vector(engine.drawWidth / 2, 400),
            font: new Font({
                family: "Arial",
                size: 20,
                unit: FontUnit.Px,
                color: Color.Gray
            }),
            anchor: new Vector(0.5, 0.5)
        });

        this.add(title);
        this.add(prompt);

        // Sample scores (replace with real ones later!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!)
        const scores = ["1. Alice - 100", "2. Bob - 80", "3. Carol - 60"];
        scores.forEach((score, i) => {
            this.add(new Label({
                text: score,
                pos: new Vector(engine.drawWidth / 2, 160 + i * 40),
                font: new Font({
                    family: "Arial",
                    size: 24,
                    unit: FontUnit.Px,
                    color: Color.Black
                }),
                anchor: new Vector(0.5, 0.5)
            }));
        });
    }

    onActivate(ctx) {
        ctx.engine.input.keyboard.once("press", (evt) => {
            if (evt.key === Keys.Space) {
                ctx.engine.startGame();
            }
        });
    }
}
