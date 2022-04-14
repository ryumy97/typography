import * as drawing from '../drawing/index.js';

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
                drawing: new drawing.Template(),
                title: 'Typing',
                number
            }
        default:
            return {
                drawing: new drawing.Metaball(),
                title: 'Metaball',
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
                number
            }
        case 2:
            return {
                title: 'Typing',
                theme: 'dark',
                number
            }
        default:
            return {
                title: 'Metaball',
                theme: 'dark'
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