import request from "supertest";
import app from "@server/app";
import { Types } from "mongoose";

import { UserModel } from "@models";

describe("User - delete user routes", () => {
  describe("DELETE /users", () => {
    const endpoint = "/users";

    it("responds with 200 success delete user", async () => {
      const userId = new Types.ObjectId();

      await UserModel.create({
        _id: userId,
        firstName: "bram",
        lastName: "dewangga",
        email: "asdf@dafg.com",
        birthdayDate: "1990-11-30",
        timezone: "Australia/Melbourne",
      });

      const { status, body } = await request(app).delete(
        endpoint + "/" + userId
      );

      expect(status).toEqual(200);
      expect(body).toEqual("User Deleted");

      const user = await UserModel.findById(userId).lean();
      expect(user).toEqual(null);
    });

    it("responds with 400 failed delete user", async () => {
      const userId = "6386baaa1eb692d677be77c3";

      const { status, body } = await request(app).delete(
        endpoint + "/" + userId
      );

      expect(status).toEqual(400);
      expect(body).toEqual("User not found");
    });
  });
});
