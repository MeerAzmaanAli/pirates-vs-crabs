import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.esm.js';
import Pirate from '../gameobjects/pirate.js';
import Crab from '../gameobjects/crab.js';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.selectedPirate = null;

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
        easy: 30000,    // 30 seconds easy wave
        medium: 30000,  // 30 seconds medium wave
        hard: 30000     // 30 seconds hard wave
        };

        this.waveOrder = ['easy', 'medium', 'hard']; // Sequence of waves
        this.currentWaveIndex = 0;
      }

  init(data) {
    this.currentLevel = data.level || 1;
    
    // Initialize empty collections first
    this.crabs = new Map();
    this.piratesInstances = [];
    this.piratebulletsInstances = [];
    this.crabbulletsInstances = [];
    
    
        // Reset game state 
    this.resetGameState();
    // Set level configuration
    this.setLevelConfig();

  }

  setLevelConfig() {
    // Set level-specific configurations
    switch(this.currentLevel) {
        case 1:
            this.availablePirates = ['harpoonPirate'];
            this.availableCrabs = ['normal'];
            this.waveOrder = ['easy'];
            this.gold=150;
            this.waveTimers = { easy: 30000 };
            break;
        case 2:
            this.availablePirates = ['harpoonPirate', 'hidingPirate'];
            this.availableCrabs = ['normal', 'armoured'];
            this.waveOrder = ['easy', 'medium'];
            this.gold=300;
            this.waveTimers = { easy: 30000, medium: 30000 };
            break;
        case 3:
            this.availablePirates = ['harpoonPirate', 'hidingPirate', 'cannonPirate'];
            this.availableCrabs = ['normal', 'armoured', 'octopus'];
            this.waveOrder = ['easy', 'medium', 'hard'];
            this.gold=400;
            this.waveTimers = { easy: 20000, medium: 30000, hard: 30000 };
            break;
        case 4:
            this.availablePirates = ['harpoonPirate', 'hidingPirate', 'cannonPirate','barrel'];
            this.availableCrabs = ['normal', 'armoured', 'octopus'];
            this.waveOrder = ['easy', 'medium', 'hard'];
            this.gold=500;
            this.waveTimers = { easy: 20000, medium: 30000, hard: 40000 };
            break;
    }
  }

  create() {
    // Initialize physics groups first
    this.pirateSprites = this.physics.add.group();
    this.piratebulletSprites = this.physics.add.group();
    this.crabbulletSprites = this.physics.add.group();
    
    // Set up collisions
    this.physics.add.collider(this.pirateSprites, null, this.handleCollision, null, this);
    this.physics.add.collider(this.piratebulletSprites, null, this.handlePirateBulletHit, null, this);
    this.physics.add.collider(this.crabbulletSprites, null, this.handleCrabBulletHit, null, this);

    // Create UI and game elements
    this.setBackground();
    this.createGrid();
    this.createPirateSelectionUI();
    this.createGoldUI();
    this.createWaveProgressBar();
    this.startGoldGeneration();

    // Start the game
    this.currentWave = 'easy';
    this.isSpawning = true;
    this.startWave();

    // Play background music
    this.gameMusic = this.sound.add('gameBgm', {
        volume: 0.5,
        loop: true
    });
    this.gameMusic.play();
    this.events.on('shutdown', this.shutdown, this);
  }
  shutdown() {
    // Stop the music when leaving the scene
    if (this.gameMusic) {
        this.gameMusic.stop();
    }
}
  update(time, delta) {
    // Update wave progress bar
    if (this.waveBar) {
        const elapsed = time - this.waveStartTime;
        const progress = Math.max(0, Math.min(elapsed / (this.waveDuration+5000), 1));
        this.waveBar.clear();
        this.waveBar.fillStyle(0xc33e2f, 1);
        this.waveBar.fillRect(1100, 50, 150 * progress, 10);
    }

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
    const bg = this.add.image(0, 0, 'deck').setOrigin(0, 0).setDisplaySize(1280, 720);

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
          const success = this.placePirate(x, y);
          if (success) {
            button.off('pointerdown');
            button.setInteractive(false);
          }

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

    // Only create buttons for available pirates
    this.availablePirates.forEach((type, index) => {
        const y = initialY + (buttonHeight + buttonMargin) * index;
        this.createPirateButton(rightEdgeX, y, type, this.pirateCosts[type]);
    });
  
  }
  createPirateButton(x, y, type, cost) {
    const button = this.add.sprite(x, y, type).setInteractive();
    button.setDisplaySize(90, 90);

    // Add cost text
    this.add.image(x+15, y + 30, 'gold_coin').setScale(0.035);
    const costText = this.add.text(x+35, y + 30, `${cost}`, {
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
      return false;
  }

  const cost = this.pirateCosts[this.selectedPirate];
  if (this.gold < cost) {
      // Show "not enough gold" message
      this.showNotEnoughGoldMessage();
      return false;
  }

  // Deduct gold
  this.gold -= cost;
  this.updateGoldDisplay();

  const pirate = new Pirate(this, x, y, this.selectedPirate);
  this.pirateSprites.add(pirate.sprite);
  this.piratesInstances.push(pirate);

  this.physics.add.collider(this.crabbulletSprites, pirate.sprite, this.handleCrabBulletHit, null, this);
  pirate.sprite.setImmovable(true);
  return true;
  }
  createGoldUI() {
    // Create gold icon
    this.goldIcon = this.add.image(25, 60, 'gold_coin').setScale(0.07);
    
    // Create gold text
    this.goldText = this.add.text(50, 50, `Gold: ${this.gold}`, {
      fontFamily: '"Permanent Marker"',
      fontSize: '26px',
      stroke: '#000000',
      strokeThickness: 3,
      fill: '#e1a21f'
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
    // Remove any existing spawn event
    if (this.spawnEvent) {
        this.spawnEvent.remove();
    }

    // Create new spawn event
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
        this.waveBar.clear(); // Clear the progress bar during break
  
        // Small pause between waves (example: 5 sec break)
        this.time.delayedCall(5000, () => {
            // Move to next wave
            this.currentWaveIndex++;
            if (this.currentWaveIndex < this.waveOrder.length) {
                this.currentWave = this.waveOrder[this.currentWaveIndex];
                this.isSpawning = true;
                
                // Update wave text and reset progress bar
                this.waveText.setText(`Wave: ${this.currentWave.charAt(0).toUpperCase() + this.currentWave.slice(1)}`);
                this.waveStartTime = this.time.now + 5000;
                this.waveDuration = this.waveTimers[this.currentWave]+5000;
                
                this.scheduleNextWave(); // Schedule next wave timer again
            } else {
                console.log('All waves finished!');
                // Start checking for level completion
                this.startLevelCompletionCheck();
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

  // Add new method to check for level completion
  startLevelCompletionCheck() {
    // Create a repeating timer to check for level completion
    this.levelCompletionTimer = this.time.addEvent({
        delay: 1000, // Check every second
        callback: this.checkLevelCompletion,
        callbackScope: this,
        loop: true
    });
  }

  // Add new method to check if level is complete
  checkLevelCompletion() {
    // Check if all crabs are defeated
    let allCrabsDefeated = true;
    this.crabs.forEach((sprite, crab) => {
        if (crab.isActive) {
            allCrabsDefeated = false;
        }
    });

    // If all crabs are defeated and all waves are finished
    if (allCrabsDefeated && this.currentWaveIndex >= this.waveOrder.length) {
        // Stop the completion check timer
        if (this.levelCompletionTimer) {
            this.levelCompletionTimer.remove();
        }

        // Stop all game processes
        this.isSpawning = false;
        if (this.spawnEvent) {
            this.spawnEvent.remove();
        }

        // Stop all pirates
        this.piratesInstances.forEach(pirate => {
            if (pirate.isAlive) {
                pirate.startAttack = false;
            }
        });

        // Stop gold generation
        if (this.goldGenerationEvent) {
            this.goldGenerationEvent.remove();
        }

        // Unlock next level
        this.unlockNextLevel();

        // Start the level complete scene
        this.scene.start('LevelCompleteScene', { level: this.currentLevel });
    }
  }

  // Add new method to unlock next level
  unlockNextLevel() {
    const nextLevel = this.currentLevel + 1;
    const unlockedLevels = JSON.parse(localStorage.getItem('unlockedLevels') || '[1]');
    if (!unlockedLevels.includes(nextLevel)) {
        unlockedLevels.push(nextLevel);
        localStorage.setItem('unlockedLevels', JSON.stringify(unlockedLevels));
    }
  }

  gameOver() {
    // Stop all game processes
    this.isSpawning = false;
    if (this.spawnEvent) {
        this.spawnEvent.remove();
    }

    // Stop all crabs
    this.crabs.forEach((sprite, crab) => {
        if (crab.isActive) {
            crab.sprite.setVelocityX(0);
        }
    });

    // Stop all pirates
    this.piratesInstances.forEach(pirate => {
        if (pirate.isAlive) {
            pirate.startAttack = false;
        }
    });

    // Stop gold generation
    if (this.goldGenerationEvent) {
        this.goldGenerationEvent.remove();
    }

    // Start game over scene
    this.scene.start('GameOverScene', { level: this.currentLevel });
  }

  resetGameState() {
    // Reset gold
    this.gold = 0;
    this.goldPerSecond = 5;
    this.lastGoldUpdate = 0;

    // Reset wave state
    this.currentWave = 'easy';
    this.isSpawning = true; // Make sure spawning is enabled
    this.currentWaveIndex = 0;
    
    // Clear all game objects
    this.crabs.clear();
    this.piratesInstances = [];
    this.piratebulletsInstances = [];
    this.crabbulletsInstances = [];

    // Reset timers
    if (this.spawnEvent) {
        this.spawnEvent.remove();
    }
    if (this.goldGenerationEvent) {
        this.goldGenerationEvent.remove();
    }
    if (this.waveTimer) {
        this.waveTimer.remove();
    }

    // Reset UI
    if (this.goldText) {
        this.goldText.destroy();
    }
    if (this.goldIcon) {
        this.goldIcon.destroy();
    }

    // Reset wave progress bar
    if (this.waveBar) {
        this.waveBar.clear();
    }
    if (this.waveText) {
        this.waveText.setText('Wave: Easy');
    }
    this.waveStartTime = this.time.now+5000;
    this.waveDuration = this.waveTimers[this.currentWave]+5000;
  }

  createWaveProgressBar() {
    // Create background bar
    this.waveBarBg = this.add.graphics();
    this.waveBarBg.fillStyle(0x3d6174, 0.5);
    this.waveBarBg.fillRect(1100, 50, 150, 10);

    // Create progress bar
    this.waveBar = this.add.graphics();
    this.waveBar.fillStyle(0xc33e2f, 1);
    this.waveBar.fillRect(1100, 50, 0, 10);

    // Add wave text
    this.waveText = this.add.text(1180, 30, 'Wave: Easy', {
      fontFamily: '"Permanent Marker"',
      fontSize: '26px',
      stroke: '#000000',
      strokeThickness: 3,
      fill: '#c33e2f'
    }).setOrigin(0.5);

    // Initialize wave timer with the same delay as the wave start
    this.waveStartTime = this.time.now + 5000;
    this.waveDuration = this.waveTimers[this.currentWave]+5000;
  }
}

