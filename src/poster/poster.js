import { formatContentNumber } from '../lib/getContent.js'

export class Poster {
    constructor(container, data, index, selectedIndex) {
        this.index = index;
        this.data = data;

        this.container = document.createElement('div');
        this.container.className = `container ${data.theme}`;
        this.container.id = `poster_${data.title}`

        //heading
        this.headingContainer = document.createElement('div');
        this.headingContainer.className = 'headingContainer';

        this.heading = document.createElement('h1');
        this.heading.className = 'heading';
        this.heading.innerText = 'Typography';

        this.projectHeading = document.createElement('h2');
        this.projectHeading.innerText = data.title;

        //number
        this.number = document.createElement('h1');
        this.number.className = 'number'
        this.number.innerText = formatContentNumber(data.number);

        //description
        this.descriptionContianer = document.createElement('div');
        this.descriptionContianer.className = 'description';

        this.projectName = document.createElement('h4');
        this.projectName.className = 'projectName';
        this.projectName.innerText = 'Kinetic Typography Study';

        this.projectDescription = document.createElement('h4');
        this.projectDescription.className = 'projectDescription';
        this.projectDescription.innerText = 'A collective interactive kinetic typography experiences';

        this.projectUrl = document.createElement('a');
        this.projectUrl.className = 'projectUrl';
        this.projectUrl.innerText = 'typography.ryumy.com';

        this.creator = document.createElement('p');
        this.creator.className = 'creator';
        this.creator.innerHTML = 'In Ha<br>Ryu';

        if (data.imageUrl) {
            this.imageContainer = document.createElement('div');
            this.imageContainer.className = 'image'
            this.image = new Image();
            this.image.src = data.imageUrl

            this.imageContainer.append(this.image);
        }

        //see others
        this.posterLinks = document.createElement('div');
        this.posterLinks.className = 'posterDescription'

        this.posterDescription = document.createElement('h4');
        this.posterDescription.innerText = 'See others'

        this.arrow = document.createElement('h4');
        this.arrow.innerText = '->';
        
        //key
        this.keyboard = document.createElement('h4');
        this.keyboard.className = 'keyboardButton';
        this.keyboard.innerText = 'keyboard.';

        //Metadata
        this.metadata = document.createElement('div');
        this.metadata.className = 'metadata';

        this.metadataContainer = document.createElement('div');

        this.metadataHeading = document.createElement('h1');
        this.metadataHeading.innerText = data.title;

        this.metadataNumber = document.createElement('h2');
        this.metadataNumber.innerText = formatContentNumber(data.number);

        this.metadataDescription = document.createElement('p');
        this.metadataDescription.innerText = data.description;

        //append all
        this.metadata.append(
            this.metadataContainer
        )
        
        this.metadataContainer.append(
            this.metadataHeading,
            this.metadataNumber,
            this.metadataDescription
        );

        this.headingContainer.append(
            this.heading,
            this.projectHeading
        );

        this.posterLinks.append(
            this.arrow,
            this.posterDescription
        );

        this.descriptionContianer.append(
            this.projectName,
            this.projectDescription,
            this.projectUrl,
            this.creator
        )

        this.container.append(
            this.headingContainer,
            this.number,
            this.descriptionContianer,
            this.posterLinks,
            this.keyboard,
            this.imageContainer ? this.imageContainer : [],
            this.metadata
        )
        
        this.move(selectedIndex);
        container.append(this.container);

        //projectUrl
        this.projectUrlClickEvent = this.copyUrl.bind(this);

        //key input
        this.keyboardinputContainer = document.createElement('div');
        this.keyboardinputContainer.className = 'keyboardinput off';

        this.keyboardinput = document.createElement('input');
        this.keyboardinput.type = 'text';
        this.keyboardinput.id = 'keyboard';
        this.keyboardinput.on = true;
        this.keyboardinputContainer.append(this.keyboardinput);

        this.keyboardinput.placeholder = 'Enter text...';

        //eventhandlers
        this.keyboardToggleBinded = this.keyboardToggle.bind(this);
        this.keyboardFocusEvent = this.keyboardFocus.bind(this);
        this.seeOthersToggleEvent = this.seeOthersToggle.bind(this);

        this.container.addEventListener('pointerdown', this.onClick.bind(this), false);
        this.container.addEventListener('pointerup', this.onUp.bind(this), false);
        this.container.addEventListener('pointermove', this.onMove.bind(this), false);

        window.addEventListener('_viewOthersFromLocation', this.viewOthersFromLocation.bind(this), false);
    }

