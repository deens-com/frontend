import React, { useState, useEffect } from 'react';
import { getFirstCategoryLowerCase } from 'libs/categories';
import Accommodation from './Accommodation';
import Service from './Service';

export default ({ serviceOrg, services, serviceNumber }) => {
  const type = getFirstCategoryLowerCase(services[serviceOrg.service].categories);
  return type === 'accommodation' ? (
    <Accommodation services={services} serviceNumber={serviceNumber} serviceOrg={serviceOrg} />
  ) : (
    <Service services={services} serviceNumber={serviceNumber} serviceOrg={serviceOrg} />
  );
};
