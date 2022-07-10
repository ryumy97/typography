import { calculateSineGraphByMinMax } from '../../lib/math.js';

export class Particle {
    constructor(x, y, savedX, savedY, radius) {
        this.x = x;
        this.y = y;
        this.savedX = savedX;
        this.savedY = savedY;

        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;

        this.ax = (Math.random() - 0.5) * 0.01;
        this.ay = (Math.random() - 0.5) * 0.01;

        this.alpha = 0;
        this.targetAlpha = 0;
        this.dAlpha = Math.random();
        this.vAlpha = Math.random() + 2;
        this.maxAlpha = 0.5;
        this.minAlpha = 0.05;

        this.wasInside = false;

        this.texture = PIXI.Texture.from('/assets/particles/particle.png');

        this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.scale.set(radius, radius);
        this.sprite.anchor.set(0.5, 0.5);
        this.sprite.tint = 0xd5db3d;

        this.glowSprite = new PIXI.Sprite(this.texture);
        this.glowSprite.scale.set(radius * 2, radius * 2);
        this.glowSprite.anchor.set(0.5, 0.5);
        this.glowSprite.tint = 0xd5db3d;
    }

    resize(radius) {
        this.sprite.scale.set(radius);
    }

    setSaved(x, y) {
        this.savedX = x;
        this.savedY = y;

        this.wasInside = false;
    }

    updateAlpha(progress, mouse) {
        const diffX = mouse.x - this.x;
        const diffY = mouse.y - this.y;
        const norm = Math.sqrt(diffX * diffX + diffY * diffY);

        if (mouse.radius > norm) {
            this.targetAlpha = calculateSineGraphByMinMax(
                1,
                0.2,
                progress * this.vAlpha + this.dAlpha
            );

            this.alpha += (this.targetAlpha - this.alpha) * 0.1;
        } else {
            this.targetAlpha = calculateSineGraphByMinMax(
                this.maxAlpha,
                this.minAlpha,
                progress * this.vAlpha + this.dAlpha
            );

            this.alpha += (this.targetAlpha - this.alpha) * 0.05;
        }
    }

    update(sw, sh, isInside, clicked) {
        const { ax, ay } = this.getAcceralation(sw, sh, isInside, clicked);

        this.ax = ax;
        this.ay = ay;

        this.vx += this.ax;
        this.vy += this.ay;

        if (this.vx > 0.25) {
            this.vx = 0.25;
        } else if (this.vx < -0.25) {
            this.vx = -0.25;
        }

        if (this.vy > 0.25) {
            this.vy = 0.25;
        } else if (this.vy < -0.25) {
            this.vy = -0.25;
        }

        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        this.sprite.x = this.x;
        this.sprite.y = this.y;

        this.sprite.alpha = this.alpha;

        this.glowSprite.x = this.x;
        this.glowSprite.y = this.y;

        this.glowSprite.alpha = this.alpha * 0.75;
    }

    getAcceralation(sw, sh, isInside, mouse) {
        const diffX = mouse.x - this.x;
        const diffY = mouse.y - this.y;
        const norm = Math.sqrt(diffX * diffX + diffY * diffY);
        if (mouse.radius > norm) {
            this.wasInside = false;
            const angle = Math.atan2(diffY, diffX);

            return {
                ax: 0.001 * Math.cos(angle),
                ay: 0.001 * Math.sin(angle),
            };
        }

        let ax;
        if (this.x > sw) {
            this.wasInside = false;
            ax = -Math.random() * 0.01;
        } else if (this.x < 0) {
            ax = Math.random() * 0.01;
        } else if (this.wasInside && !isInside) {
            ax = (this.savedX - this.x) * 0.005;
        } else if (isInside) {
            this.wasInside = true;
            this.savedX = this.x;
            ax = -this.vx * 0.01 + (Math.random() - 0.5) * 0.05;
        } else {
            ax = (Math.random() - 0.5) * 0.05;
        }

        let ay;
        if (this.y > sh) {
            this.wasInside = false;
            ay = -Math.random() * 0.01;
        } else if (this.y < 0) {
            ay = Math.random() * 0.01;
        } else if (this.wasInside && !isInside) {
            ay = (this.savedY - this.y) * 0.005;
        } else if (isInside) {
            this.wasInside = true;
            this.savedY = this.y;
            ay = -this.vy * 0.01 + (Math.random() - 0.5) * 0.05;
        } else {
            ay = (Math.random() - 0.5) * 0.05;
        }

        if (ax > 0.25) {
            ax = 0.25;
        } else if (ax < -0.25) {
            ax = -0.25;
        }

        if (ay > 0.25) {
            ay = 0.25;
        } else if (ay < -0.25) {
            ay = -0.25;
        }

        return { ax, ay };
    }
}
