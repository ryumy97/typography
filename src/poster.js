export class Poster {
    constructor(canvas, contentNumber) {
        this.container = document.createElement('div');
        this.container.className = 'container';

        //heading
        this.headingContainer = document.createElement('div');
        this.headingContainer.className = 'headingContainer';

        this.heading = document.createElement('h1');
        this.heading.className = 'heading';
        this.heading.innerText = 'Typography';

        this.projectHeading = document.createElement('h2');
        this.projectHeading.innerText = 'Metaball';

        //number
        this.number = document.createElement('h1');
        this.number.className = 'number'
        this.number.innerText = '01';

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
        this.projectUrl.className = 'projectUrl hovering';
        this.projectUrl.innerText = 'typography.ryumy.com';

        this.creator = document.createElement('p');
        this.creator.className = 'creator';
        this.creator.innerHTML = 'In Ha<br>Ryu';

        //see others
        this.posterLinks = document.createElement('div');
        this.posterLinks.className = 'posterDescription hovering'

        this.posterDescription = document.createElement('h4');
        this.posterDescription.innerText = 'See others'

        this.arrow = document.createElement('h4');
        this.arrow.innerText = '->'
        
        //key
        this.keyboard = document.createElement('h4');
        this.keyboard.className = 'keyboardButton hovering';
        this.keyboard.innerText = 'keyboard.'

        //append all
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
            canvas ? canvas : []
        )

        document.body.append(this.container);


        //key input
        this.keyboardinputContainer = document.createElement('div');
        this.keyboardinputContainer.className = 'keyboardinput off';

        this.keyboardinput = document.createElement('input');
        this.keyboardinput.type = 'text';
        this.keyboardinput.id = 'keyboard';
        this.keyboardinput.on = true;
        this.keyboardinputContainer.append(this.keyboardinput);

        this.keyboardinput.placeholder = 'Enter text...';

        document.body.append(this.keyboardinputContainer);

        //eventhandlers
        this.keyboardToggleBinded = this.keyboardToggle.bind(this);

        this.keyboard.addEventListener('click', this.keyboardToggleBinded, false);
        this.keyboardinput.addEventListener('keypress', this.keyboardInput, false);
        this.keyboardinputContainer.addEventListener('click', this.keyboardFocus.bind(this), false)
        this.posterLinks.addEventListener('click', this.seeOthersToggle.bind(this), false);

        window.addEventListener('_textChange', this.keyboardToggleBinded, false);
    }

    keyboardToggle(e) {
        console.log(e);
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
    
    seeOthersToggle(e) {
        if (this.keyboardinputContainer.on) {
            this.keyboardToggle();
        }

        const event = new CustomEvent('_viewOthers', {

        })

        window.dispatchEvent(event);
    }
}