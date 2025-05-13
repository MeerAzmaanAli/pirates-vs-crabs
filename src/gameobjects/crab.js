import Bullet from "./bullet.js";

export default class Crab {
  constructor(scene, x, y, crabType = 'normal') {
    this.scene = scene;
    this.type = crabType;
    this.startAttack =false;
   
    this.setPirateProperties();
      // Create sprite
    this.sprite = this.scene.physics.add.sprite(x, y, this.spriteKey).setOrigin(0.5)
    .setDisplaySize(80, 80);

    this.sprite.crabRef = this; // Optional: back reference to the object

    this.sprite.setVelocityX(-this.speed);
    this.sprite.setCollideWorldBounds(false);
    this.sprite.setImmovable(true);

    this.pirate=null;
    this.lastAttackTime=0;
    this.isActive = true;

    // Add health bar
    this.healthBar = this.createHealthBar();
    this.updateHealthBar();
  }
  setPirateProperties() {
    switch (this.type) {
      case 'octopus':
        this.health = 150;
        this.attackRate = 3000;
        this.speed=30;
        this.damage = 50;
        this.spriteKey = 'octoCrab';
        this.startAttack =true;
        break;
  
      case 'normal':
        this.health = 100;
        this.attackRate = 2000;
        this.speed=50;
        this.damage = 25;
        this.spriteKey = 'normalCrab';
        break;
  
      case 'armoured':
        this.health = 200;
        this.attackRate = 3000;
        this.speed=30;
        this.damage = 35;
        this.spriteKey = 'armouredCrab';
        break;
  
      default:
        this.health = 100;
        this.attackRate = 2000;
        this.speed=50;
        this.damage = 25;
        this.spriteKey = 'normalCrab';
        break;
    }
  }

  update(time, bulltes, bulletGroup) {
    if (!this.isActive) return;
    
    // Update health bar position to follow crab
    if (this.healthBar) {
        this.healthBar.container.setPosition(this.sprite.x, this.sprite.y - 50);
    }
    
    // Check if pirate reference is still valid
    if (this.pirate && (!this.pirate.isAlive || this.pirate.health <= 0)) {
        this.resetCrab();
    }
    
    this.tryAttack(time, bulltes, bulletGroup);

    if (this.sprite.x < -50 || this.health <= 0) {
        this.destroy();
    }

    // Check if crab has reached the left side
    if (this.sprite.x < 250) {
        this.scene.gameOver();
        return; // Stop further processing
    }
  }
  tryAttack(time,bulltes,bulletGroup){
    
    if(!this.startAttack)return;
    if(this.pirate && this.pirate.health<=0){
      this.resetCrab();
      return;
    }
    if (time > this.lastAttackTime + this.attackRate) {
      if(this.type=="octopus"){
        this.shoot(bulltes,bulletGroup);

      }else if(this.type=="normal" || this.type=='armoured'){
        
          this.normalAttack();
      }
      this.lastAttackTime = time;
     
    }
  }
  shoot(bulltes,bulletGroup) {
    const bullet = new Bullet(this.scene, this.sprite.x-50, this.sprite.y, 'octoBullet',bulltes,bulletGroup,-200);
    console.log('shoooot');
  }
  normalAttack(){
    
    if (!this.pirate || !this.pirate.isAlive) {
      this.resetCrab();
      return;
  }
  
  // Verify the pirate is still valid
  if (this.pirate.health <= 0) {
      this.resetCrab();
      return;
  }
  
  this.pirate.takeDamage(this.damage);
    
  }

  takeDamage(amount) {
    this.health -= amount;
    this.updateHealthBar();
  }

  destroy() {
    if (this.pirate) {
        // Remove this crab from the pirate's crabsInContact array
        this.pirate.crabsInContact = this.pirate.crabsInContact.filter(crab => crab !== this);
        this.pirate = null;
    }
    this.sprite.destroy();
    this.isActive = false;

    // Destroy health bar
    if (this.healthBar) {
        this.healthBar.container.destroy();
    }
  }
  resetCrab(){

    this.startAttack = false;
    this.pirate = null;
    if (!this.isActive) return;
    if (this.sprite && this.sprite.body) {
        this.sprite.setVelocityX(-this.speed);
    }

  }

  createHealthBar() {
    const barWidth = 50;
    const barHeight = 5;
    const graphics = this.scene.add.graphics();
    
    // Create container for the health bar
    const container = this.scene.add.container(this.sprite.x, this.sprite.y - 30);
    container.add(graphics);
    
    return {
        container: container,
        graphics: graphics,
        width: barWidth,
        height: barHeight
    };
  }

  updateHealthBar() {
    const healthPercent = this.health / this.getMaxHealth();
    const barWidth = this.healthBar.width * healthPercent;
    
    this.healthBar.graphics.clear();
    
    // Draw background (red)
    this.healthBar.graphics.fillStyle(0xff0000, 0.5);
    this.healthBar.graphics.fillRect(-this.healthBar.width/2, 0, this.healthBar.width, this.healthBar.height);
    
    // Draw health (green)
    this.healthBar.graphics.fillStyle(0x00ff00, 0.5);
    this.healthBar.graphics.fillRect(-this.healthBar.width/2, 0, barWidth, this.healthBar.height);
    
    // Update position to follow sprite
    this.healthBar.container.setPosition(this.sprite.x, this.sprite.y - 30);
  }

  getMaxHealth() {
    switch (this.type) {
        case 'octopus': return 150;
        case 'normal': return 100;
        case 'armoured': return 200;
        default: return 100;
    }
  }
}
