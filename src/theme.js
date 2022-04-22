
export function getTheme(theme) {
    switch(theme) {
        case 'dark':
            return {
                textColor: '#ffffff',
                descriptionColor: '#aaaaaa',
                backgroundColor: '#111111'
            }
        case 'twobit': 
            return {
                textColor: '#517D45',
                descriptionColor: '#99B68A',
                backgroundColor: '#DFF0D3'
            }
        default:
            return {
                textColor: '#ffffff',
                descriptionColor: '#aaaaaa',
                backgroundColor: '#111111'
            }
    }
}