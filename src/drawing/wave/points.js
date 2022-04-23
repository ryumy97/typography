
export class WavePoints {
    constructor(color, n) {
        this.graphic = new PIXI.Graphics();
        this.color = color;

        this.points = [];
        for (let i = 0; i <= n; i++) {
            this.points.push(new Point(i));
        }
    }

    resize(sw, sh) {
        this.sw = sw;
        this.sh = sh;

        for (let i = 0; i < this.points.length; i++) {
            this.points[i].setPoint(this.sw / (this.points.length - 1) * i, this.sh / 2);
        }
    }

    draw(progress, mouse) {
        this.points.forEach(_ => {
            _.update(progress, mouse)
        })

        this.graphic.clear();
        this.graphic.beginFill(this.color, 0.33);

        let prev = null;
        this.points.forEach((point, index, points) => {
            if (index === 0) {
                this.graphic.moveTo(point.x, point.y);
            }
            else {
                const cx = (prev.x + point.x) / 2;
                const cy = (prev.y + point.y) / 2;
                this.graphic.quadraticCurveTo(
                    prev.x, prev.y,
                    cx, cy
                );
            }
            prev = point;
        })

        this.graphic.lineTo(prev.x, prev.y);
        this.graphic.lineTo(this.sw, this.sh);
        this.graphic.lineTo(0, this.sh);
        this.graphic.endFill();
    }
}

export class Point {
    constructor(index) {
        this.graphic = new PIXI.Graphics();
        this.maxHeight = 5 + 8 * Math.random();
        this.index = index;
        
        this.v = Math.random() + 3.5;
    }

    setPoint(x, y) {
        this.savedX = x;
        this.savedY = y;
        this.x = x;
        this.y = y;
    }

    update(progress, mouse) {
        this.savedY += (mouse.y - this.savedY) * 0.1;
        this.y = this.savedY + Math.cos(this.index * Math.PI / 2 + progress * this.v) * this.maxHeight;
    }

    drawWireframe() {
        this.graphic.clear();
        this.graphic.lineStyle(1, 0xff0000)
            .beginFill(0xff0000, 1)
            .arc(this.x, this.y, 1, 0, 2 * Math.PI)
            .endFill();
    }
}