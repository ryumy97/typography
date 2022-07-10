import { Particle } from './particle.js';
import { Text } from './text.js';
import { randomNormaldistributionBM } from '../../lib/math.js';

export class Fireflies {
    constructor() {
        this.text = new Text();
        this.str = 'Fireflies';

        this.renderer = new PIXI.Renderer({
            antialias: true,
            backgroundAlpha: 0,
            resolution: window.devicePixelRatio > 1 ? 2 : 1,
            autoDensity: true,
            powerPreference: 'high-performance',
        });
        this.renderer.view.style.width = '100%';
        this.renderer.view.style.height = '100%';

        this.stage = new PIXI.Container();

        this.particles = [];

        this.mouse = { x: 0, y: 0, radius: this.sh * 0.1 };
        this.progress = 10;

        window.addEventListener('mousemove', this.moveMouse.bind(this), false);
    }

    getCanvas() {
        return this.renderer.view;
    }

    textChange(str) {
        this.str = str;
        this.updatePosition();
        this.progress = this.progress;
    }

    updatePosition() {
        this.pos = this.text.setText(this.str);
        this.particles.forEach((particle, index) => {
            particle.setSaved(
                this.pos[index % this.pos.length].x,
                this.pos[index % this.pos.length].y
            );
        });
    }

    resize() {
        const view = this.getCanvas();
        view.style.width = '100%';
        view.style.height = '100%';

        this.sw = view.clientWidth;
        this.sh = view.clientHeight;

        this.text.resize(this.sw, this.sh);
        this.renderer.resize(this.sw, this.sh);

        this.updatePosition();
    }

    show() {
        if (this.container) {
            this.stage.removeChild(this.container);
            this.stage.removeChild(this.glowContainer);
        }

        this.pos = this.text.setText(this.str);
        this.container = new PIXI.Container(100, {
            vertices: false,
            position: true,
            rotation: false,
            scale: false,
            uvs: true,
            tint: false,
        });

        this.glowContainer = new PIXI.Container(100, {
            vertices: false,
            position: true,
            rotation: false,
            scale: false,
            uvs: true,
            tint: false,
        });

        this.blurFilter = new PIXI.filters.BlurFilter();
        this.blurFilter.blur = 2.5;
        this.blurFilter.autoFit = true;

        this.glowContainer.filters = [this.blurFilter];
        this.glowContainer.filterArea = this.renderer.screen;

        this.stage.addChild(this.glowContainer);
        this.stage.addChild(this.container);

        this.particles = [];

        for (let i = 0; i < 2000; i++) {
            const position = this.pos[i % this.pos.length];

            const x = (randomNormaldistributionBM() - 0.5) * 1000 + position.x;
            const y = (randomNormaldistributionBM() - 0.5) * 1000 + position.y;

            const particle = new Particle(
                x,
                y,
                position.x,
                position.y,
                this.sh * 0.0001
            );

            this.container.addChild(particle.sprite);
            this.glowContainer.addChild(particle.glowSprite);

            this.particles.push(particle);
        }
    }

    draw(progress, elapsed) {
        if (!this.particles.length) {
            this.show();
        }

        this.progress += elapsed / 1000;

        this.particles.forEach((particle) => {
            const isInside = this.pos.find((p) => {
                return (
                    p.x - 1 / p.ratio <= particle.x &&
                    p.x + 1 / p.ratio > particle.x &&
                    p.y - 1 / p.ratio <= particle.y &&
                    p.y + 1 / p.ratio > particle.y
                );
            });

            particle.update(this.sw, this.sh, isInside, this.mouse);
            particle.updateAlpha(this.progress, this.mouse);
            particle.draw();
        });

        this.renderer.render(this.stage);
    }

    moveMouse(e) {
        this.mouse = {
            x: e.clientX,
            y: e.clientY,
            radius: this.sh * 0.1,
        };
    }
}
