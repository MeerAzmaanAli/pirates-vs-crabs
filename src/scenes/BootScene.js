import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Preload assets here later
    this.load.image('deck', 'src/assets/images/deck.png'); 
    this.load.image('grid', 'src/assets/images/grid.png');

    //pirates->
    this.load.image('cannonPirate', 'src/assets/images/cannonPirate.png');
    this.load.image('harpoonPirate', 'src/assets/images/harpoonPirate.png');
    this.load.image('hidingPirate', 'src/assets/images/HidenPirate.png');
    this.load.image('cannonBall', 'src/assets/images/cannonBall.png');
    this.load.image('octoBullet', 'src/assets/images/octoBullet.png');
    this.load.image('barrel', 'src/assets/images/barrel.png');

    //crabs->
    this.load.image('normalCrab', 'src/assets/images/normal crab.png');
    this.load.image('armouredCrab', 'src/assets/images/armouredCrab.png');
    this.load.image('octoCrab', 'src/assets/images/octoCrab.png');

    this.load.image('drawer','src/assets/images/pirateDrawer.png');


  }

  create() {
    this.scene.start('GameScene');
  }
}
