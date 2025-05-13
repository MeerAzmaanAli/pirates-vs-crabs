import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.esm.js';
import UI from '../utils/ui.js';
export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.currentLevel = data.level || 1;
    }

    create() {
        // Add semi-transparent background
        const bg = this.add.image(0, 0, 'gameOver_bg').setOrigin(0, 0).setDisplaySize(1280, 720);
        bg.setOrigin(0, 0);

        // Game Over text
        this.add.text(640, 200, 'GAME OVER', {
            font: '64px Arial',
            fill: '#ff0000',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Level info
        this.add.text(640, 300, `Level ${this.currentLevel} Failed`, {
            font: '32px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Create retry button
        const retryButton= UI.bottleButton(this, 640, 400, 'R E T R Y');
        

        // Create menu button
        UI.bottleButton(this, 640, 500, 'M E N U', 'MainMenuScene');

        // Button actions
        retryButton.on('pointerdown', () => {
            // Reset game state before starting new game
            this.resetGameState();
            // Stop the current scene before starting the new one
            this.scene.stop();
            this.scene.start('GameScene', { 
                level: this.currentLevel,
                reset: true
            });
        });
    }

    resetGameState() {
        // Clear any existing game data from localStorage
        localStorage.removeItem('gameState');
        
        // Reset wave progress
        localStorage.setItem('currentWave', '0');
        
        // Reset any other persistent game state
        const unlockedLevels = JSON.parse(localStorage.getItem('unlockedLevels') || '[1]');
        // Keep only level 1 unlocked if that's the current level
        if (this.currentLevel === 1) {
            localStorage.setItem('unlockedLevels', JSON.stringify([1]));
        }
    }
}
