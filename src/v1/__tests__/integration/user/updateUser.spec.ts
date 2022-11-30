import request from "supertest";
import app from "@server/app";
import { Types } from "mongoose";

import { UserModel } from "@models";

describe("User - update user routes", () => {
  describe("PUT /users", () => {
    const endpoint = "/users";

    it("responds with 200 success update user", async () => {
      const userId = new Types.ObjectId();

      await UserModel.create({
        _id: userId,
        firstName: "bram",
        lastName: "dewangga",
        email: "asdf@dafg.com",
        birthdayDate: "1990-11-30",
        timezone: "Australia/Melbourne",
      });

      const requestBody = {
        firstName: "newName",
        lastName: "new last name",
        email: "asdf@dafg.com",
        birthdayDate: "1990-11-30",
        timezone: "Australia/Melbourne",
      };

      const { status, body } = await request(app)
        .put(endpoint + "/" + userId)
        .send(requestBody);

      expect(status).toEqual(200);
      expect(body).toEqual("User Updated");

      const user = await UserModel.findById(userId).lean();
      expect(user.firstName).toEqual(requestBody.firstName);
      expect(user.lastName).toEqual(requestBody.lastName);
      expect(user.email).toEqual(requestBody.email);
      //expect(newUser.birthdayDate).toEqual(requestBody.birthdayDate);
      expect(user.timezone).toEqual(requestBody.timezone);
      expect(user.birthdaySended).toEqual(false);
    });

    it("responds with 400 failed user not found", async () => {
      const userId = "6386baaa1eb692d677be77c3";

      const requestBody = {
        firstName: "newName",
        lastName: "new last name",
        email: "asdf@dafg.com",
        birthdayDate: "1990-11-30",
        timezone: "Australia/Melbourne",
      };

      const { status, body } = await request(app)
        .put(endpoint + "/" + userId)
        .send(requestBody);

      expect(status).toEqual(400);
      expect(body).toEqual("User not found");
    });
  });
});
