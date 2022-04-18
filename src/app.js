import { Poster, PosterManager } from './poster/index.js';
import { getContent, getContentMetadata } from './lib/getContent.js';
import { getLocation, getContentNumberByName, setLocation } from './routes.js';

class App {
    constructor() {
        this.location = getLocation();
        this.contentNumber = getContentNumberByName(this.location);

        this.posters = new PosterManager(this.contentNumber ? this.contentNumber - 1 : 0);

        this.progress = 0;
        requestAnimationFrame(this.draw.bind(this));
        window.addEventListener('_selectPoster', this.selectPoster.bind(this), false);
        window.addEventListener('_viewOthersTransition', this.viewOthersTransition.bind(this), false);
        window.addEventListener('_viewOthers', this.viewOthers.bind(this), false);
        window.addEventListener('resize', this.resize.bind(this), false);
        window.addEventListener('_textChange', this.textChange.bind(this), false);
        window.addEventListener('popstate', this.popState.bind(this), false);

        this.resize();

        if (this.contentNumber) {
            const event = new CustomEvent('_selectThumbnail', {
                detail: {
                    index: this.contentNumber - 1,
                    number: this.contentNumber,
                    locationUpdate: false
                }  
            })

            dispatchEvent(event);
        }
    }

    popState(e) {
        this.location = getLocation();

        const contentNumber = this.contentNumber;
        this.contentNumber = getContentNumberByName(this.location);

        if (this.contentNumber) {
            const event = new CustomEvent('_selectThumbnail', {
                detail: {
                    index: this.contentNumber - 1,
                    number: this.contentNumber,
                    locationUpdate: true
                }  
            })
    
            dispatchEvent(event);
        }
        else {
            const event = new CustomEvent('_viewOthersFromLocation', {
                detail: {
                    index: contentNumber - 1,
                    number: contentNumber,
                    locationUpdate: true
                }
            })

            dispatchEvent(event);
        }
    }

    selectPoster(e) {
        console.log(e);
        this.contentNumber = e.detail.number;
        this.content = getContent(this.contentNumber);
        this.canvas = this.content.drawing.getCanvas();

        this.posters.appendCanvas(this.canvas);
        this.posters.removeThumbnailEvents();
        this.posters.addPosterEvents(e.detail.index);

        this.resize();

        this.progress = 0;

        const location = getContentMetadata(e.detail.number);
        if (!e.detail.locationUpdate) {
            setLocation(location.title)
        }
    }

    viewOthersTransition(e) {
        this.canvas && this.posters.removeCanvas(this.canvas);
        this.content = null;
    }
    
    viewOthers(e) {
        console.log(e);
        this.posters.removePosterEvents(e.detail.index);
        this.posters.addThumbnailEvents();      
        
        if (!e.detail.locationUpdate) {
            setLocation('')
        }
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