import { getAllContents } from '../lib/getContent.js';
import { Poster } from './poster.js';

export class PosterManager {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'thumbnailContainer'

        this.scroller = document.createElement('div');
        this.scroller.className = 'thumbnailScroller'

        this.selectedIndex = 0;
        this.currentIndex = 0;

        const pages = getAllContents();

        this.posters = pages.map((page, index) => {
            return new Poster(this.scroller, page, index, this.selectedIndex);
        })

        this.maximum = pages.length;
        this.moveOn = true;

        this.container.append(this.scroller);
        document.body.append(this.container);

        this.onSelectEvent = this.onSelect.bind(this);
        this.viewOthersEvent = this.viewOthers.bind(this);
        window.addEventListener('_selectThumbnail', this.onSelectEvent, false);
        window.addEventListener('_viewOthersTransition', this.viewOthersEvent )
    }

    onSelect(e) {
        if (this.selectedIndex === e.detail.index) {
            const event = new CustomEvent('_selectPoster', {
                detail: {
                    index: e.detail.index,
                    number: e.detail.number
                }
            })

            this.scroller.style.transform = 'perspective(10px) translate3d(0, 0, 0px)';
            setTimeout(() => {
                dispatchEvent(event);
            }, 500)
            

            this.moveOn = false;
            return;
        }

        this.selectedIndex = e.detail.index;
    }

    viewOthers(e) {
        const event = new CustomEvent('_viewOthers', {
            detail: {
                index: e.detail.index,
                number: e.detail.number
            }
        })

        this.scroller.style.transform = 'perspective(10px) translate3d(-100%, 0, -25px)';
    
        setTimeout(() => {
            dispatchEvent(event);
        }, 500)

        this.moveOn = true;
    }

    update(e) {
        this.currentIndex += (this.selectedIndex - this.currentIndex) * 0.1;
        this.move();
    }

    move() {
        if (this.moveOn) {
            this.posters.forEach(poster => {
                poster.move(this.currentIndex)
            })   
        }
    }

    appendCanvas(canvas) {
        this.container.append(canvas);
    }

    removeCanvas(canvas) {
        this.container.removeChild(canvas);
    }

    removeThumbnailEvents() {
        window.removeEventListener('_selectThumbnail', this.onSelectEvent, false);
    }

    addThumbnailEvents() {
        window.addEventListener('_selectThumbnail', this.onSelectEvent, false);
    }

    removePosterEvents(index) {
        const poster = this.posters.find(poster => poster.index === index);

        poster.removePosterEvents();
    }

    addPosterEvents(index) {
        const poster = this.posters.find(poster => poster.index === index);

        poster.addPosterEvents();
    }
}