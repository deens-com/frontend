import { schema } from 'normalizr';

const idAttribute = '_id';

export const user = new schema.Entity('users', {}, { idAttribute });

export const tag = new schema.Entity('tags', {}, { idAttribute });

export const service = new schema.Entity(
  'services',
  {
    owner: user,
    tags: [tag],
  },
  { idAttribute },
);

export const selectedOption = new schema.Entity(
  'selectedOptions',
  {},
  { idAttribute: 'availabilityCode' },
);

export const inDayService = new schema.Entity(
  'inDayServices',
  {
    service,
    selectedOption,
  },
  { idAttribute },
);

export const tripTransport = new schema.Entity(
  'tripTransports',
  {},
  {
    idAttribute: value => {
      return (
        `${value.toServiceOrgId || value.toServiceOrganizationId}` ||
        `last:${value.fromServiceOrgId || value.fromServiceOrganizationId}`
      );
    },
  },
);

export const trip = new schema.Entity(
  'trips',
  {
    services: [inDayService],
    tags: [tag],
  },
  { idAttribute },
);
