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

export const parseLocationDataAndCoordinates = function(data, lngLat) {
  let res = parseLocationData(data);

  res.geo = {
    coordinates: lngLat,
    type: 'Point',
  };

  return res;
};
