export default class Bullet {
    constructor(scene, x, y, texture,bulltes,bulletGroup,velocity) {      
      this.scene = scene;
      this.damage =25;
    // Create the sprite and add physics
      this.sprite = this.scene.physics.add.sprite(x, y, texture).setOrigin(0.5).setDisplaySize(20, 20);

      bulltes.push(this);
      bulletGroup.add(this.sprite);

      this.sprite.setImmovable(true);
      this.sprite.setVelocityX(velocity);

      this.isActive = true;
  }

  update() {
    if(!this.isActive)return;
    if (this.sprite.x > 1260) {
      this.destroy();
    }
  }
  
  destroy() {
    this.isActive=false
    this.sprite.destroy();
  }
}
  