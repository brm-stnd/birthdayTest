import dayjs from "dayjs";
import { sendCelebrations } from "@utils/sendCelebrations";

import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

import { UserModel } from "@models";
import { IUserController } from "@v1-definitions";

dayjs.extend(utc);
dayjs.extend(timezone);

const UserService = {
  createUser: async (
    body: IUserController.IPostCreateUserRequest
  ): Promise<void> => {
    const { firstName, lastName, email, birthdayDate, timezone } = body;

    const dateFormat = dayjs(birthdayDate).format("YYYY-MM-DD");
    const userTimezone = dayjs.tz(`${dateFormat} 09:00:00`, timezone);

    await UserModel.create({
      firstName,
      lastName,
      email,
      birthdayDate: userTimezone,
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
    const userTimezone = dayjs
      .tz(`${dateFormat} 09:00:00`, body.timezone)
      .toDate();

    user.firstName = body.firstName;
    user.email = body.email;
    user.birthdayDate = userTimezone;
    user.timezone = body.timezone;

    if (body.lastName) {
      user.lastName = body.lastName;
    }

    await user.save();
  },
  birthday: async (page: number, limit: number, res): Promise<void> => {
    const currentDate = new Date();
    const date = dayjs(currentDate).format("DD").toString();
    const month = dayjs(currentDate).format("MM").toString();
    const hour = dayjs(currentDate).format("HH").toString();
    console.log(":::date", date);
    console.log(":::month", month);
    console.log(":::hour", hour);

    const otherDate = await UserModel.aggregate([
      {
        $project: {
          _id: 1,
          month: {
            $dateToString: {
              format: "%m",
              date: "$birthdayDate",
              timezone: "Asia/Jakarta",
            },
          },
          date: {
            $dateToString: {
              format: "%d",
              date: "$birthdayDate",
              timezone: "Asia/Jakarta",
            },
          },
        },
      },
      {
        $match: {
          $and: [{ date: { $ne: date } }, { month: { $ne: month } }],
        },
      },
    ]);

    console.log(":::otherDate", otherDate);

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

    const users = await UserModel.aggregate([
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          email: 1,
          birthdaySended: 1,
          month: {
            $dateToString: {
              format: "%m",
              date: "$birthdayDate",
              timezone: "Asia/Jakarta",
            },
          },
          date: {
            $dateToString: {
              format: "%d",
              date: "$birthdayDate",
              timezone: "Asia/Jakarta",
            },
          },
          hour: {
            $dateToString: {
              format: "%H",
              date: "$birthdayDate",
              timezone: "Asia/Jakarta",
            },
          },
        },
      },
      {
        $match: {
          $and: [
            { date: date },
            { month: month },
            { hour: hour },
            { birthdaySended: false },
          ],
        },
      },
      { $sort: { _id: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    console.log("::users", users);

    if (users.length === 0) res.status(400).json("User not found");

    const successSendedIds = await sendCelebrations(users, "birthday");
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
