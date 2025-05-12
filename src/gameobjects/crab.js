import Bullet from "./bullet";

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

  update(time,bulltes,bulletGroup) {
    if (!this.isActive) return;
    
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
  }

  destroy() {
    if (this.pirate) {
        // Remove this crab from the pirate's crabsInContact array
        this.pirate.crabsInContact = this.pirate.crabsInContact.filter(crab => crab !== this);
        this.pirate = null;
    }
    this.sprite.destroy();
    this.isActive = false;
  }
  resetCrab(){

    this.startAttack = false;
    this.pirate = null;
    if (!this.isActive) return;
    if (this.sprite && this.sprite.body) {
        this.sprite.setVelocityX(-this.speed);
    }

  }
}
