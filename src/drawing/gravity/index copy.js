import { Box } from './box.js';
import { Text } from './text.js';
import { World } from './world.js';

export class Gravity {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.str = 'Gravity'
        this.world = new World();
    }

    getCanvas() {
        return this.canvas;
    }

    textChange(str) {
        this.str = str;
        this.world.removeAll();
        const fontMeasurement = this.ctx.measureText(this.str);

        let x = this.sw / 2 - fontMeasurement.width / 2;
        for (let i = 0; i < this.str.length; i++) {
            const measurement = this.ctx.measureText(this.str[i]);

            if (i !== 0) {
                x += measurement.width / 2;
            }
            
            this.world.add(
                new Text(
                    x,
                    this.sh / 2,
                    this.str[i],
                    this.ctx.measureText(this.str[i])
                    )
            )

            x += measurement.width / 2;
        }
    }

    resize() {
        this.sw = this.canvas.clientWidth;
        this.sh = this.canvas.clientHeight;

        this.canvas.width = this.sw * 2;
        this.canvas.height = this.sh * 2;

        this.ctx.scale(2,2);

        this.world.removeAll();

        const fontWidth = 700;
        const fontSize = this.sh / 10;
        const fontName = 'Hind';

        this.ctx.font = `${fontWidth} ${fontSize}px ${fontName}`;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';

        const fontMeasurement = this.ctx.measureText(this.str);

        let x = this.sw / 2 - fontMeasurement.width / 2;
        for (let i = 0; i < this.str.length; i++) {
            const measurement = this.ctx.measureText(this.str[i]);

            x += measurement.width / 2 + 2 * i;
            
            this.world.add(
                new Text(
                    x,
                    this.sh / 2,
                    this.str[i],
                    this.ctx.measureText(this.str[i])
                    )
            )

            x += measurement.width / 2;
        }

        this.world.add(
            new Box(this.sw / 2, this.sh, this.sw, 20)
        )
    }

    update(elapsed) {
        this.world.update(elapsed / 1000, this.ctx);
    }

    draw(progress, elapsed) {
        this.update(elapsed);
        this.ctx.clearRect(0, 0, this.sw, this.sh);

        this.world.draw(this.ctx);
    }
}