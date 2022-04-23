export class About {
    constructor() {
        this.buttonContainer = document.createElement('div');
        this.buttonContainer.id = 'aboutContainer';
        this.buttonContainer.className = 'aboutContainer dark';

        this.button = document.createElement('p');
        this.button.id = 'about'
        this.button.className = 'about hovering';
        this.button.innerText = 'About';

        this.button.addEventListener('click', this.onClick.bind(this), false);

        this.backbutton = document.createElement('p');
        this.backbutton.id = 'back';
        this.backbutton.className = 'back hovering';
        this.backbutton.innerText = 'Back';

        this.backbutton.addEventListener('click', this.onClick.bind(this), false);

        this.buttonContainer.append(this.button);
        this.buttonContainer.append(this.backbutton);

        document.body.append(this.buttonContainer);

        window.addEventListener('_viewOthers', this.onViewOthers.bind(this), false);

        this.aboutContainer = document.createElement('div');
        this.aboutContainer.id = 'aboutContentContainer';
        this.aboutContainer.className = 'aboutContentContainer hide';

        this.aboutContainer.innerHTML = `
            <div class='aboutContent'>
                <h1>Kinetic Typography Study</h1>
                <div class='line'></div>
                <p>
                    This website holds a collection of interactive experience of kinetic typography.<br/>
                    Each of the expereinces is displayed as a poster with theme and image describing the characteristic of the typography.<br/>
                    When the poster is clicked, the view zooms into the poster, then the interactive typography is displayed.<br/>
                    Users can change the word by clicking the word keyboard, which will display the input for the new word to be displayed.<br/>
                    <br/>
                    If you enjoyed the expereince and wish to contact me, <br>
                    Email to <a href='mailto:inha.ryu.97@gmail.com' class='hovering'>inha.ryu.97@gmail.com</a><br/>
                    <br/>
                    Copyright © 2022 In Ha Ryu. All rights reserved.
                </p>
            </div>
        `;

        this.show = false;

        document.body.append(this.aboutContainer);
    }

    onViewOthers(e) {
        console.log('sho')
        this.buttonContainer.classList.remove('hide');
    }

    onClick(e) {
        if (!this.show) {
            document.getElementById('thumbnailContainer').classList.add('move');

            this.buttonContainer.classList.add('show');
            this.aboutContainer.classList.remove('hide');
    
            this.show = true;
        }
        else {
            document.getElementById('thumbnailContainer').classList.remove('move');

            this.buttonContainer.classList.remove('show');
            this.aboutContainer.classList.add('hide')

            this.show = false;
        }
    }
}