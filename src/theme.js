
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
        case 'typewriter':
            return {
                textColor: '#E4F0FC',
                descriptionColor: '#AED7FF',
                backgroundColor: '#151C26'
            }
        case 'gravity':
            return {
                textColor: '#FF3750',
                descriptionColor: '#9C0918',
                backgroundColor: '#190E38'
            }
        default:
            return {
                textColor: '#ffffff',
                descriptionColor: '#aaaaaa',
                backgroundColor: '#111111'
            }
    }
}