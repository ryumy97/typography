import { Text } from './text.js';

export class ParticleManager {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.text = new Text();
        this.str = 'Metaball';

        this.texture = PIXI.Texture.from('/assets/particles/particle.png');

        this.particles = [];

        this.mouse = {
            x: 0,
            y: 0,
            radius: 10,
        };

        document.addEventListener('mousemove', this.onMove.bind(this), false);
        document.addEventListener('touchmove', this.onTouch.bind(this), false);
    }

    resize(sw, sh, stage, x, y) {
        this.x = x;
        this.y = y;

        this.ballSize = (sh / 1000) * 0.2;

        this.mouse.radius = sh * 0.025;
        this.ballRadius = sh * 0.025;

        this.text.resize(sw, sh);
        this.show(stage, this.str);
    }

    show(stage, str) {
        this.str = str;
        if (this.container) {
            stage.removeChild(this.container);
        }

        this.pos = this.text.setText(str);

        this.container = new PIXI.ParticleContainer(this.pos.length, {
            vertices: false,
            position: true,
            rotation: false,
            scale: false,
            uvs: false,
            tint: false,
        });
        stage.addChild(this.container);

        this.particles = [];

        for (let i = 0; i < this.pos.length; i++) {
            const item = new Particle(
                this.pos[i],
                this.texture,
                this.ballSize,
                this.ballRadius
            );
            this.container.addChild(item.sprite);
            this.particles.push(item);
        }
    }

    draw(ratio) {
        for (let i = 0; i < this.particles.length; i++) {
            const item = this.particles[i];
            const dx = this.mouse.x - item.x;
            const dy = this.mouse.y - item.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = item.radius + this.mouse.radius;

            if (dist < minDist) {
                const angle = Math.atan2(dy, dx);
                const tx = item.x + Math.cos(angle) * minDist;
                const ty = item.y + Math.sin(angle) * minDist;
                const ax = tx - this.mouse.x;
                const ay = ty - this.mouse.y;
                item.vx -= ax;
                item.vy -= ay;
            }

            item.draw(ratio);
        }
    }

    onTouch(e) {
        this.mouse.x = e.touches[0].clientX - this.x;
        this.mouse.y = e.touches[0].clientY - this.y;
    }

    onMove(e) {
        this.mouse.x = e.clientX - this.x;
        this.mouse.y = e.clientY - this.y;
    }
}

export class Particle {
    constructor(pos, texture, ballSize, ballRadius) {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.scale.set(ballSize);
        this.sprite.tint = 0xffffff;

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

    FRICTION = 0.9;
    MOVE_SPEED = 0.07;

    draw(ratio) {
        this.x += (this.savedX - this.x) * this.MOVE_SPEED * ratio;
        this.y += (this.savedY - this.y) * this.MOVE_SPEED * ratio;

        this.vx *= this.FRICTION;
        this.vy *= this.FRICTION;

        this.x += this.vx;
        this.y += this.vy;

        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }
}
