import { Actor, Vector, Color, CollisionType, Shape } from "excalibur";
import { Resources } from "./resources.js";

export class Medpack extends Actor {
  constructor(x, y) {
    super({
      pos: new Vector(x, y),
      width: 20,
      height: 20,
      color: Color.Purple,                                                  // Replace with sprite later!!!!!!!!!!
      collisionType: CollisionType.Passive
    });

    this.name = "medpack";
    this.isMedpack = true;
  }

  onInitialize() {
    if (Resources.Medpack) {
      this.graphics.use(Resources.Medpack.toSprite());
    } else {
      // Fallback color box if sprite is missing
      this.graphics.use(this.graphics.current); 
    }

    this.collider.set(Shape.Box(this.width, this.height));
  }
}
