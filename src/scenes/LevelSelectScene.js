import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.esm.js';
export default class LevelSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LevelSelectScene' });
    }

    create() {
        // Add background
        this.add.image(0, 0, 'menu_bg').setOrigin(0, 0).setDisplaySize(1280, 720);

        // Add title
        this.add.text(640, 50, 'SELECT LEVEL', {
            font: '48px Arial',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Get unlocked levels from localStorage
        const unlockedLevels = this.getUnlockedLevels();

        // Create level buttons
        this.createLevelButtons(unlockedLevels);

        // Add back button
        const backButton = this.add.text(100, 50, '← Back', {
            font: '24px Arial',
            fill: '#ffffff'
        }).setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start('MainMenuScene');
        });
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
        const bgGraphics = this.add.graphics();
        const defaultColor = 0xf4c542;
        const hoverColor = 0xa0522d;
    
        bgGraphics.fillStyle(defaultColor, 1);
        bgGraphics.fillRoundedRect(-200, -60, 400, 120, 20); // x, y, width, height, corner radius
        button.add(bgGraphics);
    
        // Create a hit area for interaction since Graphics doesn’t have one by default
        const hitArea = this.add.zone(0, 0, 400, 120)
            .setOrigin(0.5)
            .setInteractive();
        button.add(hitArea);
    
        // Add level title
        const title = this.add.text(0, -30, config.title, {
            font: '24px Arial',
            fill: '#ffffff'
        }).setOrigin(0.5);
        button.add(title);
    
        // Add level description
        const desc = this.add.text(0, 10, config.description, {
            font: '16px Arial',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        button.add(desc);
    
        if (config.unlocked) {
            hitArea.on('pointerover', () => {
                bgGraphics.clear();
                bgGraphics.fillStyle(hoverColor, 1);
                bgGraphics.fillRoundedRect(-200, -60, 400, 120, 20);
            });
    
            hitArea.on('pointerout', () => {
                bgGraphics.clear();
                bgGraphics.fillStyle(defaultColor, 1);
                bgGraphics.fillRoundedRect(-200, -60, 400, 120, 20);
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
