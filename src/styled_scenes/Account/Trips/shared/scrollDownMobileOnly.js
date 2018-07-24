export const scrollDownMobileOnly = () => {
  const currentWidth = window.innerWidth;
  if (currentWidth <= 750) {
    setTimeout(() => {
      window.scrollBy(0, 520);
    }, 20);
  }
};
