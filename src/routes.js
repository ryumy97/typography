export function getLocation() {
    const location = window.location.hash.replace(/\#\!\//i, '');
    console.log(location)
    return location;
}

export function setLocation(loc) {
    console.log('location Update')
    window.history.pushState({}, `Typography - ${loc}`, `#!/${loc}`);
}

export function getContentNumberByName(name) {
    switch(name) {
        case 'Metaball':
            return 1;
        case 'Typewriter':
            return 2;
        case 'Gravity':
            return 3;
        case '2-bit':
            return 4;
        default: 
            return 0;
    }
}
