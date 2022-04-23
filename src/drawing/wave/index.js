import { WavePoints } from "./points.js";

export class Wave {
    constructor() {
        this.text = new Text();        

        this.renderer = new PIXI.Renderer({
            antialias: true,
            backgroundAlpha: 0,
            resolution: (window.devicePixelRatio > 1) ? 2 : 1,
            autoDensity: true,
            powerPreference: 'high-performance',
        });

        this.renderer.view.style.width = '100%';
        this.renderer.view.style.height = '100%';

        this.stage = new PIXI.Container();

        const fragSource = `
            precision mediump float;
            varying vec2 vTextureCoord;
            uniform sampler2D uSampler;

            void main(void) {
                vec4 color = texture2D(uSampler, vTextureCoord);
                if (color.r == 1.0 && color.g == 1.0 && color.b == 1.0) {
                    gl_FragColor = vec4(1.0, 1.0, 1.0, 0.5);
                }
                else if (color.a > 0.99) {
                    gl_FragColor = color;
                }
                else {
                    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                }
            }
        `;

        this.thresholdProgress = 0;

        const thresholdFilter = new PIXI.Filter(null, fragSource);
        thresholdFilter.resolution = (window.devicePixelRatio > 1) ? 2 : 1;

        this.stage.filters = [thresholdFilter];
        this.stage.filterArea = this.renderer.screen;

        this.waves = [
            new WavePoints(0x00c7eb, 30),
            new WavePoints(0x0095c7, 25),
            new WavePoints(0x00579e, 20)
        ];

        this.str = 'Wave';

        this.mouse = {
            x: 0,
            y: 0
        }
        window.addEventListener('mousemove', this.onMove.bind(this), false);

        window.addEventListener('touchmove', this.onTouchMove.bind(this), false);
    }

    getCanvas() {
        return this.renderer.view;
    }

    textChange(str) {
        this.str = str;
        this.show();
    }

    resize() {
        const view = this.getCanvas();
        view.style.width = '100%';
        view.style.height = '100%';

        this.sw = view.clientWidth;
        this.sh = view.clientHeight;

        this.renderer.resize(this.sw, this.sh);        
        this.waves.forEach(_ => _.resize(this.sw, this.sh));

        this.mouse = {
            x: this.sw / 2,
            y: this.sh / 2
        }

        this.show()
    }

    show() {
        if (this.container) {
            this.stage.removeChild(this.container);
        }
        
        this.container = new PIXI.Container(
            1,
            {
                vertices: false,
                position: true,
                rotation: false,
                scale: false,
                uvs: false,
                tint: false
            }
        );

        const style = new PIXI.TextStyle({
            fontWeight: 700,
            fontSize: this.sh / 6,
            fontFamily: 'Hind',
            fill: 'rgba(255, 255, 255, 1.0)',
        })

        this.text = new PIXI.Text(this.str, style)
        this.text.x = this.sw / 2;
        this.text.y = this.sh / 2;
        this.text.anchor.set(0.5, 0.5);

        this.stage.addChild(this.container);

        this.container.addChild(this.text);
        this.waves.forEach(_ => {
            this.container.addChild(_.graphic);            
        })
    }

    draw(progress, elapsed) {
        const ratio = 60 * elapsed / 1000;

        this.waves.forEach(_ => _.draw(progress, this.mouse));

        // this.points.forEach(_ => {
        //     _.drawWireframe();
        // })

        this.renderer.render(this.stage);
    }

    onMove(e) {
        this.mouse.x = e.clientX;

        const fontSize = this.sh / 6;
        const clientRatio = e.clientY / this.sh;
        this.mouse.y = (this.sh / 2) - fontSize / 2 + fontSize * clientRatio;

        const lastWaveColor = 0x00579e;
        const r = lastWaveColor >> (4 * 4);
        const b = (lastWaveColor >> (4 * 2)) & 0xff;
        const g = lastWaveColor & 0xff;
    
        const color = (r * clientRatio * 2) << (4 * 4) | (b * clientRatio * 2) << (4 * 2) | (g * clientRatio * 2);

        this.waves[this.waves.length - 1].color = clientRatio * 2 > 1 ? lastWaveColor : color;
    }

    onTouchMove(e) {
        this.mouse.x = e.touches[0].clientX;

        const fontSize = this.sh / 10;
        this.mouse.y = e.touches[0].clientY;

        if (this.mouse.y > (this.sh / 2) - fontSize / 2 + fontSize) {
            this.mouse.y = (this.sh / 2) - fontSize / 2 + fontSize;
        }
        else if (this.mouse.y < (this.sh / 2) - fontSize / 2) {
            this.mouse.y = (this.sh / 2) - fontSize / 2;
        }

        console.log(this.mouse);
    }
}
