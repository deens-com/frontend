/**
 * Get hero image from service or trip
 */
export function getHeroImage(element) {
  if (!element || !element.media) {
    return null;
  }
  return element.media.find(media => media.hero === true) || element.media[0];
}

/**
 * Get the image url given a `files` object
 */
export function getImageUrlFromFiles(files, key) {
  if (!files) {
    return undefined
  }

  return (files[key] || files.original).url
}

/**
 * Gets the large size image from the media array
 */
export function getImageUrlFromMedia(media, key = 'thumbnail', useHero = false, imageIndex = 0) {
  const element = useHero ? getHeroImage({ media }) : (media && media[imageIndex])
  return getImageUrlFromFiles(element && element.files, 'thumbnail');
}

/**
 * Gets the hero image from the media array
 * @returns {string | undefined}
 */
export function getHeroImageUrlFromMedia(media) {
  const hero = getHeroImage({ media })
  return getImageUrlFromFiles(hero && hero.files, 'hero');
}
