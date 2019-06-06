import { formatYYYYMMDD } from 'libs/Utils';
import I18nText from 'shared_components/I18nText';

export function getServiceJsonLdData(service, canonicalUrl) {
  const category = I18nText.translate(service.categories[0].names);
  switch (category) {
    case 'Accommodation':
      return getAccommodationJsonLd(service);
    case 'Food':
      return getFoodJsonLd(service);
    case 'Activity':
      return getActivityJsonLd(service, canonicalUrl);
    default:
      throw new Error('invalid category');
  }
}

function getAccommodationJsonLd(service) {
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Hotel',
    name: I18nText.translate(service.title),
    image: getHeroImage(service),
  };
  if (service.description && I18nText.translate(service.description))
    structuredData.description = I18nText.translate(service.description);
  injectRatings(service, structuredData);
  injectGeoCoordinates(service.originalLocation, structuredData);
  injectServiceAddress(service, structuredData);
  return structuredData;
}

function getFoodJsonLd(service) {
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Restaurant',
    name: I18nText.translate(service.title),
    image: getHeroImage(service),
  };
  if (service.description && I18nText.translate(service.description))
    structuredData.description = I18nText.translate(service.description);
  injectRatings(service, structuredData);
  injectGeoCoordinates(service.originalLocation, structuredData);
  injectServiceAddress(service, structuredData);
  injectTelephone(service, structuredData);

  if (service.tags && service.tags.length > 0 && typeof service.tags[0] === 'object') {
    const serviceTags = service.tags
      .map(tag => {
        if (tag.names) return I18nText.translate(tag.names);
        if (tag.label) return tag.label;
        return '';
      })
      .join(', ');
    structuredData.servesCuisine = serviceTags;
  }
  return structuredData;
}

function getActivityJsonLd(service, canonicalUrl) {
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: I18nText.translate(service.title),
    image: getHeroImage(service),
    sku: service._id,
    mpn: service._id,
    brand: {
      '@type': 'Thing',
      name: 'Deens.com',
    },
  };
  if (service.description && I18nText.translate(service.description))
    structuredData.description = I18nText.translate(service.description);
  injectRatings(service, structuredData);
  structuredData.offers = {
    '@type': 'Offer',
    url: canonicalUrl,
    price: service.basePrice,
    priceCurrency: 'USD',
    priceValidUntil: getPriceValidUntil(),
    availability: 'http://schema.org/InStock',
  };
  return structuredData;
}

export function getTripJsonLdData(trip, canonicalUrl) {
  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: I18nText.translate(trip.title),
    image: getHeroImage(trip),
    sku: trip._id,
    mpn: trip._id,
    brand: {
      '@type': 'Thing',
      name: 'Deens.com',
    },
  };
  if (trip.description && I18nText.translate(trip.description))
    structuredData.description = I18nText.translate(trip.description);
  injectRatings(trip, structuredData);

  // get price per day
  let pricePerDay = trip.totalPricePerDay;
  if (trip.pricing && trip.pricing.length > 0) {
    const pricingElement = trip.pricing.find(
      ({ adults, children }) => adults === 2 && children === 0,
    );
    if (pricingElement) pricePerDay = pricingElement.pricePerDay;
  }
  structuredData.offers = {
    '@type': 'Offer',
    url: canonicalUrl,
    price: pricePerDay,
    priceCurrency: 'USD',
    priceValidUntil: getPriceValidUntil(),
    availability: 'http://schema.org/InStock',
  };

  return structuredData;
}

function injectRatings(serviceOrTrip, structuredData) {
  if (serviceOrTrip.ratings && serviceOrTrip.ratings.count > 0) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: `${serviceOrTrip.ratings.average}`,
      ratingCount: `${serviceOrTrip.ratings.count}`,
      bestRating: '5',
      worstRating: '0',
    };
  }
}

function injectServiceAddress(service, structuredData) {
  const address = {
    '@type': 'PostalAddress',
    addressCountry: service.countryCode,
  };
  if (service.city) address.addressLocality = service.city;
  if (service.state) address.addressRegion = service.state;
  if (service.postcode) address.postalCode = service.postcode;
  structuredData.address = address;
}

function injectGeoCoordinates(location, structuredData) {
  if (location && location.geo) {
    structuredData.geo = {
      '@type': 'GeoCoordinates',
      latitude: location.geo.coordinates[1],
      longitude: location.geo.coordinates[0],
    };
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

function getPriceValidUntil() {
  const thirtyDaysInMillis = 2592000000;
  const monthFromNow = new Date(Date.now() + thirtyDaysInMillis);
  return monthFromNow.toISOString();
}

function injectTelephone(service, structuredData) {
  if (service.telephones && service.telephones[0] && service.telephones[0].displayNumber) {
    structuredData.telephone = service.telephones[0].displayNumber;
  }
}
