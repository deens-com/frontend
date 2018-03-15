const colors = {
  green: '#5FB79E',
  greenActive: '#4ac4a1',
  white: '#fff'
};

const theme = {
  button: {
    mainFilled: {
      background: colors.green,
      backgroundHover: colors.greenActive,
      border: colors.green,
      borderHover: colors.green,
      color: colors.white,
      colorHover: colors.white
    },
    white: {
      background: 'transparent',
      backgroundHover: colors.green,
      border: colors.green,
      borderHover: colors.greenActive,
      color: colors.green,
      colorHover: colors.white
    },
    whiteTransparent: {
      background: 'transparent',
      backgroundHover: colors.green,
      border: colors.green,
      borderHover: colors.greenActive,
      color: colors.white,
      colorHover: colors.white
    },
    textGreen: {
      background: colors.white,
      backgroundHover: colors.white,
      border: colors.white,
      borderHover: colors.white,
      color: colors.green,
      colorHover: colors.greenActive
    }
  }
};

export default theme;
