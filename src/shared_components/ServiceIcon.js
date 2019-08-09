import React from 'react';
import Activity from 'shared_components/icons/RunningPerson';
import Food from 'shared_components/icons/SilverWare';
import Accommodation from 'shared_components/icons/Bed';
import { activity, food, accommodation } from 'libs/colors';

export default ({ type, style }) => {
  if (type === 'food') {
    return <Food style={{ color: food, ...style }} />;
  }
  if (type === 'accommodation') {
    return <Accommodation style={{ color: accommodation, ...style }} />;
  }

  return <Activity style={{ color: activity, ...style }} />;
};
