import I18nText from 'shared_components/I18nText';

export function getServiceJsonLdData(service) {
  const schemaType = getSchemaType(service);
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': schemaType,
    name: I18nText.translate(service.title),
    image: getHeroImage(service),
  };
  if (schemaType === 'Product') structuredData.sku = service._id;
  if (service.description && I18nText.translate(service.description))
    structuredData.description = I18nText.translate(service.description);
  if (service.ratings && service.ratings.count > 0) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: `${service.ratings.average}`,
      ratingCount: `${service.ratings.count}`,
      bestRating: '5',
      worstRating: '0',
    };
  }
  if (service.location && service.location.countryCode) {
    const address = {
      '@type': 'PostalAddress',
      addressCountry: service.location.countryCode,
    };
    if (service.location.city) address.addressLocality = service.location.city;
    if (service.location.state) address.addressRegion = service.location.state;
    if (service.location.postcode) address.postalCode = service.location.postcode;
    structuredData.address = address;
  }
  if (service.location && service.location.geo) {
    structuredData.geo = {
      '@type': 'GeoCoordinates',
      latitude: service.location.geo.coordinates[1],
      longitude: service.location.geo.coordinates[0],
    };
  }
  if (service.tags && service.tags.length > 0 && typeof service.tags[0] === 'object') {
    const serviceTags = service.tags
      .map(tag => {
        if (tag.names) return I18nText.translate(tag.names);
        if (tag.label) return tag.label;
        return '';
      })
      .join(', ');
    if (schemaType === 'Restaurant') structuredData.servesCuisine = serviceTags;
  }
  return structuredData;
}

function getSchemaType(service) {
  const lowerCaseCategory = I18nText.translate(service.categories[0].names).toLowerCase();
  switch (lowerCaseCategory) {
    case 'food':
      return 'Restaurant';
    case 'accommodation':
      return 'Hotel';
    default:
      return 'Product';
  }
}

function getHeroImage(serviceOrTrip) {
  const { media } = serviceOrTrip;
  const heroMediaObject = media.find(m => m.hero);
  if (heroMediaObject) {
    return (
      heroMediaObject.files && heroMediaObject.files.original && heroMediaObject.files.original.url
    );
  }
  return media[0] && media[0].files && media[0].files.original && media[0].files.original.url;
}
