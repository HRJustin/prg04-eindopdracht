import '../css/style.css'
import { Actor, Engine, Vector, DisplayMode, Color, CollisionType, SolverStrategy, Shape, Scene, Label, Font, FontUnit } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Background } from './background.js'
import { Platform } from "./platform.js"
import { Obstacle } from "./obstacles.js";
import { Player } from "./player.js";
import { Leaderboard } from "./leaderboard.js";
import { GameOverScene } from "./gameOverScene.js";

export class Game extends Engine {
    constructor() {
        super({
            width: 800,
            height: 600,
            maxFps: 60,
            displayMode: DisplayMode.FitScreen,
            physics: {
                solver: SolverStrategy.Arcarde,
                gravity: new Vector(0, 800)
            }
        })

        // Score
        this.score = 0;
        this.elapsedTime = 0;
        this.scoreLabel = null;

        // Platforms, obstacles and background
        this.platforms = []
        this.obstacles = []
        this.backgroundColor = Color.White
        this.add("gameover", new GameOverScene());

        this.gameScene = new Scene();
        this.add("game", this.gameScene);

        this.showDebug(true);                                                       // For Debugging

        this.start(ResourceLoader).then(() => {
            this.add("leaderboard", new Leaderboard());
            this.goToScene("leaderboard");
        });

    }

    startGame() {
        this.goToScene("game");
        console.log("Going to scene:", this.currentScene.name);                     // Debugging

        const scene = this.gameScene;
        scene.actors.forEach(actor => actor.kill()); // Clears all actors from previous game

        this.platforms = [];
        this.obstacles = [];

        const bg1 = new Background(Resources.Background.toSprite(), 400, 300);
        const bg2 = new Background(Resources.Background.toSprite(), 1200, 300);
        scene.add(bg1);
        scene.add(bg2);

        const platformWidth = 150;
        const platformHeight = 20;
        const platformY = 580;
        const playerY = 510;
        let x = 0;

        for (let i = 0; i < 10; i++) {
            const createPlatform = Math.random() > 0.01;

            if (createPlatform) {
                const platform = new Platform(x + platformWidth / 2, platformY, platformWidth, platformHeight);
                scene.add(platform);
                this.platforms.push(platform);
                x += platformWidth;
            } else {
                const gapWidth = Math.random() * (100 - 60) + 60;
                x += gapWidth;
            }
        }

        this.player = new Player(200, playerY);
        scene.add(this.player);

        this.player.on("collisionstart", (evt) => {
            console.log("Collision listener triggered");                      // Debugging
            // console.log("Player collision with:", evt.other);              // For Debugging Collision
            if (evt.other instanceof Obstacle) {
                const finalScore = this.score;
                const gameOverScene = this.scenes.gameover;
                // gameOverScene.showFinalScore(finalScore);
                console.log("Switching to gameover with score:", this.score); // Debugging
                this.goToScene("gameover", { score: this.score });
                console.log("Going to scene:", this.currentScene.name);       // Debugging
            }
        });

        this.score = 0;
        this.elapsedTime = 0;

        this.scoreLabel = new Label({
            text: "Score: 0",
            pos: new Vector(20, 20),
            font: new Font({
                family: "Arial",
                size: 24,
                unit: FontUnit.Px,
                color: Color.Black
            }),
            anchor: new Vector(0, 0)
        });

        scene.add(this.scoreLabel);
    }

    onPreUpdate(engine, delta) {
        let scene = engine.currentScene;
        let rightmostX = Math.max(...this.platforms.map(p => p.pos.x + p.width / 2)) // Tracks rightmost platform
        let rightmostPlatform = this.platforms.find(p => p.pos.x === rightmostX)

        for (let platform of this.platforms) {
            platform.pos.x -= (platform.speed * delta) / 1000

            if (platform.pos.x + platform.width / 2 < 0) {
                const createGap = Math.random() < 0.30
                const minGap = 60
                const maxGap = 100
                const gap = createGap ? Math.random() * (maxGap - minGap) + minGap : 0

                platform.pos.x = rightmostX + platform.width + gap
                rightmostX = platform.pos.x
                rightmostPlatform = platform // updates the rightmost platform reference

                // platform.pos.x = rightmostX + gap + platform.width / 2 // Moves platform to the right of the rightmost platform + gap
                // rightmostX = platform.pos.x + platform.width / 2       // Updates rightmostX if this platform is placed
            }
        }

        if (Math.random() < 0.50 && rightmostPlatform) {
            const obstacleX = rightmostPlatform.pos.x
            const obstacleY = rightmostPlatform.pos.y - 30       // sits on top
            const obstacle = new Obstacle(obstacleX, obstacleY)

            scene.add(obstacle);
            if (this.currentScene.actors.includes(obstacle)) {
                this.obstacles.push(obstacle);
            }
        }
        this.obstacles = this.obstacles.filter(o => !o.isKilled());

        // Update score
        this.elapsedTime += delta;

        const seconds = Math.floor(this.elapsedTime / 1000);
        this.score = seconds;

        if (this.scoreLabel) {
            this.scoreLabel.text = `Score: ${this.score}`;
        }
    }
}

new Game()

// import {Leaderboard} from './leaderboard.js'
// import {gameOverScreen} from './gameOverScreen.js'
//     startGame() {
//         this.add('leaderboard', new Leaderboard());


//         this.goToScene('leaderboard');

//         console.log("start de game!")
//         const fish = new Actor()
//         fish.graphics.use(Resources.Fish.toSprite())
//         fish.pos = new Vector(500, 300)
//         fish.vel = new Vector(-10, 0)
//         fish.events.on("exitviewport", (e) => this.fishLeft(e))
//         this.add(fish)
//     }

//     fishLeft(e) {
//         e.target.pos = new Vector(1350, 300)
//     }
// }

// new Game()
