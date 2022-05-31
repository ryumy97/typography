import * as drawing from '../drawing/index.js';

const pages = [1, 2, 3, 4, 5, 6];

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
        case 5:
            return {
                drawing: new drawing.Wave(),
                title: 'Wave',
                number
            }
        case 6:
            return {
               drawing: new drawing.Koru(),
               title: 'Koru',
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
                description: 'Blur and threshold filter',
                imageUrl: '/assets/Metaball.png'
            }
        case 2:
            return {
                title: 'Typewriter',
                theme: 'typewriter',
                number,
                description: 'Stack of typing animation',
                imageUrl: '/assets/Typewriting.png'
            }
        case 3:
            return {
                title: 'Gravity',
                theme: 'gravity',
                number,
                description: 'Falling characters using svg and matter.js',
                imageUrl: '/assets/Gravity.png'
            }
        case 4:
            return {
                title: '2-bit',
                theme: 'twobit',
                number,
                description: '2-bit particle texture. User has ability to create a projectile that interacts with the surface.',
                imageUrl: '/assets/2-bit.png'
            }
        case 5:
            return {
                title: 'Wave',
                theme: 'wave',
                number,
                description: 'Wave animation',
                imageUrl: '/assets/Wave.png'
            }
        case 6:
            return {
                title: 'Koru',
                theme: 'koru',
                number,
                description: 'Spiral Animation like Koru'
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