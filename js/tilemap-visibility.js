/**
 * A small helper class that can take control of our shadow tilemap layer. It keeps track of which
 * room is currently active.
 */
export default class TilemapVisibility {
  constructor(shadowLayer, enemies) {
    this.shadowLayer = shadowLayer;
    this.activeRoom = null;
    this.enemies = enemies;
  }

  setActiveRoom(room) {
    // We only need to update the tiles if the active room has changed
    if (room !== this.activeRoom) {
      this.setRoomAlpha(room, 0); // Make the new room visible
      for(let i = 0; i < this.enemies.lenght; i++) {
        this.enemies[i].sprite.alpha = 0;
      }
      if (this.activeRoom){
        this.setRoomAlpha(this.activeRoom, 0.5); // Dim the old room
      }
      this.activeRoom = room;
    }
  }

  // Helper to set the alpha on all tiles within a room
  setRoomAlpha(room, alpha) {
    this.shadowLayer.forEachTile(
      (t) => (t.alpha = alpha),
      this,
      room.x,
      room.y,
      room.width,
      room.height
    );
  }
}
