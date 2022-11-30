import { generateToken } from '@utils/jwt';
import { UserEnum, ResponsibilityEnum } from '@definitions';
import { internalId, customerCompanyId } from './user';
import { convertEnumToArray } from '@server/utils/object';

export const accessTypes = convertEnumToArray<ResponsibilityEnum.AccessType>(ResponsibilityEnum.AccessType);

const internalToken = generateToken({
  userId: internalId.toString(),
  email: 'sample@internal.com',
  name: 'Internal A',
  formattedId: 'ADM0001',
  role: UserEnum.Role.INTERNAL,
  type: null,
  accessTypes: accessTypes,
});

export const companyCustomerTokenData = {
  userId: customerCompanyId.toString(),
  email: 'customer@internal.com',
  name: 'Customer A',
  formattedId: 'CSR9001',
  role: UserEnum.Role.CUSTOMER,
  type: UserEnum.UserType.COMPANY,
  accessTypes: [],
};

const companyCustomerToken = generateToken(companyCustomerTokenData);

export const Auth = {
  adminAuthHeader: function () {
    return {
      'x-api-key': `Bearer ${internalToken}`,
    };
  },
  customerCompanyAuthHeader: function () {
    return {
      'x-api-key': `Bearer ${companyCustomerToken}`,
    };
  },
};
