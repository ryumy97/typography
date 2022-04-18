export class Typing {
    constructor() {
        this.css = document.createElement('link');
        this.css.href = '/src/drawing/typewriter/animation.css';
        this.css.type = 'text/css';
        this.css.rel = 'stylesheet';

        document.head.append(this.css);

        this.canvas = document.createElement('div');
        this.canvas.className = 'typing';

        this.text = document.createElement('div');
        this.text.className = 'text'

        this.canvas.append(this.text);

        this.index = 0;
        this.textIndex = 0;

        this.progress = 0;

        this.forward = true;
        this.recentlyChanged = true;

        this.list = ['Typing...', 'I develop'];
    }

    getCanvas() {
        return this.canvas;
    }

    textChange(str) {
        this.list.push(str);
    }

    resize() {

    }

    removeDOM() {
        document.head.removeChild(this.css)
    }

    draw(progress, elapsed) {
        const ratio = elapsed / 1000;        
        this.progress += ratio;

        if (this.recentlyChanged && !this.forward) {
            if (this.progress > 1) {
                this.progress = 0;
                this.recentlyChanged = false;
            }

            return;
        }
        
        if (this.recentlyChanged && this.forward) {
            if (this.progress > 0.25) {
                this.progress = 0;
                this.recentlyChanged = false;
            }

            return;
        }

        if (this.forward && this.progress > 0.2) {
            this.progress = 0;

            const str = this.list[this.index];

            this.textIndex++;
            if (this.textIndex > str.length) {
                this.forward = false;
                this.recentlyChanged = true;
            }

            this.text.innerText = str.substring(0, this.textIndex);
        }
        else if (!this.forward && this.progress > 0.1) {
            this.progress = 0;

            const str = this.list[this.index];

            this.textIndex--;
            if (this.textIndex < 0) {
                this.forward = true;
                this.textIndex = 0;
                this.index++;

                this.recentlyChanged = true;
            }

            if (this.index >= this.list.length) {
                this.index = 0;
            }

            this.text.innerText = str.substring(0, this.textIndex);
        }
    }
}