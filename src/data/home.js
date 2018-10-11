import i18n from './../libs/i18n';
export const categories = [
  {
    img: 'https://please-com.imgix.net/static/categories/trips.png',
    label: i18n.t('trips.label'),
    href: '/results?serviceTypes=trip',
  },
  {
    img: 'https://please-com.imgix.net/static/categories/places.png',
    label: i18n.t('places.singular'),
    href: '/results?serviceTypes=place',
  },
  {
    img: 'https://please-com.imgix.net/static/categories/activities.png',
    label: i18n.t('activities.label'),
    href: '/results?serviceTypes=activity',
  },
  {
    img: 'https://please-com.imgix.net/static/categories/food.png',
    label: i18n.t('foods.label'),
    href: '/results?serviceTypes=food',
  },
];

export const tags = [
  { label: 'Cozy', background: '#7bbed6', hoverBg: '#84c5dd' },
  { label: 'Hipster', background: '#82689a', hoverBg: '#9379ab' },
  { label: 'Sporty', background: '#75c1a5', hoverBg: '#76caac' },
  { label: 'Romantic', background: '#ed837f', hoverBg: '#eb8e8a' },
  { label: 'Adventurous', background: '#ffb777', hoverBg: '#ffc089' },
];

export const tripsData = [
  {
    img: 'https://please-com.imgix.net/static/trips/new-york.png',
    title: 'Explore New York',
    excerpt: 'Winter pearl in the heart of Europe and other stuff here.',
    rating: '5',
    reviews: '70',
    price: '230',
  },
  {
    img: 'https://please-com.imgix.net/static/trips/bali.png',
    title: 'Balinese secrets',
    excerpt: 'Winter pearl in the heart.',
    rating: '4',
    reviews: '23',
    price: '1530',
  },
  {
    img: 'https://please-com.imgix.net/static/trips/africa.png',
    title: 'African sunsets',
    excerpt: 'Winter pearl in the heart of Europe.',
    rating: '3',
    reviews: '10',
    price: '430',
  },
  {
    img: 'https://please-com.imgix.net/static/trips/paris.png',
    title: 'French baguettes',
    excerpt: 'Winter pearl in the heart of.',
    rating: '5',
    reviews: '1555',
    price: '50',
  },
  {
    img: 'https://please-com.imgix.net/static/trips/new-york.png',
    title: 'Explore New York 1',
    excerpt: 'Winter pearl in the heart of Europe and other stuff here.',
    rating: '5',
    reviews: '70',
    price: '230',
  },
  {
    img: 'https://please-com.imgix.net/static/trips/bali.png',
    title: 'Balinese secrets 1',
    excerpt: 'Winter pearl in the heart.',
    rating: '4',
    reviews: '23',
    price: '1530',
  },
  {
    img: 'https://please-com.imgix.net/static/trips/africa.png',
    title: 'African sunsets 1',
    excerpt: 'Winter pearl in the heart of Europe.',
    rating: '3',
    reviews: '10',
    price: '430',
  },
];

export const placesData = [
  {
    img: 'https://please-com.imgix.net/static/places/tallinn.png',
    title: 'Tallinn, Estonia',
    excerpt: 'Winter pearl in the heart of Europe and other stuff here.',
    rating: '5',
    reviews: '70',
    price: '230',
  },
  {
    img: 'https://please-com.imgix.net/static/places/tokyo.png',
    title: 'Tokyo, Japan',
    excerpt: 'Winter pearl in the heart.',
    rating: '4',
    reviews: '23',
    price: '1530',
  },
  {
    img: 'https://please-com.imgix.net/static/places/london.png',
    title: 'London, Great Britain',
    excerpt: 'Winter pearl in the heart of Europe.',
    rating: '3',
    reviews: '10',
    price: '430',
  },
  {
    img: 'https://please-com.imgix.net/static/places/firenze.png',
    title: 'Firenze, Italy',
    excerpt: 'Winter pearl in the heart of.',
    rating: '5',
    reviews: '1555',
    price: '50',
  },
];

export const activitiesData = [
  {
    img: 'https://please-com.imgix.net/static/places/tallinn.png',
    title: 'Bungee jumping',
    location: 'Tallinn, Estonia',
    rating: '5',
    reviews: '70',
    price: '230',
  },
  {
    img: 'https://please-com.imgix.net/static/places/tokyo.png',
    title: 'Boat trip',
    location: 'Milano, Italy',
    rating: '4',
    reviews: '23',
    price: '1530',
  },
  {
    img: 'https://please-com.imgix.net/static/places/london.png',
    title: 'Surfing lesson',
    location: 'Tallinn, Estonia',
    rating: '3',
    reviews: '10',
    price: '430',
  },
  {
    img: 'https://please-com.imgix.net/static/places/firenze.png',
    title: 'Diving adventure',
    location: 'Tallinn, Estonia',
    rating: '5',
    reviews: '1555',
    price: '50',
  },
];

export const foodData = [
  {
    img: 'https://please-com.imgix.net/static/food/italian.png',
    title: 'Italian cuisine',
    excerpt: 'Winter pearl in the heart of Europe and other stuff here.',
    rating: '5',
    reviews: '70',
    price: '230',
  },
  {
    img: 'https://please-com.imgix.net/static/food/bbq.png',
    title: 'BBQ dinner outside',
    excerpt: 'Winter pearl in the heart.',
    rating: '4',
    reviews: '23',
    price: '1530',
  },
  {
    img: 'https://please-com.imgix.net/static/food/mexican.png',
    title: 'Mexican stories',
    excerpt: 'Winter pearl in the heart of Europe.',
    rating: '3',
    reviews: '10',
    price: '430',
  },
  {
    img: 'https://please-com.imgix.net/static/food/breakfast.png',
    title: 'Healthy morning',
    excerpt: 'Winter pearl in the heart of.',
    rating: '5',
    reviews: '1555',
    price: '50',
  },
];
