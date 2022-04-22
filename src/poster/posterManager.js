import { getAllContents } from '../lib/getContent.js';
import { getTheme } from '../theme.js';
import { Poster } from './poster.js';

export class PosterManager {
    constructor(selectedIndex) {
        this.container = document.createElement('div');
        this.container.className = 'thumbnailContainer';

        this.scroller = document.createElement('div');
        this.scroller.className = 'thumbnailScroller';

        this.selectedIndex = selectedIndex;
        this.currentIndex = -5;

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
        window.addEventListener('_viewOthersTransition', this.viewOthersEvent, false);

        this.selectTimeout = null;

        this.scrollEvent = this.onScroll.bind(this);
        this.scrollEnabled = true;
        window.addEventListener('wheel', this.scrollEvent, false);

        this.mouseClickEvent = this.onClick.bind(this);
        window.addEventListener('pointerdown', this.mouseClickEvent, false);

        this.clicking = false;
        this.clickEnabled = true;

        this.mouseMoveEvent = this.onMove.bind(this);
        window.addEventListener('pointermove', this.mouseMoveEvent, false);

        this.mouseClickEvent = this.onUp.bind(this);
        window.addEventListener('pointerup', this.mouseClickEvent, false);

        document.body.style.cursor = 'grab';
    }

    onClick(e) {
        if (this.clickEnabled) {
            this.clicking = true;
            this.y = e.y;
            document.body.style.cursor = 'grabbing';
        }
    }

    onMove(e) {
        if (!this.clicking) {
            return;
        }

        this.selectedIndex += (this.y - e.y) / this.container.clientHeight * 3;

        if (this.selectedIndex > this.maximum + 0.2 - 1) {
            this.selectedIndex = this.maximum + 0.2 - 1;
        }
        if (this.selectedIndex < -0.2) {
            this.selectedIndex = -0.2;
        }

        this.y = e.y;
    }

    onUp(e) {
        this.clicking = false;

        if (this.clickEnabled) {
            document.body.style.cursor = 'grab';
        }
    }

    onScroll(e) {
        if (!this.scrollEnabled) {
            return;
        }

        this.selectedIndex += e.deltaY * 0.002;
        if (this.selectedIndex > this.maximum + 0.2 - 1) {
            this.selectedIndex = this.maximum + 0.2 - 1;
        }
        if (this.selectedIndex < -0.2) {
            this.selectedIndex = -0.2;
        }
    }

    onSelect(e) {
        if (this.selectedIndex + 0.5 > e.detail.index && this.selectedIndex - 0.5 < e.detail.index) {

            const event = new CustomEvent('_selectPoster', {
                detail: {
                    index: e.detail.index,
                    number: e.detail.number,
                    locationUpdate: e.detail.locationUpdate
                }
            })

            this.scroller.style.transform = 'perspective(10px) translate3d(0, 0, 0px)';
            
            this.selectTimeout = this.selectTimeout || setTimeout(() => {
                dispatchEvent(event);
                this.selectTimeout = null;
            }, 500)
            
            const poster = this.posters.find(poster => poster.index === e.detail.index);
            poster && poster.hideImage()

            this.selectedIndex = e.detail.index;
            this.scrollEnabled = false;
            this.clicking = false;
            this.clickEnabled = false;

            document.body.style.cursor = 'default';
            return;
        }

        this.selectedIndex = e.detail.index;
    }

    viewOthers(e) {
        const event = new CustomEvent('_viewOthers', {
            detail: {
                index: e.detail.index,
                number: e.detail.number,
                locationUpdate: e.detail.locationUpdate
            }
        })

        this.scroller.style.transform = 'perspective(10px) translate3d(-100%, 0, -20px)';
    
        setTimeout(() => {
            dispatchEvent(event);
        }, 500)

        this.moveOn = true;
        this.scrollEnabled = true;
        this.clickEnabled = true;
        document.body.style.cursor = 'grab';
    }

    update(e) {
        this.currentIndex += (this.selectedIndex - this.currentIndex) * 0.1;
        if (this.currentIndex > 0) {
            const rounded = Math.round(this.currentIndex);
            const theme = getTheme(this.posters[rounded].data.theme);

            document.body.style.backgroundColor = theme.backgroundColor;
            document.querySelectorAll('.metadata').forEach(_ => {
                _.style.color = theme.textColor;
            })

            document.querySelectorAll('.metadata p').forEach(_ => {
                _.style.color = theme.descriptionColor;
            })
        }

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
        window.removeEventListener('wheel', this.scrollEvent, false);
    }

    addThumbnailEvents() {
        window.addEventListener('_selectThumbnail', this.onSelectEvent, false);
        window.addEventListener('wheel', this.scrollEvent, false);
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