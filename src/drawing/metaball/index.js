export class Metaball {
    constructor() {
        this.setWebgl();
        this.particleManager = new ParticleManager();
    }

    getCanvas() {
        return this.renderer.view;
    }

    textChange(str) {
        this.particleManager.show(this.stage, str);
    }

    resize() {
        const view = this.getCanvas();
        view.style.width = '100%';
        view.style.height = '100%';

        this.sw = view.clientWidth;
        this.sh = view.clientHeight;

        this.renderer.resize(this.sw, this.sh);
        this.particleManager.resize(this.sw, this.sh, this.stage, view.offsetLeft, view.offsetTop);
    }

    setWebgl() {
        this.renderer = new PIXI.Renderer({
            antialias: true,
            backgroundAlpha: 0,
            resolution: (window.devicePixelRatio > 1) ? 2 : 1,
            autoDensity: true,
            powerPreference: 'high-performance',
            backgroundColor: 0xffffff
        });
        this.renderer.view.style.width = '100%';
        this.renderer.view.style.height = '100%';

        this.stage = new PIXI.Container();

        const blurFilter = new PIXI.filters.BlurFilter();
        blurFilter.blur = 10;
        blurFilter.autoFit = true;

        const fragSource = `
            precision mediump float;
            varying vec2 vTextureCoord;
            uniform sampler2D uSampler;
            uniform float threshold;
            uniform float mr;
            uniform float mg;
            uniform float mb;
            void main(void) {
                vec4 color = texture2D(uSampler, vTextureCoord);
                vec3 mColor = vec3(mr, mg, mb);
                if (color.a > threshold) {
                    gl_FragColor = vec4(mColor, 1.0);
                }
                else {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                }
            }
        `;

        this.uniformData = {
            threshold: 0.5,
            mr: 1.0,
            mg: 1.0,
            mb: 1.0
        };
        this.thresholdProgress = 0;

        const thresholdFilter = new PIXI.Filter(null, fragSource, this.uniformData);
        this.stage.filters = [blurFilter, thresholdFilter];
        this.stage.filterArea = this.renderer.screen;
    }

    draw(progress, elapsed) {
        const ratio = 60 * elapsed / 1000;

        this.thresholdProgress += (1 - this.thresholdProgress) * 0.015;
        this.uniformData.threshold = (1 - 0.5 * this.thresholdProgress);

        this.particleManager.draw(ratio);

        this.renderer.render(this.stage);
    }
}

export class ParticleManager {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.text = new Text();
        this.str = 'Metaball';

        this.texture = PIXI.Texture.from('/assets/particle.png');

        this.particles = [];

        this.mouse = {
            x: 0,
            y: 0,
            radius: 10
        }

        document.addEventListener('pointermove', this.onMove.bind(this), false);
    }

    resize(sw, sh, stage, x, y) {
        this.x = x;
        this.y = y;

        this.text.resize(sw, sh);
        this.show(stage, this.str)
        this.mouse.radius = sw * 0.05
    }

    show(stage, str) {
        this.str = str;
        if (this.container) {
            stage.removeChild(this.container);
        }
        
        this.pos = this.text.setText(str);

        this.container = new PIXI.ParticleContainer(
            this.pos.length,
            {
                vertices: false,
                position: true,
                rotation: false,
                scale: false,
                uvs: false,
                tint: false
            }
        );
        stage.addChild(this.container);

        this.particles = [];
        for (let i = 0; i < this.pos.length; i++) {
            const item = new Particle(this.pos[i], this.texture);
            this.container.addChild(item.sprite);
            this.particles.push(item);
        }
    }

    draw(ratio) {
        for (let i = 0; i< this.particles.length; i++) {
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

    onMove(e) {
        this.mouse.x = e.clientX - this.x;
        this.mouse.y = e.clientY - this.y;
    }
}

export class Text {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    setText(str) {
        this.ctx.clearRect(0, 0, this.sw, this.sh)

        const fontWidth = 100;
        const fontSize = this.sh / 6;
        const fontName = 'Hind';

        this.ctx.font = `${fontWidth} ${fontSize}px ${fontName}`;
        this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
        this.ctx.textBaseline = 'center';

        const fontPos = this.ctx.measureText(str);

        this.ctx.fillText(
            str,
            (this.sw - fontPos.width) / 2,
            fontPos.actualBoundingBoxAscent + fontPos.actualBoundingBoxDescent + ((this.sh - fontSize) / 2)
        );

        return this.dotPos(2, this.sw, this.sh);
    }

    resize(sw, sh) {
        this.sw = sw;
        this.sh = sh;
        this.canvas.width = this.sw;
        this.canvas.height = this.sh;
    }

    dotPos(density, sw, sh) {
        const imageData = this.ctx.getImageData(
            0,0,sw,sh
        ).data;

        const particles = [];
        let i = 0;
        let width = 0;
        let pixel;

        for (let height = 0; height < sh; height += density) {
            ++i;
            const slide = (i % 2) == 0;
            width = 0;
            if (slide == 1) {
                width += 6;
            }

            for (width; width < sw; width += density) {
                pixel = imageData[((width + (height * sw)) * 4) - 1];
                if (
                    pixel != 0 &&
                    width > 0 &&
                    width < sw &&
                    height > 0 &&
                    height < sh
                ) {
                    particles.push({
                        x: width,
                        y: height
                    })
                }
            }
        }

        return particles;
    }
}

export class Particle {
    constructor(pos, texture) {
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.scale.set(0.2);
        this.sprite.tint = 0xffffff;

        this.savedX = pos.x;
        this.savedY = pos.y;
        this.x = pos.x;
        this.y = pos.y;

        this.sprite.x = this.x;
        this.sprite.y = this.y;

        this.vx = 0;
        this.vy = 0;
        this.radius = 10;
    }

    FRICTION = 0.90;
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