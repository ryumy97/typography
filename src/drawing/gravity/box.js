export class Box {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.isStationary = true;
    }

    update(ratio) {

    }

    getCollisionBox() {
        return {
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
            rotation: 0
        }
    }

    draw(ctx) {
        // ctx.rect(this.x,this.y,this.w, 20);
    }
}