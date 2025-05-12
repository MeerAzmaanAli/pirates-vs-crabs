import Phaser from 'phaser';

import BootScene from './scenes/BootScene.js';
import GameScene from './scenes/GameScene.js';


const config = {
  type: Phaser.AUTO,
  width: 1280, // your virtual resolution
  height: 720,
  scale: {
      mode: Phaser.Scale.FIT, // maintains aspect ratio
      autoCenter: Phaser.Scale.CENTER_BOTH // centers on screen
  },
  parent: 'game', // attach to the <div id="game">
  backgroundColor: '#87ceeb', // sky blue background for now
  physics: {
    default: 'arcade',
    arcade: {
      debug: true, // optional, helps visualize collisions
      gravity: { y: 0 }
    }
  },
  scene: [BootScene, GameScene],
};
new Phaser.Game(config);
