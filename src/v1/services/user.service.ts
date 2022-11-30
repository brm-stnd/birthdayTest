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

    console.log(":::userTimezone", userTimezone);

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
    console.log(":::page", page);
    console.log(":::limit", limit);

    const currentDate = new Date();
    const date = dayjs(currentDate).format("DD").toString();
    const month = dayjs(currentDate).format("MM").toString();
    const hour = dayjs(currentDate).format("HH").toString();

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
          $or: [
            { date: { $ne: date } },
            { month: { $ne: month } },
            { hour: { $ne: hour } },
          ],
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

    console.log(
      ":::filter",
      JSON.stringify({
        $match: {
          $and: [
            { date: date },
            { month: month },
            { hour: hour },
            { birthdaySended: false },
          ],
        },
      })
    );

    /* const usersTest = await UserModel.aggregate([
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
    console.log(":::usersTest", usersTest); */

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
