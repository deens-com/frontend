import { fitBounds } from 'google-map-react/utils';

export const parseLocationData = data => {
  let res = {};
  const { address_components: addressComponents } = data;
  const localities = addressComponents.filter(
    c => c.types.includes('locality') || c.types.includes('postal_town'),
  );
  const countries = addressComponents.filter(c => c.types.includes('country'));
  const postalCodes = addressComponents.filter(c => c.types.includes('postal_code'));
  const state = addressComponents.filter(c => c.types.includes('"administrative_area_level_1"'))[0];

  res.formattedAddress = data.formatted_address;

  if (countries[0] && countries[0].long_name) {
    res.country = countries[0].long_name;
    res.countryCode = countries[0].short_name;
  }

  if (localities[0] && localities[0].long_name) {
    res.city = localities[0].long_name;
  }

  if (postalCodes[0] && postalCodes[0].long_name) {
    res.postalCode = postalCodes[0].long_name;
  }

  if (state) {
    res.state = state;
  }

  return res;
};

export const getSearchParams = (address, googleMapsResult) => {
  const { address_components: addressComponents, geometry } = googleMapsResult;
  /*const region = getAddressComponent(addressComponents, 'sublocality', 'long_name');
  const establishment = getAddressComponent(addressComponents, 'establishment', 'long_name');
  const poi = getAddressComponent(addressComponents, 'point_of_interest', 'long_name');
  const neighborhood = getAddressComponent(addressComponents, 'neighborhood', 'long_name');*/
  const city = getAddressComponent(addressComponents, 'locality', 'long_name');
  const state = getAddressComponent(addressComponents, 'administrative_area_level_1', 'long_name');
  const countryCode = getAddressComponent(addressComponents, 'country', 'short_name');
  const lat = geometry.location.lat();
  const lng = geometry.location.lng();

  const allUndefined = {
    city: undefined,
    state: undefined,
    countryCode: undefined,
    lat: undefined,
    lng: undefined,
    address: undefined,
  };
  console.log(city);
  if (!addressComponents[0].types.includes('locality') && city) {
    return { ...allUndefined, lat, lng, address };
  } else if (city || state || countryCode) {
    return { ...allUndefined, city, state, countryCode, address };
  } else {
    throw new Error('we should have never reached here');
  }
};

function getAddressComponent(addressComponents, componentName, property) {
  const component = addressComponents.find(component => component.types.includes(componentName));

  if (component && component[property]) {
    return component[property];
  }
  return undefined;
}

export const parseLocationDataAndCoordinates = function(data, lngLat) {
  let res = parseLocationData(data);

  res.geo = {
    coordinates: lngLat,
    type: 'Point',
  };

  return res;
};

const calculateMapBounds = markers => {
  const bounds = new window.google.maps.LatLngBounds();
  for (const marker of markers) {
    bounds.extend(new window.google.maps.LatLng(marker.lat, marker.lng));
  }
  return {
    ne: { lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng() },
    sw: { lat: bounds.getSouthWest().lat(), lng: bounds.getSouthWest().lng() },
  };
};

const defaultCenterMap = {
  lat: 45.4509449,
  lng: 4.9449656,
};

export const getCenterAndZoom = (
  markers,
  defaultCenter = defaultCenterMap,
  defaultZoom = 14,
  size = { width: 400, height: 800 },
) => {
  if (!markers.length) {
    return { center: defaultCenter, zoom: defaultZoom };
  }
  if (markers.length === 1) {
    return { center: markers[0], zoom: defaultZoom };
  }
  const bounds = calculateMapBounds(markers);
  const { center, zoom } = fitBounds(bounds, size);

  // if we zoom more than 14, it's too much zoomed into a really small location
  return { center, zoom: Math.min(zoom, 14) };
};
