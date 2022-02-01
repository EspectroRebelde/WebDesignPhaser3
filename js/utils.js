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

export function AABB(object1, object2) {
    let r1x = object1.sprite.x;
    let r1y = object1.sprite.y;
    let r1w = object1.sprite.body.width;
    let r1h = object1.sprite.body.height;

    let r2x = object2.sprite.x;
    let r2y = object2.sprite.y;
    let r2w = object1.sprite.body.width;
    let r2h = object1.sprite.body.height;

    if (r1x + r1w >= r2x &&    // r1 right edge past r2 left
      r1x <= r2x + r2w &&    // r1 left edge past r2 right
      r1y + r1h >= r2y &&    // r1 top edge past r2 bottom
      r1y <= r2y + r2h) {    // r1 bottom edge past r2 top
        return true;
    }

    return false;
}

function distanceBetweenTwoPoints(x1,y1,x2,y2, maxDistance) {


}