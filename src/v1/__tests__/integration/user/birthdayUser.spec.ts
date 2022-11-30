import request from "supertest";
import app from "@server/app";
import dayjs from "dayjs";
import { Types } from "mongoose";

import { UserModel } from "@models";

describe("User - birthday user routes", () => {
  describe("GET /users/birthday", () => {
    const endpoint = "/users/birthday";

    it("responds with 200 success send birthday", async () => {
      await UserModel.create({
        _id: new Types.ObjectId(),
        firstName: "bram",
        lastName: "dewangga",
        email: "asdf@dafg.com",
        birthdayDate: new Date(),
        timezone: "Australia/Melbourne",
      });

      const dateData = new Date();
      const date = dayjs(dateData).format("D");
      const month = dayjs(dateData).format("M");
      const hour = dayjs(dateData).format("H");

      console.log("::date test", date);
      console.log("::month test", month);
      console.log("::hour test", hour);

      const { status, body } = await request(app).get(endpoint).query({
        page: 1,
        limit: 1000,
      });

      expect(status).toEqual(200);
      expect(body).toEqual("Sended birthday");
    });

    /* it("responds with 400 user not found", async () => {
      const { status, body } = await request(app).get(endpoint).query({
        page: 1,
        limit: 1000,
      });

      expect(status).toEqual(400);
      expect(body).toEqual("User not found");
    }); */
  });
});
