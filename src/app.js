import { Poster } from './poster.js';
import { Metaball } from './drawing/metaball/index.js';

class App {
    constructor() {
        this.content = new Metaball();
        this.canvas = this.content.getCanvas();

        this.poster = new Poster(this.canvas, 1);

        window.addEventListener('resize', this.resize.bind(this), false);
        window.addEventListener('_textChange', this.textChange.bind(this), false);
        this.resize();

        this.progress = 0;

        requestAnimationFrame(this.draw.bind(this));
    }

    draw(t) {
        this.now = Date.now();

        const elapsed = this.then ? this.now - this.then : 0;
        this.progress += elapsed / 1000;

        this.content.draw(this.progress, elapsed);

        this.then = this.now;

        requestAnimationFrame(this.draw.bind(this));
    }

    resize() {
        this.content.resize();
    }

    textChange(e) {
        const text = e.detail.text;
        this.content.textChange(text);

        this.progress = 0;
    }
}

window.onload = () => {
    WebFont.load({
        google: {
            families: ['Hind']
        },
        fontactive: () => {
            new App();
        }
    })
}