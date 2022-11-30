import { Document } from "mongoose";

declare namespace IUser {
  interface IData {
    firstName: string;
    lastName: string;
    email: string;
    birthdaySended: boolean;
    birthdayDate: Date;
    timezone: string;
  }

  interface IDataSchema extends IData, Document {}
}

export { IUser };
