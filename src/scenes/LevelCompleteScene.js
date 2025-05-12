import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.esm.js';
export default class LevelCompleteScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelCompleteScene' });
    }

    init(data) {
        this.level = data.level || 1;
        this.nextLevel = this.level + 1;
    }

    create() {
        // Create a semi-transparent background
        const bg = this.add.image(0, 0, 'levelComplete_bg').setOrigin(0, 0).setDisplaySize(1280, 720);
        
        // Create level complete text
        const completeText = this.add.text(640, 250, 'LEVEL COMPLETE!', {
            font: '48px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Create level number text
        const levelText = this.add.text(640, 320, `Level ${this.level}`, {
            font: '36px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Create continue button
        const continueButton = this.add.text(640, 400, 'Continue', {
            font: '32px Arial',
            fill: '#ffffff',
            backgroundColor: '#4a4a4a',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerover', () => continueButton.setStyle({ fill: '#ffff00' }))
        .on('pointerout', () => continueButton.setStyle({ fill: '#ffffff' }))
        .on('pointerdown', () => {
            this.scene.start('LevelSelectScene');
        });

        // Add some visual effects
        this.addCompletionEffects();
    }

    addCompletionEffects() {
        // Add some particle effects or animations here
        // For example, you could add confetti or sparkles
        
        // Add a subtle scale animation to the level complete text
        this.tweens.add({
            targets: this.children.list.find(child => child.text === 'LEVEL COMPLETE!'),
            scale: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
    }
}
