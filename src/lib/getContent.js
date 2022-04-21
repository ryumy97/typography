import * as drawing from '../drawing/index.js';

const pages = [1, 2, 3, 4];

export function getAllContents() {
    return pages.map(getContentMetadata);
}

export function getContent(number) {
    switch(number) {
        case 1: 
            return {
                drawing: new drawing.Metaball(),
                title: 'Metaball',
                number
            }
        case 2: 
            return {
                drawing: new drawing.Typing(),
                title: 'Typewriter',
                number
            }
        case 3:
            return {
                drawing: new drawing.Gravity(),
                title: 'Gravity',
                number
            }
        case 4:
            return {
                drawing: new drawing.TwoBit(),
                title: '2-bit',
                number
            }

        default:
            return {
                drawing: new drawing.Template(),
                title: 'Nothing Here',
                number
            }
    }
}

export function getContentMetadata(number) {
    switch(number) {
        case 1:
            return {
                title: 'Metaball',
                theme: 'dark',
                number,
                description: 'Blur and threshold',
                imageUrl: '/assets/Metaball.png'
            }
        case 2:
            return {
                title: 'Typewriter',
                theme: 'dark',
                number,
                description: 'Stack of typing animation',
                imageUrl: '/assets/Typewriting.png'
            }
        case 3:
            return {
                title: 'Gravity',
                theme: 'dark',
                number,
                description: 'Falling characters',
                imageUrl: '/assets/Gravity.png'
            }
        case 4:
            return {
                title: '2-bit',
                theme: 'dark',
                number,
                description: '2-bit particle texture',
            }
        default:
            return {
                title: 'Nothing Here',
                theme: 'dark',
                number,
                description: 'Nothing to display'
            }

    }
}

export function formatContentNumber(number) {
    const str = number.toString(); 

    if (str.length === 1) {
        return `0${str}`
    }
    else {
        return str;
    }
}