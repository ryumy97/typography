import { ParticleManager } from './particle.js';

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

        this.blurScale = (this.sh / 1000) * 10;

        this.renderer.resize(this.sw, this.sh);
        this.particleManager.resize(
            this.sw,
            this.sh,
            this.stage,
            view.offsetLeft,
            view.offsetTop
        );
    }

    setWebgl() {
        this.renderer = new PIXI.Renderer({
            antialias: true,
            backgroundAlpha: 0,
            resolution: window.devicePixelRatio > 1 ? 2 : 1,
            autoDensity: true,
            powerPreference: 'high-performance',
            backgroundColor: 0xffffff,
        });
        this.renderer.view.style.width = '100%';
        this.renderer.view.style.height = '100%';

        this.stage = new PIXI.Container();

        this.blurFilter = new PIXI.filters.BlurFilter();
        this.blurFilter.blur = 5;
        this.blurFilter.autoFit = true;

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
            mb: 1.0,
        };
        this.thresholdProgress = 0;

        const thresholdFilter = new PIXI.Filter(
            null,
            fragSource,
            this.uniformData
        );
        this.stage.filters = [this.blurFilter, thresholdFilter];
        this.stage.filterArea = this.renderer.screen;
    }

    draw(progress, elapsed) {
        const ratio = (60 * elapsed) / 1000;

        this.thresholdProgress +=
            (0.5 - this.thresholdProgress) * ratio * 0.015;
        this.uniformData.threshold = 1 - this.thresholdProgress;
        this.blurFilter.blur = this.blurScale;

        this.particleManager.draw(ratio);

        this.renderer.render(this.stage);
    }
}
