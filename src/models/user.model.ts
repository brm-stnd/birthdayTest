import { IUser } from "@definitions";
import { model, Schema } from "mongoose";

const userObject = {
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  birthdayDate: {
    type: Date,
  },
  timezone: {
    type: String,
    required: true,
  },
  birthdaySended: { type: Boolean, default: false, required: true },
};

const userSchema = new Schema(userObject);

const UserModel = model<IUser.IDataSchema>("User", userSchema);

export { UserModel };
