import {
  dateIso,
  object,
  string,
  objectIdString,
  number,
  emailString,
} from "@server/validations";

const userGeneralBody = object({
  firstName: string.required(),
  lastName: string,
  email: emailString.required(),
  birthdayDate: dateIso.required(),
  timezone: string
    .valid("America/New_York", "Australia/Melbourne", "Asia/Jakarta")
    .required(),
});

const UserValidation = {
  createUser: {
    body: userGeneralBody,
  },
  deleteUser: {
    params: object({
      id: objectIdString.required(),
    }),
  },
  updateUser: {
    params: object({
      id: objectIdString.required(),
    }),
    body: userGeneralBody,
  },
  limitations: {
    query: object({
      page: number.required(),
      limit: number.required(),
    }),
  },
};

export { UserValidation };
