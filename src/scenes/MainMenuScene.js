import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.esm.js';
export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        // Add background
        this.add.image(0, 0, 'menu_bg').setOrigin(0, 0).setDisplaySize(1280, 720);

        // Add title
        this.add.text(640, 200, 'PIRATES\nVS\n CRABS', {
            font: '64px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center' 
        }).setOrigin(0.5);

        // Create play button
        const graphics = this.add.graphics();
        const buttonWidth = 200;
        const buttonHeight = 60;
        const cornerRadius = 15;
        
        graphics.fillStyle(0x8b1a1a, 1);
        graphics.fillRoundedRect(640 - buttonWidth / 2, 400 - buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);
        
        // Create the text and place it on top
        const playButton = this.add.text(640, 400, 'PLAY', {
            font: '32px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5).setInteractive();
        

        // Button hover effects
        playButton.on('pointerover', () => {
            playButton.setStyle({ fill: '#ff0' });
        });

        playButton.on('pointerout', () => {
            playButton.setStyle({ fill: '#ffffff' });
        });

        // Start game on click
        playButton.on('pointerdown', () => {
            this.scene.start('LevelSelectScene');
        });
    }
}
