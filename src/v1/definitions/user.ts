export enum timezone {
  "America/New_York" = "America/New_York",
  "Australia/Melbourne" = "Australia/Melbourne",
  "Asia/Jakarta" = "Asia/Jakarta",
}

declare namespace IUserController {
  interface IPostCreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    birthdayDate: Date;
    timezone: timezone;
  }
}

export { IUserController };
