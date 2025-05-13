import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.esm.js';
export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        // Add background
        this.add.image(0, 0, 'menu_bg').setOrigin(0, 0).setDisplaySize(1280, 720);

        // Add title
        this.add.image(640, 300, 'title').setOrigin(0, 0).setOrigin(0.5).setDisplaySize(500,500);
        /*this.add.text(640, 200, 'PIRATES\nVS\n CRABS', {
            font: '64px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center' 
        }).setOrigin(0.5);*/

        // Create play button
        this.createButtonBg();
        // Create the text and place it on top
        const playButton = this.add.text(630, 550, 'P l a y', {
            fontFamily: '"Permanent Marker"',
            fontSize: '26px',
            stroke: '#000000',
            strokeThickness: 3,
            fill: '#3d6174'
        }).setOrigin(0.5).setInteractive();
        

        // Button hover effects
        playButton.on('pointerover', () => {
            playButton.setStyle({ fill: '#c33e2f' });
        });

        playButton.on('pointerout', () => {
            playButton.setStyle({ fill: '#3d6174' });
        });

        // Start game on click
        playButton.on('pointerdown', () => {
            this.scene.start('LevelSelectScene');
        });
    }
    createButtonBg(){
          // Create play button
        /*const graphicsB = this.add.graphics();
        const buttonWidthB = 215;
        const buttonHeightB = 75;
        const cornerRadiusB = 20;
        
        graphicsB.fillStyle(0x3C1E0B, 1);
        graphicsB.fillRoundedRect(640 - buttonWidthB / 2, 552 - buttonHeightB / 2, buttonWidthB, buttonHeightB, cornerRadiusB);
         
        const graphics = this.add.graphics();
         const buttonWidth = 200;
         const buttonHeight = 60;
         const cornerRadius = 15;
         
         graphics.fillStyle(0x3d5060, 1);
         graphics.fillRoundedRect(640 - buttonWidth / 2, 550 - buttonHeight / 2, buttonWidth, buttonHeight, cornerRadius);
    */
        this.add.image(650, 560, 'bottle').setOrigin(0.5).setDisplaySize(250,150);
    }
}
