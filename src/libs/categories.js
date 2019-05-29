import React from 'react';
import Moon from 'shared_components/icons/Moon';
import SilverWare from 'shared_components/icons/SilverWare';
import RunningPerson from 'shared_components/icons/RunningPerson';

const categories = {
  Accommodation: {
    label: 'Accommodation',
    icon: <Moon />,
    color: '#826999',
  },
  Food: {
    label: 'Food',
    icon: <SilverWare />,
    color: '#54B698',
  },
  Activity: {
    label: 'Activity',
    icon: <RunningPerson />,
    color: '#7DA9D4',
  },
};

export const getCategory = category => {
  return categories[category.names['en-us']];
};

export default categories;
