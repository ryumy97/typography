export class Particle {
    constructor(pos, textures, ballSize, ballRadius) {
        this.ballSize = ballSize;
        this.textures = textures;

        this.sprite = new PIXI.Sprite();
        this.sprite.scale.set(this.ballSize);
        this.sprite.anchor.set(0.5,0.5);

        this.sprite.tint = 0xffffff;

        this.sprite.interactive = true;

        this.alpha = pos.alpha;
        this.savedAlpha = pos.alpha;

        this.savedX = pos.x;
        this.savedY = pos.y;
        this.x = pos.x;
        this.y = pos.y;

        this.sprite.x = this.x;
        this.sprite.y = this.y;

        this.vx = 0;
        this.vy = 0;
        this.radius = ballRadius;
    }

    FRICTION = 0.90;
    MOVE_SPEED = 0.07;

    draw(ratio) {
        // const i = Math.floor(this.alpha / 255 * this.textures.length);
        
        // this.sprite.texture = this.textures[i];
        const section = 255 / this.textures.length;
        if (this.alpha > section * 8) {
            this.sprite.texture = this.textures[0];
        }
        else if (this.alpha > section * 7) {
            this.sprite.texture = this.textures[1];
        }
        else if (this.alpha > section * 6) {
            this.sprite.texture = this.textures[2];
        }
        else if (this.alpha > section * 5) {
            this.sprite.texture = this.textures[3];
        }
        else if (this.alpha > section * 4) {
            this.sprite.texture = this.textures[4];
        }
        else if (this.alpha > section * 3) {
            this.sprite.texture = this.textures[5];
        }
        else if (this.alpha > section * 2) {
            this.sprite.texture = this.textures[6];
        }
        else if (this.alpha > section * 1) {
            this.sprite.texture = this.textures[7];
        }
        else {
            this.sprite.texture = this.textures[8];
        }     

        this.x += (this.savedX - this.x) * this.MOVE_SPEED * ratio;
        this.y += (this.savedY - this.y) * this.MOVE_SPEED * ratio;

        this.vx *= this.FRICTION;
        this.vy *= this.FRICTION;

        this.x += this.vx;
        this.y += this.vy;

        this.sprite.x = this.x;
        this.sprite.y = this.y;

        this.alpha += (this.savedAlpha - this.alpha) * 0.015;
    }
}
