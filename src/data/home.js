import { withPrefix } from "gatsby-link";

export const categories = [
  {
    img: withPrefix("/img/categories/trips.png"),
    label: "Trips",
    href: "/trips"
  },
  {
    img: withPrefix("/img/categories/places.png"),
    label: "Places",
    href: "/places"
  },
  {
    img: withPrefix("/img/categories/activities.png"),
    label: "Activities",
    href: "/activites"
  },
  { img: withPrefix("/img/categories/food.png"), label: "Food", href: "/food" }
];

export const tags = [
  { label: "Cozy", background: "#7bbed6", hoverBg: "#84c5dd" },
  { label: "Hipster", background: "#82689a", hoverBg: "#9379ab" },
  { label: "Sporty", background: "#75c1a5", hoverBg: "#76caac" },
  { label: "Romantic", background: "#ed837f", hoverBg: "#eb8e8a" },
  { label: "Adventurous", background: "#ffb777", hoverBg: "#ffc089" }
];

export const tripsData = [
  {
    img: withPrefix("/img/trips/new-york.png"),
    title: "Explore New York",
    excerpt: "Winter pearl in the heart of Europe and other stuff here.",
    rating: "5",
    reviews: "70",
    price: "230"
  },
  {
    img: withPrefix("/img/trips/bali.png"),
    title: "Balinese secrets",
    excerpt: "Winter pearl in the heart.",
    rating: "4",
    reviews: "23",
    price: "1530"
  },
  {
    img: withPrefix("/img/trips/africa.png"),
    title: "African sunsets",
    excerpt: "Winter pearl in the heart of Europe.",
    rating: "3",
    reviews: "10",
    price: "430"
  },
  {
    img: withPrefix("/img/trips/paris.png"),
    title: "French baguettes",
    excerpt: "Winter pearl in the heart of.",
    rating: "5",
    reviews: "1555",
    price: "50"
  },
  {
    img: withPrefix("/img/trips/new-york.png"),
    title: "Explore New York 1",
    excerpt: "Winter pearl in the heart of Europe and other stuff here.",
    rating: "5",
    reviews: "70",
    price: "230"
  },
  {
    img: withPrefix("/img/trips/bali.png"),
    title: "Balinese secrets 1",
    excerpt: "Winter pearl in the heart.",
    rating: "4",
    reviews: "23",
    price: "1530"
  },
  {
    img: withPrefix("/img/trips/africa.png"),
    title: "African sunsets 1",
    excerpt: "Winter pearl in the heart of Europe.",
    rating: "3",
    reviews: "10",
    price: "430"
  }
];

export const placesData = [
  {
    img: withPrefix("/img/places/tallinn.png"),
    title: "Tallinn, Estonia",
    excerpt: "Winter pearl in the heart of Europe and other stuff here.",
    rating: "5",
    reviews: "70",
    price: "230"
  },
  {
    img: withPrefix("/img/places/tokyo.png"),
    title: "Tokyo, Japan",
    excerpt: "Winter pearl in the heart.",
    rating: "4",
    reviews: "23",
    price: "1530"
  },
  {
    img: withPrefix("/img/places/london.png"),
    title: "London, Great Britain",
    excerpt: "Winter pearl in the heart of Europe.",
    rating: "3",
    reviews: "10",
    price: "430"
  },
  {
    img: withPrefix("/img/places/firenze.png"),
    title: "Firenze, Italy",
    excerpt: "Winter pearl in the heart of.",
    rating: "5",
    reviews: "1555",
    price: "50"
  }
];

export const activitiesData = [
  {
    img: withPrefix("/img/places/tallinn.png"),
    title: "Bungee jumping",
    location: "Tallinn, Estonia",
    rating: "5",
    reviews: "70",
    price: "230"
  },
  {
    img: withPrefix("/img/places/tokyo.png"),
    title: "Boat trip",
    location: "Milano, Italy",
    rating: "4",
    reviews: "23",
    price: "1530"
  },
  {
    img: withPrefix("/img/places/london.png"),
    title: "Surfing lesson",
    location: "Tallinn, Estonia",
    rating: "3",
    reviews: "10",
    price: "430"
  },
  {
    img: withPrefix("/img/places/firenze.png"),
    title: "Diving adventure",
    location: "Tallinn, Estonia",
    rating: "5",
    reviews: "1555",
    price: "50"
  }
];

export const foodData = [
  {
    img: withPrefix("/img/food/italian.png"),
    title: "Italian cuisine",
    excerpt: "Winter pearl in the heart of Europe and other stuff here.",
    rating: "5",
    reviews: "70",
    price: "230"
  },
  {
    img: withPrefix("/img/food/bbq.png"),
    title: "BBQ dinner outside",
    excerpt: "Winter pearl in the heart.",
    rating: "4",
    reviews: "23",
    price: "1530"
  },
  {
    img: withPrefix("/img/food/mexican.png"),
    title: "Mexican stories",
    excerpt: "Winter pearl in the heart of Europe.",
    rating: "3",
    reviews: "10",
    price: "430"
  },
  {
    img: withPrefix("/img/food/breakfast.png"),
    title: "Healthy morning",
    excerpt: "Winter pearl in the heart of.",
    rating: "5",
    reviews: "1555",
    price: "50"
  }
];
