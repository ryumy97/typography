export class Text {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.imageRendering = 'pixelated';

        this.ctx = this.canvas.getContext('2d');

        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;

        this.ratio = 0.4;
    }

    setText(str) {
        this.ctx.clearRect(0, 0, this.sw, this.sh);

        const fontWidth = 700;
        const fontSize = this.sh / 5;
        const fontName = 'Hind';

        this.ctx.font = `${fontWidth} ${fontSize}px ${fontName}`;
        this.ctx.fillStyle = 'rgba(255,255,255,0.1)';
        this.ctx.textBaseline = 'middle';

        const fontPos = this.ctx.measureText(str);

        this.ctx.fillText(
            str,
            (this.sw - fontPos.width) / 2,
            fontPos.actualBoundingBoxAscent +
                fontPos.actualBoundingBoxDescent +
                (this.sh - fontSize) / 2
        );

        return this.dotPos(2, this.sw, this.sh);
    }

    resize(sw, sh) {
        this.sw = sw;
        this.sh = sh;

        this.canvas.width = this.sw * this.ratio;
        this.canvas.height = this.sh * this.ratio;

        this.ctx.scale(this.ratio, this.ratio);
    }

    dotPos(density, sw, sh) {
        const imageData = this.ctx.getImageData(0, 0, sw, sh).data;

        const particles = [];
        let i = 0;
        let width = 0;
        let pixel;

        for (let height = 0; height < sh; height += density) {
            ++i;
            const slide = i % 2 == 0;
            width = 0;
            if (slide == 1) {
                width += 6;
            }

            for (width; width < sw; width += density) {
                pixel = imageData[(width + height * sw) * 4 - 1];
                if (
                    pixel != 0 &&
                    width > 0 &&
                    width < sw &&
                    height > 0 &&
                    height < sh
                ) {
                    particles.push({
                        x: width / this.ratio,
                        y: height / this.ratio,
                        alpha: pixel,
                        ratio: this.ratio,
                    });
                }
            }
        }

        return particles;
    }
}
