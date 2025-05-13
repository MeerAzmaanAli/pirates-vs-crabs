import Bullet from "./bullet.js";

class Pirate {
    constructor(scene, x, y, type = 'cannon') {
      this.scene = scene;
      this.x = x;
      this.y = y;
      this.type = type;
      this.startAttack =false;
      this.isAlive = true;

      this.setPirateProperties();
      // Create sprite
      this.sprite = this.scene.physics.add.sprite(x+10, y-15, this.spriteKey).setOrigin(0.5);
      if(this.type=="barrel"){
        this.sprite.setScale(0.1);
      }else{
        this.sprite.setScale(0.15); // Adjust size if needed
      }

      this.sprite.setImmovable(true);
      this.sprite.body.pushable = false;
      
      this.crabsInContact =[];
      this.crabIndex=0;
      this.lastAttackTime = 0; // Track attack timing for shooting

      // Add health bar
      this.healthBar = this.createHealthBar();
      this.updateHealthBar();
    }
  
    // Set different properties based on pirate type
    setPirateProperties() {
      switch (this.type) {
        case 'cannonPirate':
          this.health = 300;
          this.attackRate = 5000;
          this.damage = 70;
          this.spriteKey = 'cannonPirate';
          this.startAttack =true;
          break;
    
        case 'harpoonPirate':
          this.health = 200;
          this.attackRate = 2000;
          this.damage = 50;
          this.spriteKey = 'harpoonPirate';
          break;
    
        case 'hidingPirate':
          this.health = 275;
          this.attackRate = 2000;
          this.damage = 35;
          this.spriteKey = 'hidingPirate';
          break;
          case 'barrel':
            this.health = 400;
            this.attackRate = 99999999;
            this.damage = 0;
            this.spriteKey = 'barrel';
            break;
        default:
          this.health = 200;
          this.attackRate = 2000;
          this.damage = 35;
          this.spriteKey = 'harpoonPirate';
          break;
      }
    }
    update(time, bulltes, bulletGroup, pirateSprites, pirateInstances) {
        if (!this.isAlive) return;
        
        // Update health bar position to follow pirate
        if (this.healthBar) {
            this.healthBar.container.setPosition(this.sprite.x, this.sprite.y - 50);
        }
        
        this.tryAttack(time, bulltes, bulletGroup);
        if (this.health <= 0) {
            this.destroy(pirateInstances);
        }
    }

    tryAttack(time,bulltes,bulletGroup){
      if(!this.startAttack || !this.isAlive)return;
      if(this.type=="barrel"){
        return;
      }
      if (time > this.lastAttackTime + this.attackRate) {
        if(this.type=="cannonPirate"){
          this.shoot(bulltes,bulletGroup);
        }else{

          if(this.type=="harpoonPirate"){
            this.harpoonAttack();

          }else if(this.type =="hidingPirate"){
            this.hidingAttack();
          }
        }
        this.lastAttackTime = time;
      }
    }

    // Shooting logic
    shoot(bulltes,bulletGroup) {
      const bullet = new Bullet(this.scene, this.sprite.x + 70, this.sprite.y, 'cannonBall',bulltes,bulletGroup,200);
      console.log('shoooot');
    }

    //harpoon logic
    harpoonAttack(){
      if (this.crabIndex >= this.crabsInContact.length) {
        this.crabIndex = 0;
        return;
    }

    const crab = this.crabsInContact[this.crabIndex];
    if (!crab || !crab.isActive) {
        this.crabsInContact.splice(this.crabIndex, 1);
        return;
    }

    crab.takeDamage(this.damage);

    if (crab.health <= 0) {
        this.crabsInContact.splice(this.crabIndex, 1);
    } else {
        this.crabIndex++;
    }
    }

    //hiding pirate logic
    hidingAttack(){
      if (this.crabIndex >= this.crabsInContact.length) {
        this.crabIndex = 0;
        return;
    }

    const crab = this.crabsInContact[this.crabIndex];
    if (!crab || !crab.isActive) {
        this.crabsInContact.splice(this.crabIndex, 1);
        return;
    }

    crab.takeDamage(this.damage);

    if (crab.health <= 0) {
        this.crabsInContact.splice(this.crabIndex, 1);
    } else {
        this.crabIndex++;
    }
    }
    // When pirate takes damage
    takeDamage(amount) {
      if(this.health<=0){
        return;
      }
      this.health -= amount;
      this.updateHealthBar();
    }
    // Destroy pirate
    destroy(pirateInstances) {
      
      this.isAlive = false;
    
      // Reset all crabs that were in contact with this pirate
      this.crabsInContact.forEach(crab => {
          if (crab && crab.pirate === this) {
              crab.resetCrab();
          }
      });
      this.crabsInContact = [];
      
      // Remove from physics group
      this.sprite.destroy();
      
      // Remove from piratesInstances array
      const index = this.scene.piratesInstances.indexOf(this);
      if (index !== -1) {
          this.scene.piratesInstances.splice(index, 1);
      }

      // Destroy health bar
      if (this.healthBar) {
          this.healthBar.container.destroy();
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
            case 'cannonPirate': return 300;
            case 'harpoonPirate': return 200;
            case 'hidingPirate': return 275;
            case 'barrel': return 400;
            default: return 200;
        }
    }
  }
  
  export default Pirate;
  