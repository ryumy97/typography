export class Text {
    constructor(text, fontSize) {
        this.text = text;
        this.font = `${fontSize}px Hind`;
    }

    draw(x, y, rotation, ctx) {
        ctx.save()
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.textAlign = 'center';
        ctx.font = this.font;
        ctx.fillStyle = '#ffffff'
        ctx.fillText(this.text, 0, 0);
        ctx.restore();
    }
}