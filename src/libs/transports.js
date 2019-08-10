import Walk from 'assets/walk.svg';
import Bike from 'assets/bike.svg';
import Car from 'assets/car.svg';
import Train from 'assets/train.svg';
import SadFace from 'assets/sad-face.svg';

export function getIconAndTextFromTransport(data) {
  const notFound = { text: 'Oops! We could not find a route', icon: SadFace };

  if (!data || !data.route) {
    return notFound;
  }

  switch (data.route.transportMode) {
    case 'walking':
      return { text: 'Walk', icon: Walk };
    case 'car':
      return { text: 'Drive your car', icon: Car };
    case 'bicycle':
      return { text: 'Ride a bike', icon: Bike };
    case 'public-transit':
      return { text: 'Public transport', icon: Train };
    default:
      return notFound;
  }
}

export const renderTime = time => {
  if (!time) {
    return null;
  }

  if (time.hours) {
    return `${time.hours}h ${time.minutes}mn`;
  }

  return `${time.minutes}mn`;
};
