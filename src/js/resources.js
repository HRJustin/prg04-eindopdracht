import { ImageSource, Sound, Resource, Loader, ImageWrapping } from 'excalibur'

// voeg hier jouw eigen resources toe
// NAME: new ImageSource('images/NAME.png'),
const Resources = {
    // Background
    Background: new ImageSource('images/background.png'),
    // Enemies
    Fish: new ImageSource('images/fish.png'),
    // Player
    PlayerStanding: new ImageSource('images/standing-still.png'),
    PlayerWalking1: new ImageSource('images/walking-1.png'),
    PlayerWalking2: new ImageSource('images/walking-2.png'),
    PlayerSpriteSheet: new ImageSource('images/player-spritesheet.png'),
    Heart: new ImageSource('images/heart.png', { wrapping: ImageWrapping.Repeat, }),
    // Power Ups
    Medpack: new ImageSource('images/medpack.png')
}




const ResourceLoader = new Loader()
for (let res of Object.values(Resources)) {
    ResourceLoader.addResource(res)
}

export { Resources, ResourceLoader }