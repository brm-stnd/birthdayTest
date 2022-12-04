import nock from "nock";
import config from "@config/config";
import request from "supertest";
import app from "@server/app";
import { Types } from "mongoose";

import { UserModel } from "@models";

describe("User - birthday user routes", () => {
  describe("GET /users/birthday", () => {
    const endpoint = "/users/birthday";

    beforeAll(() => {
      nock.disableNetConnect();
      nock.enableNetConnect("127.0.0.1");
    });

    afterAll(() => {
      nock.enableNetConnect();
    });

    it("responds with 200 success send birthday", async () => {
      await UserModel.create({
        _id: new Types.ObjectId(),
        firstName: "one",
        lastName: "test",
        email: "asdf@dafg.com",
        birthdayDate: new Date(1995, 10, 10),
        timezone: "Asia/Jakarta",
      });

      const today = new Date();
      await UserModel.create({
        _id: new Types.ObjectId(),
        firstName: "bram",
        lastName: "dewangga",
        email: "asdf@dafg.com",
        birthdayDate: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          17,
          0,
          0
        ),
        timezone: "Asia/Jakarta",
      });

      const usersAll = await UserModel.find({});
      console.log(":::usersAll", usersAll);

      nock(config.EMAIL_SERVICE_URI)
        .post("/send-email")
        .reply(200, { status: "sent", sentTime: "2022-11-30T16:18:47.722Z" });

      const { status, body } = await request(app).get(endpoint).query({
        page: 1,
        limit: 1000,
      });

      expect(status).toEqual(200);
      expect(body).toEqual("Sended birthday");
    });

    it("responds with 400 user not found", async () => {
      const { status, body } = await request(app).get(endpoint).query({
        page: 1,
        limit: 1000,
      });

      expect(status).toEqual(400);
      expect(body).toEqual("User not found");
    });
  });
});
