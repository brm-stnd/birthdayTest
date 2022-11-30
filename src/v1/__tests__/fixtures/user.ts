import { Types } from 'mongoose';
import randomstring from 'randomstring';

import { getCurrentUnixTimestamp } from '@utils/datetime';
import { GeneralEnum, IUser, UserEnum, ResponsibilityEnum } from '@definitions';
import { convertEnumToArray } from '@server/utils/object';

export const accessTypes = convertEnumToArray<ResponsibilityEnum.AccessType>(ResponsibilityEnum.AccessType);

export const userInformation = {
  userId: '61cad6a8cb39694efde0a99a',
  name: 'User Name',
  email: 'dummyemail@hzn.one',
};

export const internalId = new Types.ObjectId();
export const customerCompanyId = new Types.ObjectId();

export const constructUserCustomerFields = (type: UserEnum.UserType, customFields = {}): IUser.IDataLean => {
  const { parents, company, individual, ...otherCustomFields } = customFields as any;

  const baseTypeObject = {
    country: {
      id: new Types.ObjectId(),
      name: 'Indonesia',
      code: 'ID',
    },
    province: {
      id: new Types.ObjectId(),
      name: 'Jawa Timur',
    },
    city: {
      id: new Types.ObjectId(),
      name: 'Surabaya',
    },
    postalCode: '12345',
    address: 'jl',
  };

  return {
    _id: new Types.ObjectId(),
    parents: parents || [],
    name: 'First Customer',
    email: `${randomstring.generate({ charset: 'alphabetic', length: 10 })}@customer.com`,
    password: 'password',
    status: GeneralEnum.Status.ACTIVE,
    phone: '081234567891',
    role: UserEnum.Role.CUSTOMER,
    type,
    formattedId: 'CSR0001',
    ...(type === UserEnum.UserType.INDIVIDUAL ? { individual: { ...baseTypeObject, ...individual } } : {}),
    ...(type === UserEnum.UserType.COMPANY
      ? {
          company: {
            ...baseTypeObject,
            name: randomstring.generate({ charset: 'alphabetic', length: 14 }),
            email: 'company@customer.com',
            phone: randomstring.generate({ charset: 'numeric', length: 15 }),
            taxType: UserEnum.TaxType.PKP,
            taxId: randomstring.generate({ charset: 'numeric', length: 16 }),
            businessLicense: '123456789',
            businessLicenseType: UserEnum.BusinessLicenseType.SIUP,
            ...company,
          },
        }
      : {}),
    createdBy: userInformation,
    createdAt: getCurrentUnixTimestamp(),
    ...otherCustomFields,
  };
};

export const constructUserInternalFields = (customFields = {}): IUser.IDataLean => {
  const { ...otherCustomFields } = customFields as any;

  return {
    parents: [],
    name: 'First Admin',
    email: 'internalone@hzn.one',
    password: 'password',
    status: GeneralEnum.Status.ACTIVE,
    phone: '081234567890',
    role: UserEnum.Role.INTERNAL,
    formattedId: 'ADM0001',
    internal: {
      responsibility: new Types.ObjectId(),
    },
    createdBy: userInformation,
    createdAt: getCurrentUnixTimestamp(),
    ...otherCustomFields,
  };
};
