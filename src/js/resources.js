import { ImageSource, Sound, Resource, Loader } from 'excalibur'

// voeg hier jouw eigen resources toe
// NAME: new ImageSource('images/NAME.png'),
const Resources = {
    Background: new ImageSource('images/background.png'),
    Fish: new ImageSource('images/fish.png')
}




const ResourceLoader = new Loader()
for (let res of Object.values(Resources)) {
    ResourceLoader.addResource(res)
}

export { Resources, ResourceLoader }