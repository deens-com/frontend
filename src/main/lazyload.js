(async () => {
  /*if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('.lazyload');
    images.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
      if (img.dataset.background) {
        var bg = e.target.getAttribute('data-bg');
        if(bg){
            e.target.style.backgroundImage = 'url(' + bg + ')';
        }
      }
    });
  } else {*/
  // Dynamically import the LazySizes library
  let script = document.createElement('script');
  script.async = true;
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/4.1.8/lazysizes.min.js';
  document.body.appendChild(script);
  document.addEventListener('lazybeforeunveil', function(e) {
    var bg = e.target.getAttribute('data-bg');
    if (bg) {
      e.target.style.backgroundImage = 'url(' + bg + ')';
    }
  });
})();
