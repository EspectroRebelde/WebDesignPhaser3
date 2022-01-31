export default class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    setVector(x, y) {
        this.x = x;
        this.y = y;
    }
}

//normalize a vector to get the direction
function getDirection2Points(xOrigin, yOrigin, xDestination, yDestination) {
    let x = xDestination - xOrigin;
    let y = yDestination - yOrigin;

    let distance = Math.sqrt(x * x + y * y);

    return new Vector2D(x / distance, y / distance);
}


