import '../css/style.css'
import {Actor, Engine, Vector, DisplayMode} from "excalibur"
import {Resources, ResourceLoader} from './resources.js'

export class Game extends Engine {

    constructor() {
        super({ 
            width: 800,
            height: 600,
            maxFps: 60,
            displayMode: DisplayMode.FitScreen
        })
        this.start(ResourceLoader).then(() => this.startGame())
    }

    startGame() {
        console.log("start de game!")
        const fish = new Actor()
        fish.graphics.use(Resources.Fish.toSprite())
        fish.pos = new Vector(500, 300)
        fish.vel = new Vector(-10, 0)
        fish.events.on("exitviewport", (e) => this.fishLeft(e))
        this.add(fish)
    }

    fishLeft(e) {
        e.target.pos = new Vector(1350, 300)
    }
}

new Game()
