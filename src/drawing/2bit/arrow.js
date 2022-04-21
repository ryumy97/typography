export class Arrow {
    constructor(x, y) {
        this.graphic = new PIXI.Graphics(),

        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.endX = x;
        this.endY = y;

        this.radius = 10;
    }

    setArrowEnd(x, y) {
        this.endX = x;
        this.endY = y;
    }

    updateLine() {
        this.graphic.clear();
        this.graphic.lineStyle(1, 0xffffff)
            .moveTo(this.startX, this.startY)
            .lineTo(this.endX, this.endY);
    }

    updateArrow() {
        this.graphic.clear();
        this.graphic.lineStyle(1, 0xffffff)
            .arc(this.x, this.y, this.radius / 2, 0, 2 * Math.PI);

        this.x += (this.endX - this.x) * 0.01;
        this.y += (this.endY - this.y) * 0.01;

        if (
            this.x > 0.99 * this.endX
            && this.x < 1.01 * this.endX
            && this.y > 0.99 * this.endY
            && this.y < 1.01 * this.endY
            ) {
            this.x = this.startX;
            this.y = this.startY;
        }
    }
}