import { IContact } from '@hzn-one/commons';
import { faker } from '@faker-js/faker';
import { IDeliveryPartnerIntegrator } from '@server/definitions';

export function constructAddressFields(
  customFields: Partial<IDeliveryPartnerIntegrator.IOrderAddress> = {},
): IDeliveryPartnerIntegrator.IOrderAddress {
  const { coordinate, ...otherCustomFields } = customFields;

  return {
    address: faker.address.streetAddress(true),
    coordinate: {
      latitude: +faker.address.latitude(),
      longitude: +faker.address.longitude(),
      ...coordinate,
    },
    village: 'Curug Sangereng',
    district: 'Kec. Klp. Dua',
    city: faker.address.city(),
    province: faker.address.state(),
    postalCode: faker.address.zipCode('#####'),
    keywords: faker.address.buildingNumber(),
    ...otherCustomFields,
  };
}

export function constructContactFields(customFields: Partial<IContact> = {}): IContact {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number('###############'),
    instruction: '',
    ...customFields,
  };
}
