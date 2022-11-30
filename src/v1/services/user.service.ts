import dayjs from "dayjs";
import { sendCelebrations } from "@utils/sendCelebrations";

import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

import { UserModel } from "@models";
import { IUserController } from "@v1-definitions";

dayjs.extend(utc);
dayjs.extend(timezone);

const UserService = {
  createCustomers: async (
    body: IUserController.IPostCreateUserRequest
  ): Promise<void> => {
    const { firstName, lastName, email, birthdayDate, timezone } = body;

    const dateFormat = dayjs(birthdayDate).format("YYYY-MM-DD");
    const userTimezone = dayjs.tz(`${dateFormat} 09:00:00`, timezone);
    const jakartaTimezone = dayjs.tz(userTimezone, "Asia/Jakarta").toDate();
    const dateFormatIndo = dayjs(birthdayDate).format("YYYY-MM-DD HH:mm");

    console.log(":::userTimezone", userTimezone);
    console.log(":::jakartaTimezone", jakartaTimezone);
    console.log(":::dateFormatIndo", dateFormatIndo);

    await UserModel.create({
      firstName,
      lastName,
      email,
      birthdayDate: jakartaTimezone,
      timezone,
    });
  },
  deleteUser: async (id: string, res): Promise<void> => {
    const user = await UserModel.findById(id, "_id");

    if (!user) res.status(400).json("User not found");

    await UserModel.deleteOne({ _id: id });
  },
  updateUser: async (
    id: string,
    body: IUserController.IPostCreateUserRequest,
    res
  ): Promise<void> => {
    const user = await UserModel.findById(id, "_id");

    if (!user) res.status(400).json("User not found");

    const dateFormat = dayjs(body.birthdayDate).format("YYYY-MM-DD");
    const userTimezone = dayjs.tz(`${dateFormat} 09:00:00`, body.timezone);
    const jakartaTimezone = dayjs.tz(userTimezone, "Asia/Jakarta").toDate();

    user.firstName = body.firstName;
    user.email = body.email;
    user.birthdayDate = jakartaTimezone;
    user.timezone = body.timezone;

    if (body.lastName) {
      user.lastName = body.lastName;
    }

    await user.save();
  },
  birthday: async (page: number, limit: number, res): Promise<void> => {
    console.log(":::page", page);
    console.log(":::limit", limit);

    const currentDate = new Date();
    const date = dayjs(currentDate).format("D");
    const month = dayjs(currentDate).format("M");
    const hour = dayjs(currentDate).format("H");

    const otherDate = await UserModel.aggregate([
      {
        $project: {
          _id: 1,
          month: { $month: "$birthdayDate" },
          date: { $dayOfMonth: "$birthdayDate" },
          hour: { $hour: "$birthdayDate" },
        },
      },
      {
        $match: {
          $or: [
            { date: { $ne: date } },
            { month: { $ne: month } },
            { hour: { $ne: hour } },
          ],
        },
      },
    ]);

    const idList = [];
    otherDate.forEach((user) => {
      idList.push(user._id);
    });

    if (idList.length > 0) {
      await UserModel.updateMany(
        { _id: { $in: idList } },
        { $set: { birthdaySended: false } },
        { multi: true }
      );
    }

    console.log("::date", date);
    console.log("::month", month);
    console.log("::hour", hour);

    console.log(":::idList", idList);

    console.log(":::page", page);
    console.log(":::limit", limit);
    const users = await UserModel.aggregate([
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          month: { $month: "$birthdayDate" },
          date: { $dayOfMonth: "$birthdayDate" },
          hour: { $hour: "$birthdayDate" },
        },
      },
      {
        $match: {
          $and: [{ date: date }, { month: month }, { hour: hour }],
        },
      },
      { $sort: { _id: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    const usersTest = await UserModel.aggregate([
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          month: { $month: "$birthdayDate" },
          date: { $dayOfMonth: "$birthdayDate" },
          hour: { $hour: "$birthdayDate" },
        },
      },
      { $sort: { _id: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);
    console.log(":::usersTest", usersTest);

    if (users.length === 0) res.status(400).json("User not found");

    console.log(":::users", users);

    const successSendedIds = await sendCelebrations(users, "birthday");
    console.log(":::successSendedIds", successSendedIds);
    if (successSendedIds.length > 0) {
      await UserModel.updateMany(
        { _id: { $in: successSendedIds } },
        { $set: { birthdaySended: true } },
        { multi: true }
      );
    }
  },
};

export { UserService };
