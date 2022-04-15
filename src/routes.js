export function getLocation() {
    const location = window.location.hash.replace(/\#\!\//i, '');
    console.log(location)
    return location;
}

export function setLocation(loc) {
    window.history.pushState({}, `Typography - ${loc}`, loc);
}

export function getContentNumberByName(name) {
    switch(name) {
        case 'Metaball':
            return 1;
        case 'Typing':
            return 2;
        default: 
            return 0;
    }
}