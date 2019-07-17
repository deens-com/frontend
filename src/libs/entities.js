import { schema } from 'normalizr';

const idAttribute = '_id';

export const user = new schema.Entity('users', {}, { idAttribute });

export const tag = new schema.Entity('tags', {}, { idAttribute });

export const availability = new schema.Entity(
  'availabilities',
  {},
  { idAttribute: 'serviceOrganizationId' },
);

export const service = new schema.Entity(
  'services',
  {
    owner: user,
    tags: [tag],
  },
  { idAttribute },
);

export const inDayService = new schema.Entity(
  'inDayServices',
  {
    service,
  },
  { idAttribute },
);

export const tripTransport = new schema.Entity(
  'tripTransports',
  {},
  { idAttribute: value => `${value.fromServiceOrgId}-${value.toServiceOrgId}` },
);

export const trip = new schema.Entity(
  'trips',
  {
    services: [inDayService],
    transports: [tripTransport],
    tags: [tag],
  },
  { idAttribute },
);
