import { Actor, Vector, Color, CollisionType, Shape, Component, ColliderComponent } from "excalibur";

// Left movement component
class MovementComponent extends Component {
  constructor(speed = -100) {
    super("movement");
    this.speed = speed;
  }

  onPreUpdate(engine, delta) {
    this.owner.pos.x += this.speed * (delta / 1000);
    // console.log("Movement running", this.owner.pos.x);                                  // Debugging
  }

  onPostUpdate(engine, delta) {
    // console.log("Movement POST running", this.owner.pos.x);                               // Debugging
  }
}

// Hover effect component
class HoverComponent extends Component {
  constructor(amplitude = 20, speed = 2, initialY = 0) {
    super("hover");
    this.amplitude = amplitude;
    this.speed = speed;
    this.time = 0;
    this.initialY = initialY;
  }

  onPreUpdate(engine, delta) {
    this.time += delta / 1000;
    const offsetY = Math.sin(this.time * this.speed) * this.amplitude;
    this.owner.pos.y = this.owner.originalY + offsetY;
    // console.log("Hover running", this.owner.pos.y);                                     // Debugging
  }

  onPostUpdate(engine, delta) {
    // console.log("Hover POST running", this.owner.pos.x);                                // Debugging
  }
}

export class Bird extends Actor {
  constructor(x, y) {
    super({
      pos: new Vector(x, y),
      width: 40,
      height: 20,
      color: Color.Gray,
    });

    this.originalY = y;

    this.name = "bird";
    this.isEnemy = true;
    this.damage = 1;
  }

  onInitialize(engine) {
    // console.log(engine.currentScene.actors.includes(this))                                    // Debugging
    super.onInitialize(engine);
    // console.log(engine.currentScene.actors.includes(this))                                    // Debugging
    // console.log("Bird initialized", this.pos);                                                // Debugging
    const collider = new ColliderComponent();
    collider.set(Shape.Box(40, 20));
    collider.collisionType = CollisionType.Passive;
    this.addComponent(collider);
    // console.log(engine.currentScene.actors.includes(this))                                 // Debugging

    this.addComponent(new MovementComponent(-150));                  // Move left
    this.addComponent(new HoverComponent(15, 3, this.pos.y));        // Hover up & down
    // console.log("Components attached to bird:", this.components);                          // Debugging
  }

  onPreUpdate(engine, delta) {
    // console.log("Bird onPreUpdate", this.pos.x);                                           // Debugging
    super.onPreUpdate(engine, delta);

    const movement = this.get(MovementComponent);
    if (movement) movement.onPreUpdate(engine, delta);

    const hover = this.get(HoverComponent);
    if (hover) hover.onPreUpdate(engine, delta);

    // console.log("Bird onPreUpdate", this.pos.x);                                           // Debugging

    if (this.pos.x + this.width / 2 < 0) {
      this.kill(); // Cleans up when off screen
    }
  }
}