import '../css/style.css'
import { Actor, Engine, Vector, DisplayMode, Color, CollisionType, SolverStrategy, Shape, Scene, Label, Font, FontUnit } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { Background } from './background.js'
import { Platform } from "./platform.js"
import { Obstacle, RedBarrel, GreenBarrel } from "./obstacles.js";
import { Player } from "./player.js";
import { Leaderboard } from "./leaderboard.js";
import { GameOverScene } from "./gameOverScene.js";
import { Bird } from "./enemies.js";
import { Hearts } from "./hearts.js";
import { Medpack } from "./medpack.js";

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
        console.log("Going to scene:", this.currentScene);                          // Debugging

        const scene = this.gameScene;
        scene.actors.forEach(actor => actor.kill());                                // Clears all actors from previous game

        this.platforms = [];
        this.obstacles = [];

        const bg1 = new Background(Resources.Background.toSprite(), 400, 300);
        const bg2 = new Background(Resources.Background.toSprite(), 1200, 300);
        scene.add(bg1);
        scene.add(bg2);

        const platformWidth = 150;
        const platformHeight = 20;
        const platformY = 580;
        let x = 0;

        for (let i = 0; i < 12; i++) {
            const platform = new Platform(x + platformWidth / 2, platformY, platformWidth, platformHeight);
            scene.add(platform);
            this.platforms.push(platform);
            x += platformWidth;
        }

        this.player = new Player(200, 510);
        scene.add(this.player);

        // Player Hearts
        this.hearts = new Hearts();
        scene.add(this.hearts);
        this.hearts.resetHearts();                                               // Resets to 3 hearts

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
        const scene = engine.currentScene;

        if (this.platforms.length > 0) {
            // Adjusts platform speed based on score
            // for (let platform of this.platforms) {
            //     platform.speed = 150 + this.score * 2;                // Increases speed as score goes up
            // }

            const platformSpeed = 100 + this.score * 2;

            for (let platform of this.platforms) {
                platform.speed = platformSpeed;
                platform.pos.x -= (platform.speed * delta) / 1000;
            }

            // Safely get the rightmost platform using reduce
            let rightmostPlatform = this.platforms.reduce((rightmost, p) => {
                const rightEdge = p.pos.x + p.width / 2;
                const currentRightEdge = rightmost.pos.x + rightmost.width / 2;
                return rightEdge > currentRightEdge ? p : rightmost;
            });

            let rightmostX = rightmostPlatform.pos.x + rightmostPlatform.width / 2;

            // Move and recycle platforms
            let recycledThisFrame = [];

            for (let platform of this.platforms) {
                platform.pos.x -= (platform.speed * delta) / 1000;

                if (platform.pos.x + platform.width / 2 < 0) {
                    platform.pos.x = rightmostX + platform.width / 2;
                    rightmostX = platform.pos.x + platform.width / 2;

                    recycledThisFrame.push(platform);                                         // Tracks recycled platform
                }
            }

            // Add obstacle on the recycled platform
            for (let recycledPlatform of recycledThisFrame) {
                if (Math.random() < 0.2) {                                                    // Adjust spawn rate here
                    const obstacleX = 0;
                    const obstacleY = - 30;
                    let obstacle;

                    if (Math.random() < 0.5) {
                        obstacle = new RedBarrel(obstacleX, obstacleY);
                    } else {
                        obstacle = new GreenBarrel(obstacleX, obstacleY);
                    }

                    recycledPlatform.addChild(obstacle);
                    // console.log("Spawned obstacle at relative pos", obstacle.pos);         // Debugging
                    this.obstacles.push(obstacle);
                    // console.log("Added obstacle:", obstacle, "child of", obstacle.parent); // Debugging
                }

                if (Math.random() < 0.20) {                                                   // X% chance
                    const medpack = new Medpack(50, -30);                                     // Position relative to platform
                    recycledPlatform.addChild(medpack);
                    console.log("Spawned a medpack at", medpack.pos.toString());
                }
            }
        }

        // Flying enemies
        if (Math.random() < 0.005) {
            const bird = new Bird(800, 120 + Math.random() * 60);
            this.gameScene.add(bird);
            console.log("Spawned a bird at", bird.pos.toString());
        }

        // Clean up dead obstacles
        this.obstacles = this.obstacles.filter(obstacle => !obstacle.isKilled());

        // Update score only if label is active
        if (this.scoreLabel) {
            this.elapsedTime += delta;
            const seconds = Math.floor(this.elapsedTime / 1000);
            this.score = seconds;
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
