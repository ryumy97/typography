export function getTheme(theme) {
  switch (theme) {
    case 'dark':
      return {
        textColor: '#ffffff',
        descriptionColor: '#aaaaaa',
        backgroundColor: '#111111',
      };
    case 'twobit':
      return {
        textColor: '#517D45',
        descriptionColor: '#99B68A',
        backgroundColor: '#DFF0D3',
      };
    case 'typewriter':
      return {
        textColor: '#E4F0FC',
        descriptionColor: '#AED7FF',
        backgroundColor: '#151C26',
      };
    case 'gravity':
      return {
        textColor: '#FF3750',
        descriptionColor: '#9C0918',
        backgroundColor: '#190E38',
      };
    case 'wave':
      return {
        textColor: '#4CA9D0',
        descriptionColor: '#72D0E9',
        backgroundColor: '#ddeeff',
      };
    case 'koru':
      return {
        textColor: '#ffffff',
        descriptionColor: '#eeeeee',
        backgroundColor: '#5C8438',
      };
    case 'fireflies':
      return {
        textColor: '#d5db3d',
        descriptionColor: '#d5db3d',
        backgroundColor: '#110D12',
      };
    default:
      return {
        textColor: '#ffffff',
        descriptionColor: '#aaaaaa',
        backgroundColor: '#111111',
      };
  }
}