    keyboardToggle(e) {
        if (this.keyboardinputContainer.on) {
            this.keyboardinputContainer.on = false;
            this.keyboardinputContainer.classList.remove('on');
            this.keyboardinputContainer.classList.add('off');

            this.container.removeEventListener('click', this.keyboardToggleBinded, false);
        }
        else {
            this.keyboardinputContainer.on = true;
            this.keyboardinputContainer.classList.remove('off');
            this.keyboardinputContainer.classList.add('on');

            setTimeout(() => {
                this.container.addEventListener('click', this.keyboardToggleBinded, false);
            }, 100)
        }
    }

    keyboardFocus(e) {
        this.keyboardinput.focus();
    }

    keyboardInput(e) {
        if (e.key === 'Enter') {
            const value = document.getElementById('keyboard').value;
            if (value) {
                console.log('Enter event:', document.getElementById('keyboard').value);
                const event = new CustomEvent('_textChange', {
                    detail: {
                        text: document.getElementById('keyboard').value
                    }
                })
    
                window.dispatchEvent(event);
            }
        }
    }

    viewOthersFromLocation(e) {
        if (e.detail.index === this.index) {
            this.seeOthersToggle(e);
        }
    }
    
    seeOthersToggle(e) {
        if (this.keyboardinputContainer.on) {
            this.keyboardToggle();
        }

        const event = new CustomEvent('_viewOthersTransition', {
            detail: {
                index: this.index,
                number: this.data.number, 
                locationUpdate: e.detail.locationUpdate
            }
        })

        this.showImage();

        window.dispatchEvent(event);
    }

    onClick(e) {
        this.clickEvent = new CustomEvent('_selectThumbnail', {
            detail: {
                index: this.index,
                number: this.data.number,
                locationUpdate: e.detail.locationUpdate
            }
        });

        this.savedX = e.x;
        this.savedY = e.y;

        this.clickTimeout = setTimeout(() => {
            this.clickEvent = null;
        }, 1000);
    }

    onUp(e) {
        if (this.clickEvent) {
            dispatchEvent(this.clickEvent);
            clearTimeout(this.clickTimeout);
            this.clickTimeout = null;
        }
    }

    onMove(e) {
        if (
            (
                (this.savedX + 30 < e.x || this.savedX - 30 > e.x) ||
                (this.savedY + 30 < e.y || this.savedY - 30 > e.y) 
            ) && this.clickEvent
            ) {
            this.clickEvent = false;
        };
    }

    move(currentIndex) {
        const radius = 600;

        const angle = (currentIndex - this.index) * 8 - 90;

        const x = -radius * Math.sin(Math.PI * 2 * angle / 360) - radius;
        const y = -radius * Math.cos(Math.PI * 2 * angle / 360);

        const scale = (this.index - currentIndex) > 0
            ? 1 - (this.index - currentIndex) * 0.1
            : 1 - (currentIndex - this.index) * 0.1

        this.container.style.transform = `
            translate3d(${x}%,${y}%,0)
            rotate(${(this.index - currentIndex) * 8}deg)
            scale(${scale})`;

        const z = (this.index - currentIndex) > 0
            ? 100 - (this.index - currentIndex) * 2
            : 100 - (currentIndex - this.index) * 2

        this.container.style.zIndex = Math.floor(z);
    }

    copyUrl() {
        navigator.clipboard.writeText(window.location.toString());
    }

    addPosterEvents() {
        document.body.append(this.keyboardinputContainer);

        this.projectUrl.classList.add('hovering');
        this.projectUrl.addEventListener('click', this.projectUrlClickEvent, false);

        this.keyboard.addEventListener('click', this.keyboardToggleBinded, false);
        this.keyboard.classList.add('hovering');
        
        this.keyboardinput.addEventListener('keypress', this.keyboardInput, false);
        this.keyboardinputContainer.addEventListener('click', this.keyboardFocusEvent, false)

        this.posterLinks.addEventListener('click', this.seeOthersToggleEvent, false);
        this.posterLinks.classList.add('hovering');

        window.addEventListener('_textChange', this.keyboardToggleBinded, false);
    }

    removePosterEvents() {
        document.body.removeChild(this.keyboardinputContainer);

        this.projectUrl.classList.remove('hovering');
        this.projectUrl.removeEventListener('click', this.projectUrlClickEvent, false);

        this.keyboard.removeEventListener('click', this.keyboardToggleBinded, false);
        this.keyboard.classList.remove('hovering');
        
        this.keyboardinput.removeEventListener('keypress', this.keyboardInput, false);
        this.keyboardinputContainer.removeEventListener('click', this.keyboardFocusEvent, false)

        this.posterLinks.removeEventListener('click', this.seeOthersToggleEvent, false);
        this.posterLinks.classList.remove('hovering');

        window.removeEventListener('_textChange', this.keyboardToggleBinded, false);
    }

    hideImage() {
        if (this.imageContainer) {
            this.imageContainer.style.opacity = '0.0';
        }
    }

    showImage() {
        if (this.imageContainer) {
            this.imageContainer.style.opacity = '1.0';
        }
    }
}