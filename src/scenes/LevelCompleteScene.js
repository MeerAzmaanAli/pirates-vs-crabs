import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.esm.js';
import UI from '../utils/ui.js';
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
            fontFamily: '"Permanent Marker"',
            fontSize: '36px',
            fill: '#e1a21f ',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Create level number text
        const levelText = this.add.text(640, 320, `Level ${this.level}`, {
            fontFamily: '"Permanent Marker"',
            fontSize: '36px',
            fill: '#e1a21f ',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Create continue button
        UI.bottleButton(this, 660, 410, 'N e x t', 'LevelSelectScene');

        // Add some visual effects
        this.addCompletionEffects();

        this.Music = this.sound.add('winnerBgm', {
            volume: 0.5,
            loop: true
        });
        this.Music.play();
        this.events.on('shutdown', this.shutdown, this);
    }
    shutdown() {
        // Stop the music when leaving the scene
        if (this.Music) {
            this.Music.stop();
        }
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
