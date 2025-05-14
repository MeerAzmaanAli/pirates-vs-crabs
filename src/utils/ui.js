const UI = {
    bottleButton(scene, x, y, text, sceneToStart) {
        const button = scene.add.image(x+20, y+10, 'bottle').setOrigin(0.5).setDisplaySize(250, 150);
        button.setAlpha(0.8);
        const t = scene.add.text(x, y, text, {
            fontFamily: '"Permanent Marker"',
            fontSize: '26px',
            stroke: '#000000',
            strokeThickness: 3,
            fill: '#3d6174'
        }).setOrigin(0.5).setInteractive();

        // Button hover effects
        t.on('pointerover', () => {
            t.setStyle({ fill: '#c33e2f' });
        });

        t.on('pointerout', () => {
            t.setStyle({ fill: '#3d6174' });
        });


        // Start game on click
        if(sceneToStart){
            t.on('pointerdown', () => {
                scene.scene.start(sceneToStart);
            });
        }
        return t;
    }
};

export default UI;