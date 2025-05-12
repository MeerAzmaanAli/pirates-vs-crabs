import Phaser from 'phaser';
import Pirate from '../gameobjects/pirate';
import Crab from '../gameobjects/crab';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.selectedPirate = null;
        this.gold = 500; // Starting gold
        this.goldPerSecond = 5; // Gold generation rate
        this.lastGoldUpdate = 0;
        this.goldUpdateInterval = 1000; // Update every second

        // Define pirate costs
        this.pirateCosts = {
            'cannonPirate': 100,
            'harpoonPirate': 50,
            'hidingPirate': 75,
            'barrel': 20
        };


        this.currentWave = 'easy'; 
        this.isSpawning = true; // Flag to control if crabs should spawn
        this.crabs = [];
        this.piratebulletsInstances=[];
        this.waveTimers = {
        easy: 20000,    // 20 seconds easy wave
        medium: 30000,  // 20 seconds medium wave
        hard: 30000     // 10 seconds hard wave
        };

        this.waveOrder = ['easy', 'medium', 'hard']; // Sequence of waves
        this.currentWaveIndex = 0;
      }

  create() {
    this.setBackground();
    this.createGrid();
    this.createPirateSelectionUI();
    this.createGoldUI();
    this.startGoldGeneration();
     // Initialize pirate and crab groups with physics
     this.crabs = new Map();

     this.pirateSprites = this.physics.add.group();
     this.piratesInstances = [];
     this.physics.add.collider(this.pirateSprites, null, this.handleCollision, null, this);

     this.piratebulletSprites = this.physics.add.group();
     this.piratebulletsInstances=[];
     this.physics.add.collider(this.piratebulletSprites, null, this.handlePirateBulletHit, null, this);

     this.crabbulletSprites = this.physics.add.group();
     this.crabbulletsInstances=[];
     this.physics.add.collider(this.crabbulletSprites, null, this.handleCrabBulletHit, null, this);

    this.currentWave = 'easy'; // Start with easy
    //Start spawning crabs
    this.startWave();
    // Add text or other game objects here (e.g. title)
    this.add.text(20, 20, 'Pirates vs Crabs!', {
      font: '24px Arial',
      fill: '#ffffff'
    });
  }
  update(time, delta) {
    // Call update on each crab object
    this.crabs.forEach((sprite, crab) => {
      crab.update(time,this.crabbulletsInstances,this.crabbulletSprites);
    });
    this.piratesInstances.forEach(pirate => {
      pirate.update(time,this.piratebulletsInstances,this.piratebulletSprites,this.pirateSprites,this.piratesInstances);
     // this.bullets.push(bullet);
     // this.bulletGroup.add(bullet.sprite);
    }
    );

    this.piratebulletsInstances.forEach(bullet => bullet.update());
    
  }

  setBackground(){
    //Add background image and scale it to fit screen
    const bg = this.add.image(0, 0, 'deck').setOrigin(0, 0);
    const scaleX = this.sys.game.config.width / bg.width;
    const scaleY = this.sys.game.config.height / bg.height;
    const scale = Math.min(scaleX, scaleY);
    bg.setScale(scale);
    bg.setOrigin(0, 0);
  }

  createGrid(){
    //Define the grid area on the deck
    const gridX = 300; // Starting X position of the grid
    const gridY = 160; // Starting Y position of the grid
    const gridWidth = this.sys.game.config.width - 100; // width of grid
    const gridHeight = this.sys.game.config.height - 200; // height of grid
    
    const lanes = 4;
    const columns = 9;
  
    //Calculate lane and column size within the grid area
    const laneHeight = gridHeight / lanes;
    const columnWidth = gridWidth / columns;
  
    //Create invisible buttons as grid cells
    for (let i = 0; i < lanes; i++) {
      for (let j = 0; j < columns-3; j++) {
        // Define the position of each cell on the grid
        const x = gridX + columnWidth * j;
        const y = gridY + laneHeight * i;
  
        // Create transparent button at this position
        let button = this.add.image(x, y, 'grid').setInteractive();
        button.setOrigin(0.5, 0.5); // Center the button in the grid cell
        button.setScale(0.03);
  
        // Add click event to button (you can change this to a drag event later)
        button.on('pointerdown', () => {
          // Example: Add a pirate when button is clicked
          if (!this.selectedPirate) {
            console.log("No pirate selected!");
            return;
          }  
          console.log(button.x," ",button.y);
          this.placePirate(x, y);

          button.off('pointerdown');
          button.setInteractive(false);
        });
      }
    }
  }

  createPirateSelectionUI() {
    
    const buttonHeight = 100;
    const buttonWidth = 100;
    const buttonMargin = 5;
    const initialY = 200;
    const rightEdgeX = this.sys.game.config.width - buttonWidth - buttonMargin;

    const drawerBg = this.add.sprite(rightEdgeX, 360, "drawer");
    drawerBg.setScale(1.5);

    // Create buttons with costs
    this.createPirateButton(rightEdgeX, initialY, 'cannonPirate', this.pirateCosts.cannonPirate);
    this.createPirateButton(rightEdgeX, initialY + buttonHeight + buttonMargin, 'harpoonPirate',this.pirateCosts.harpoonPirate);
    this.createPirateButton(rightEdgeX, initialY + (buttonHeight + buttonMargin) * 2, 'hidingPirate',this.pirateCosts.hidingPirate);
    this.createPirateButton(rightEdgeX, initialY + (buttonHeight + buttonMargin) * 3, 'barrel', this.pirateCosts.barrel);
  
  }
  createPirateButton(x, y, type, cost) {
    const button = this.add.sprite(x, y, type).setInteractive();
    button.setDisplaySize(90, 90);

    // Add cost text
    const costText = this.add.text(x, y + 50, `${cost}`, {
        font: '16px Arial',
        fill: '#FFD700'
    });
    costText.setOrigin(0.5);

    button.on('pointerdown', () => {
        if (this.gold >= cost) {
            this.selectPirate(type);
        } else {
            this.showNotEnoughGoldMessage();
        }
    });

    // Add hover effect to show if affordable
    button.on('pointerover', () => {
        if (this.gold >= cost) {
            button.setTint(0x00ff00);
        } else {
            button.setTint(0xff0000);
        }
    });

    button.on('pointerout', () => {
        button.clearTint();
    });
  }

  // Set selected pirate when button is clicked
  selectPirate(pirateKey) {
    this.selectedPirate = pirateKey;
  };
  // Function to place pirate on grid
  placePirate(x, y) {

    if (!this.selectedPirate) {
      console.log("No pirate selected!");
      return;
  }

  const cost = this.pirateCosts[this.selectedPirate];
  if (this.gold < cost) {
      // Show "not enough gold" message
      this.showNotEnoughGoldMessage();
      return;
  }

  // Deduct gold
  this.gold -= cost;
  this.updateGoldDisplay();

  const pirate = new Pirate(this, x, y, this.selectedPirate);
  this.pirateSprites.add(pirate.sprite);
  this.piratesInstances.push(pirate);

  this.physics.add.collider(this.crabbulletSprites, pirate.sprite, this.handleCrabBulletHit, null, this);
  pirate.sprite.setImmovable(true);
  }
  createGoldUI() {
    // Create gold icon
    this.goldIcon = this.add.image(20, 60, 'gold_coin').setScale(0.5);
    
    // Create gold text
    this.goldText = this.add.text(50, 50, `Gold: ${this.gold}`, {
        font: '20px Arial',
        fill: '#FFD700'
    });
}

  startGoldGeneration() {
      this.time.addEvent({
          delay: this.goldUpdateInterval,
          callback: this.updateGold,
          callbackScope: this,
          loop: true
      });
  }

  updateGold() {
      this.gold += this.goldPerSecond;
      this.updateGoldDisplay();
  }

  updateGoldDisplay() {
      this.goldText.setText(`Gold: ${this.gold}`);
  }
  
  showNotEnoughGoldMessage() {
    const message = this.add.text(400, 300, 'Not Enough Gold!', {
        font: '24px Arial',
        fill: '#ff0000'
    });
    
    this.time.delayedCall(1000, () => {
        message.destroy();
    });
}

  startWave() {
    this.spawnEvent = this.time.addEvent({
      delay: 5000,
      callback: () => {
        if (this.isSpawning) {
          const crabType = this.getCrabTypeForWave();
          const y = Phaser.Math.RND.pick([150, 290, 420, 550]);
          const x = 1100;

          const crab = new Crab(this, x, y, crabType);
          this.crabs.set(crab, crab.sprite);

          // Set up collision for this crab
          this.physics.add.collider(this.pirateSprites, crab.sprite, this.handleCollision, null, this);
          this.physics.add.collider(this.piratebulletSprites, crab.sprite, this.handlePirateBulletHit, null, this);
        }
      },
      callbackScope: this,
      loop: true
    });
      // Start the timer to change wave
      this.scheduleNextWave();
  }
      
  getCrabTypeForWave() {
    if (this.currentWave === 'easy') {
      return 'normal';
    } else if (this.currentWave === 'medium') {
      return Phaser.Math.RND.pick(['normal', 'armoured']);
    } else if (this.currentWave === 'hard') {
      return Phaser.Math.RND.pick(['normal', 'armoured', 'octopus','octopus']);
    }
  }

  scheduleNextWave() {
    const currentWaveTime = this.waveTimers[this.currentWave];
  
    this.time.delayedCall(currentWaveTime, () => {
      this.isSpawning = false; // Stop crab spawning for break
  
      // Small pause between waves (example: 5 sec break)
      this.time.delayedCall(5000, () => {
        // Move to next wave
        this.currentWaveIndex++;
        if (this.currentWaveIndex < this.waveOrder.length) {
          this.currentWave = this.waveOrder[this.currentWaveIndex];
          this.isSpawning = true;
  
          this.scheduleNextWave(); // Schedule next wave timer again
        } else {
          console.log('All waves finished!'); 
          // maybe trigger win condition or endless mode here
        }
      }, [], this);
  
    }, [], this);
  }
  
  handlePirateBulletHit(crab,bullet) {
    const b = this.getInstance(this.piratebulletSprites,this.piratebulletsInstances,bullet);
    const c = this.getCrabInstance(this.crabs,crab);

    c.takeDamage(b.damage)
    bullet.x = 1280;
    bullet.destroy();
    
  }
  handleCrabBulletHit(pirate,bullet) {
    const b = this.getInstance(this.crabbulletSprites,this.crabbulletsInstances,bullet);
    const p = this.getInstance(this.pirateSprites, this.piratesInstances, pirate);

    p.takeDamage(b.damage)
    bullet.x = -1280;
    bullet.destroy();
    
  }
  handleCollision(crab, pirateSprite) {
    const p = this.getInstance(this.pirateSprites, this.piratesInstances, pirateSprite);
    const c = this.getCrabInstance(this.crabs, crab);
    
    // Validate both objects are still active
    if (!p || !c || !p.isAlive || !c.isActive) return;
    
    // Remove from previous pirate's list if exists
    if (c.pirate && c.pirate !== p) {
        c.pirate.crabsInContact = c.pirate.crabsInContact.filter(crab => crab !== c);
    }
    // Update references
    c.pirate = p;
    c.startAttack = true;
    // Add to new pirate's list if not already there
    if (!p.crabsInContact.includes(c)) {
        p.crabsInContact.push(c);
    }
    
    p.startAttack = true;
    crab.setVelocity(0);
  }

  getInstance(spritesGroup, instancesGroup, sprite){
    return instancesGroup.find(instance => instance.sprite === sprite);
  }

  getCrabInstance(crabs,CrabSprite){
    for (const [crabInstance, sprite] of crabs) {
      if (sprite === CrabSprite) {
          return crabInstance;
      }
  }
  return null;
  }

}

