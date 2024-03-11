const colorPalette = {
  monoDark: '#0F2436',
  mono: '#1C2E42',
  monoLight: '#2E445B',

  diDark: '#647A8F',
  di: '#8CA1B4',
  diLight: '#A3B8C5',

  tri: '#EBECED',
  tetra: '#F4F7FA',

  black: '#0B121A',
  white: '#000000',
  red: '#D85B5F',
  redLight: '#F19B9E',

  glass(opacity) {
    return `rgba(255, 255, 255, ${opacity})`;
  },
};

export default colorPalette;
