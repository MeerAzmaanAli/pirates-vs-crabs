import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.esm.js';

import BootScene from './src/scenes/BootScene.js';
import GameScene from './src/scenes/GameScene.js';
import MainMenuScene from './src/scenes/MainMenuScene.js';
import LevelSelectScene from './src/scenes/LevelSelectScene.js';
import GameOverScene from './src/scenes/GameOverScene.js';
import LevelCompleteScene from './src/scenes/LevelCompleteScene.js';


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
      debug: false, // optional, helps visualize collisions
      gravity: { y: 0 }
    }
  },
  scene: [BootScene, MainMenuScene, LevelSelectScene, GameScene,GameOverScene,LevelCompleteScene],
};
new Phaser.Game(config);
