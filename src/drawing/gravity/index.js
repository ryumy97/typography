import { Box } from './box.js';
import { Text } from './text.js';
import { getPath } from './helper.js';

const {
    Engine,
    Render,
    Runner,
    Composite,
    Bodies,
    Body,
    Svg,
    Vertices,
} = window.Matter
  

export class Gravity {
    constructor() {
        this.container = document.createElement('div');
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.str = 'Gravity'
        this.list = [];
        this.boxList = [];

        this.engine = Engine.create();
        this.world = this.engine.world;

        const options = {
            wireframes: false,
            width: 300,
            height: 500,
            background: '#00000000'
        }

        this.renderer = Render.create({
            element: this.container,
            canvas: this.canvas,
            engine: this.engine,
            options
        })

        Render.run(this.renderer);
        const runner = Runner.create();
        Runner.run(runner, this.engine);

        this.engine.gravity.y = 1;
    }

    getCanvas() {
        return this.container;
    }

    textChange(str) {
        this.str = str.replace(/[^a-zA-Z]/, '');
        this.createWorld()
    }

    resize() {
        this.sw = this.canvas.clientWidth;
        this.sh = this.canvas.clientHeight;

        this.canvas.width = this.sw * 2;
        this.canvas.height = this.sh * 2;

        this.ctx.scale(2,2);
        this.createWorld()
    }

    createWorld() {
        Composite.clear(
            this.world
            );

        this.list = [];
        this.boxList = [];

        const fontWidth = 700;
        const fontSize = this.sh / 6;
        const fontName = 'Hind';

        this.ctx.font = `${fontWidth} ${fontSize}px ${fontName}`;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';

        const fontMeasurement = this.ctx.measureText(this.str);

        let x = this.sw / 2 - fontMeasurement.width / 2;
        for (let i = 0; i < this.str.length; i++) {
            const measurement = this.ctx.measureText(this.str[i]);

            x += measurement.width / 2 + 2 * i;
            
            const text = new Text(
                x,
                this.sh / 2,
                this.str[i],
                this.ctx.measureText(this.str[i])
                );

            this.list.push(text);

            x += measurement.width / 2;
        }

        this.boxList.push(
            new Box(this.sw / 2, this.sh + 10, this.sw, 20)
            );

        const posterDOM = document.getElementById('poster_Gravity');
        const children = posterDOM.children;
        for (let i = 0; i < children.length; i++) {
            const child = children.item(i);
            if (child.className === 'metadata' || child.className === 'image') {
                continue;
            }

            const box = child.getBoundingClientRect();
            
            this.boxList.push(
                new Box(box.x + box.width / 2, box.y + box.height / 2, box.width, box.height)
            )
        }

        const bodies = this.boxList.map(_ => {
            return Bodies.rectangle(_.x, _.y, _.w, _.h, {
                isStatic: _.isStationary,
                render: {
                    opacity: 0
                }
            });
        })

        Composite.add(
            this.world,
            bodies
        )

        const texts = this.list.map(_ => {
            const pathEl = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'path'
            );

            pathEl.setAttribute('d', getPath(_.str));
            pathEl.setAttribute('vector-effect', 'non-scaling-stroke')

            const points = [];
            for (let i = 0; i < pathEl.getTotalLength(); i += pathEl.getTotalLength() / 100) {
                const p = pathEl.getPointAtLength(i);
                points.push({
                    ...p,
                    x: p.x * this.sh / 600,
                    y: p.y * this.sh / 600,
                });
            }

            return Bodies.fromVertices(
                _.x,
                _.y,
                points,
                {
                    render: {
                        fillStyle: '#DFC92C',
                        strokeStyle: '#DFC92C',
                        lineWidth: 1
                    }
                }, false, 0.05, 0.1, 0.1
            )
        })

        Composite.add(
            this.world,
            texts
        )
    }

    update(elapsed) {

    }

    draw(progress, elapsed) {
        this.update(elapsed);
        this.ctx.clearRect(0, 0, this.sw, this.sh);

    }
}
