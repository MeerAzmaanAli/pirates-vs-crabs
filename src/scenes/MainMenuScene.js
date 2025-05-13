import * as Phaser from 'https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.esm.js';
import UI from '../utils/ui.js';
export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        // Add background
        this.add.image(0, 0, 'menu_bg').setOrigin(0, 0).setDisplaySize(1280, 720);

        // Add title
        this.add.image(640, 300, 'title').setOrigin(0, 0).setOrigin(0.5).setDisplaySize(500,500);

        UI.bottleButton(this, 630, 550, 'P l a y', 'LevelSelectScene');
    }

}
