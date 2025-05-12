import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Add loading bar
    this.createLoadingBar();

    // Load all game assets
    this.loadGameAssets();
  }

  createLoadingBar() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Loading bar background
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
    
    // Loading text
    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      font: '20px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Loading progress text
    const percentText = this.add.text(width / 2, height / 2, '0%', {
      font: '18px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Update loading bar as assets load
    this.load.on('progress', (value) => {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    // Clear loading bar when complete
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });
  }

  loadGameAssets() {
    // Background
    this.load.image('deck', 'src/assets/images/deck.png');
    this.load.image('menu_bg', 'src/assets/images/menu_bg.png');
    this.load.image('gameOver_bg', 'src/assets/images/gameOver_bg.png');
    this.load.image('levelComplete_bg', 'src/assets/images/levelComplete_bg.png');
    this.load.image('grid', 'src/assets/images/grid.png');

    // Pirates
    this.load.image('cannonPirate', 'src/assets/images/cannonPirate.png');
    this.load.image('harpoonPirate', 'src/assets/images/harpoonPirate.png');
    this.load.image('hidingPirate', 'src/assets/images/HidenPirate.png');
    this.load.image('barrel', 'src/assets/images/barrel.png');

    // Crabs
    this.load.image('normalCrab', 'src/assets/images/normal crab.png');
    this.load.image('armouredCrab', 'src/assets/images/armouredCrab.png');
    this.load.image('octoCrab', 'src/assets/images/octoCrab.png');

    // UI Elements
    this.load.image('drawer', 'src/assets/images/pirateDrawer.png');
    this.load.image('gold_coin', 'src/assets/images/gold_coin.png');
    this.load.image('lock', 'src/assets/images/lock.png');

    // Bullets
    this.load.image('cannonBall', 'src/assets/images/cannonBall.png');
    this.load.image('octoBullet', 'src/assets/images/octoBullet.png');

    // Add error handling
    this.load.on('loaderror', (file) => {
      console.error('Error loading file:', file.src);
    });
  }

  create() {
    // Start with MainMenuScene instead of GameScene
    this.scene.start('MainMenuScene');
  }
}
