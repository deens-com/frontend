import styled from 'styled-components';

export const sizes = {
  small: '38em',
  medium: '54em',
  mediumPlus: '60em',
  large: '70em',
  largePlus: '80em',
};

export const media = {
  mobileMinSmall: `@media only screen and (min-width: ${sizes.medium})`, //Here we set sizes.medium to take into consideration landscape mode..
  minSmall: `@media only screen and (min-width: ${sizes.small})`,
  minMedium: `@media only screen and (min-width: ${sizes.medium})`,
  minMediumPlus: `@media only screen and (min-width: ${sizes.mediumPlus})`,
  minLarge: `@media only screen and (min-width: ${sizes.large})`,
  minLargePlus: `@media only screen and (min-width: ${sizes.largePlus})`,
};

export const placeholderMixin = content => {
  return `
    &::-webkit-input-placeholder { /* Chrome/Opera/Safari */
      ${content}
    }
    &::-moz-placeholder { /* Firefox 19+ */
      ${content}
    }
    &:-ms-input-placeholder { /* IE 10+ */
      ${content}
    }
    &:-moz-placeholder { /* Firefox 18- */
      ${content}
    }
  `;
};

export const resetLink = opt => {
  return `

  `;
};

export const resetButton = opt => {
  return `
    display: inline-block;
    font-family: ${(opt && opt.fontFamily) || 'inherit'};
    font-size: ${(opt && opt.fontSize) || 'inherit'};
    font-weight: ${(opt && opt.fontWeight) || 'inherit'};
    background: ${(opt && opt.background) || 'transparent'};
    color: ${(opt && opt.color) || 'inherit'};
    border: ${(opt && opt.border) || 'none'};
    white-space: nowrap;
    cursor: pointer;
    text-decoration: none;
    width: 100%;
  `;
};

export const CenterAlign = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
