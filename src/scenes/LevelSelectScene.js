import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.esm.js';
import UI from '../utils/ui.js';
export default class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelectScene' });
    }

    create() {
        // Add background
        this.add.image(0, 0, 'selectLevel_bg').setOrigin(0, 0).setDisplaySize(1280, 720);

        // Add title
        this.add.text(640, 45, 'SELECT LEVEL', {
            fontFamily: '"Permanent Marker"',
            fontSize: '45px',
            fill: '#e1a21f ',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Get unlocked levels from localStorage
        const unlockedLevels = this.getUnlockedLevels();

        // Create level buttons
        this.createLevelButtons(unlockedLevels);

        // Add back button
        UI.bottleButton(this, 150, 50, 'B A C K', 'MainMenuScene');
        
        this.Music = this.sound.add('levelSelectBgm', {
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

    createLevelButtons(unlockedLevels) {
        const levelConfigs = [
            {
                level: 1,
                title: 'Level 1',
                description: 'Normal Crabs\nHarpoon Pirate Only',
                waves: 1,
                unlocked: true
            },
            {
                level: 2,
                title: 'Level 2',
                description: 'Normal & Armoured Crabs\nHarpoon & Hiding Pirates',
                waves: 2,
                unlocked: unlockedLevels.includes(2)
            },
            {
                level: 3,
                title: 'Level 3',
                description: 'All Crab Types\nAll Pirates',
                waves: 3,
                unlocked: unlockedLevels.includes(3)
            },{
                level: 4,
                title: 'Level 4',
                description: 'All Crab Types\nAlonger waves',
                waves: 3,
                unlocked: unlockedLevels.includes(4)
            }
        ];

        levelConfigs.forEach((config, index) => {
            const y = 250 + (index * 150);
            this.createLevelButton(config, y);
        });
    }

    createLevelButton(config, y) {
        const button = this.add.container(640, y-100);
    
        // Create button background with rounded corners
        const bgGraphics = this.add.image(0, 0, 'level_bg').setOrigin(0.5).setDisplaySize(400, 200);
        button.add(bgGraphics);
    
        // Create a hit area for interaction since Graphics doesn’t have one by default
        const hitArea = this.add.zone(0, 0, 400, 120)
            .setOrigin(0.5)
            .setInteractive();
        button.add(hitArea);
    
        // Add level title
        const title = this.add.text(0, -30, config.title, {
            fontFamily: '"Permanent Marker"',
            fontSize: '24px',
            fill: '#3d6174'
        }).setOrigin(0.5);
        button.add(title);
    
        // Add level description
        const desc = this.add.text(0, 10, config.description, {
            fontFamily: '"Permanent Marker"',
            fontSize: '16px',
            fill: '#3d6174'
        }).setOrigin(0.5);
        button.add(desc);
    
        if (config.unlocked) {
            hitArea.on('pointerover', () => {
                title.setStyle({ fill: '#c33e2f' });
                desc.setStyle({ fill: '#c33e2f' });
            });
    
            hitArea.on('pointerout', () => {
                title.setStyle({ fill: '#3d6174' });
                desc.setStyle({ fill: '#3d6174' });
            });
    
            hitArea.on('pointerdown', () => {
                this.startLevel(config.level);
            });
        } else {
            // Add lock icon for locked levels
            const lock = this.add.image(150, 0, 'lock').setScale(0.2);
            button.add(lock);
            bgGraphics.setAlpha(0.5);
            hitArea.disableInteractive(); // disable interaction
        }
    }
    

    getUnlockedLevels() {
        const unlocked = localStorage.getItem('unlockedLevels');
        return unlocked ? JSON.parse(unlocked) : [1];
    }

    startLevel(level) {
        this.scene.start('GameScene', { level: level });
    }
}
