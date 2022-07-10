import { Text } from './text.js';
import { Particle } from './particle.js';
import { Arrow } from './arrow.js';

export class TwoBit {
    constructor() {
        this.text = new Text();

        this.renderer = new PIXI.Renderer({
            antialias: false,
            backgroundAlpha: 0,
            resolution: window.devicePixelRatio > 1 ? 2 : 1,
            autoDensity: true,
            powerPreference: 'high-performance',
        });

        this.renderer.view.style.imageRendering = 'pixelated';

        this.renderer.view.style.width = '100%';
        this.renderer.view.style.height = '100%';

        this.stage = new PIXI.Container();

        this.particles = [];

        this.textures = [
            new PIXI.Texture.from('/assets/2bit/01.png'),
            new PIXI.Texture.from('/assets/2bit/02.png'),
            new PIXI.Texture.from('/assets/2bit/03.png'),
            new PIXI.Texture.from('/assets/2bit/04.png'),
            new PIXI.Texture.from('/assets/2bit/05.png'),
            new PIXI.Texture.from('/assets/2bit/06.png'),
            new PIXI.Texture.from('/assets/2bit/07.png'),
            new PIXI.Texture.from('/assets/2bit/08.png'),
            PIXI.Texture.EMPTY,
        ];

        this.str = '2-bit';

        this.mouse = {
            x: 0,
            y: 0,
            radius: 50,
        };

        this.arrows = [];

        this.currentArrow = null;

        document.addEventListener('mousemove', this.onMove.bind(this), false);
        document.addEventListener('mousedown', this.addArrow.bind(this), false);

        document.addEventListener('touchstart', this.onTouch.bind(this), false);
        document.addEventListener(
            'touchmove',
            this.onTouchMove.bind(this),
            false
        );
        document.addEventListener(
            'touchend',
            this.onTouchEnd.bind(this),
            false
        );
    }

    onTouch(e) {
        this.currentArrow = new Arrow(
            e.touches[0].clientX,
            e.touches[0].clientY
        );
        this.container.addChild(this.currentArrow.graphic);

        this.currentArrow.graphic.position.set(0, 0);

        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
    }

    onTouchMove(e) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
    }

    onTouchEnd(e) {
        this.currentArrow.setArrowEnd(
            this.currentArrow.endX,
            this.currentArrow.endY
        );
        this.currentArrow.updateLine();
        this.arrows.push(this.currentArrow);

        this.currentArrow = null;
    }

    addArrow(e) {
        if (!this.currentArrow) {
            this.currentArrow = new Arrow(e.clientX, e.clientY);
            this.container.addChild(this.currentArrow.graphic);

            this.currentArrow.graphic.position.set(0, 0);
        } else {
            this.currentArrow.setArrowEnd(e.clientX, e.clientY);
            this.currentArrow.updateLine();
            this.arrows.push(this.currentArrow);

            this.currentArrow = null;
        }
    }

    getCanvas() {
        return this.renderer.view;
    }

    textChange(str) {
        this.str = str;

        this.currentArrow = null;
        this.arrows = [];
        this.show(this.str);
    }

    resize() {
        const view = this.getCanvas();
        view.style.width = '100%';
        view.style.height = '100%';

        this.sw = view.clientWidth;
        this.sh = view.clientHeight;

        this.renderer.resize(this.sw, this.sh);
        this.text.resize(this.sw, this.sh);

        this.show(this.str);
    }

    show(str) {
        this.str = str;

        if (this.container) {
            this.stage.removeChild(this.container);
        }

        this.pos = this.text.setText(str);

        this.container = new PIXI.Container(this.pos.length, {
            vertices: false,
            position: true,
            rotation: false,
            scale: false,
            uvs: true,
            tint: false,
        });
        this.stage.addChild(this.container);

        this.pos = this.text.setText(this.str);
        this.particles = [];

        for (let i = 0; i < this.pos.length; i++) {
            const item = new Particle(this.pos[i], this.textures, 1, 10);
            this.particles.push(item);
            this.container.addChild(item.sprite);
        }

        if (this.currentArrow) {
            this.container.addChild(this.currentArrow.graphic);
        }

        this.arrows.map((arrow) => {
            this.container.addChild(arrow.graphic);
        });
    }

    alphaUpdate(x, y, radius) {
        for (let i = 0; i < this.particles.length; i++) {
            const item = this.particles[i];
            const dx = x - item.x;
            const dy = y - item.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = item.radius + radius;

            if (dist < minDist) {
                item.alpha *= dist / 50;
            }
        }
    }

    draw(progress, elapsed) {
        const ratio = (60 * elapsed) / 1000;

        if (this.currentArrow) {
            this.currentArrow.setArrowEnd(this.mouse.x, this.mouse.y);
            this.currentArrow.updateLine();
        }

        this.arrows.forEach((_) => {
            _.updateArrow();
            this.alphaUpdate(_.x, _.y, _.radius);
        });

        this.alphaUpdate(this.mouse.x, this.mouse.y, this.mouse.radius);

        this.particles.forEach((_) => {
            _.draw(ratio);
        });

        this.renderer.render(this.stage);
    }

    onMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }
}
