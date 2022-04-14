import { Poster } from './poster.js';
import { getContent } from './lib/getContent.js';
import { getLocation, getContentNumberByName } from './routes.js';

class App {
    constructor() {
        this.location = getLocation();
        this.contentNumber = getContentNumberByName(this.location);

        if (this.contentNumber == 0) {
            
        }

        this.content = getContent(this.contentNumber);
        this.canvas = this.content.drawing.getCanvas();

        this.poster = new Poster(this.canvas, this.content);

        window.addEventListener('resize', this.resize.bind(this), false);
        window.addEventListener('_textChange', this.textChange.bind(this), false);
        this.resize();

        this.progress = 0;

        requestAnimationFrame(this.draw.bind(this));
    }

    draw(t) {
        this.now = Date.now();

        const elapsed = this.then ? this.now - this.then : 0;
        if (elapsed > 500) {
            this.then = this.now;

            requestAnimationFrame(this.draw.bind(this));

            return
        }
        this.progress += elapsed / 1000;

        this.content.drawing.draw(this.progress, elapsed);

        this.then = this.now;

        requestAnimationFrame(this.draw.bind(this));
    }

    resize() {
        this.content.drawing.resize();
    }

    textChange(e) {
        const text = e.detail.text;
        this.content.drawing.textChange(text);

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