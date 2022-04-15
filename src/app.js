import { Poster, PosterManager } from './poster/index.js';
import { getContent } from './lib/getContent.js';
import { getLocation, getContentNumberByName } from './routes.js';

class App {
    constructor() {
        this.location = getLocation();
        this.contentNumber = getContentNumberByName(this.location);

        this.posters = new PosterManager();
        this.content = getContent(this.contentNumber);
        this.canvas = this.content.drawing.getCanvas();

        this.progress = 0;
        requestAnimationFrame(this.draw.bind(this));
        window.addEventListener('_selectPoster', this.selectPoster.bind(this), false);
        window.addEventListener('_viewOthersTransition', this.viewOthersTransition.bind(this), false);
        window.addEventListener('_viewOthers', this.viewOthers.bind(this), false);
        window.addEventListener('resize', this.resize.bind(this), false);
        window.addEventListener('_textChange', this.textChange.bind(this), false);
        this.resize();
    }

    selectPoster(e) {
        this.contentNumber = e.detail.number;
        this.content = getContent(this.contentNumber);
        this.canvas = this.content.drawing.getCanvas();

        this.posters.appendCanvas(this.canvas);
        this.posters.removeThumbnailEvents();
        this.posters.addPosterEvents(e.detail.index);

        this.resize();

        this.progress = 0;
    }

    viewOthersTransition(e) {
        this.canvas && this.posters.removeCanvas(this.canvas);
        this.content = null;
    }
    
    viewOthers(e) {
        this.posters.removePosterEvents(e.detail.index);
        this.posters.addThumbnailEvents();       
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

        this.posters && this.posters.update();

        this.content && this.content.drawing.draw(this.progress, elapsed);

        this.then = this.now;

        requestAnimationFrame(this.draw.bind(this));
    }

    resize() {
        this.content && this.content.drawing.resize();
    }

    textChange(e) {
        const text = e.detail.text;
        this.content && this.content.drawing.textChange(text);

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