import request from "supertest";
import app from "@server/app";

import { UserModel } from "@models";

describe("User - create user routes", () => {
  describe("POST /users", () => {
    const endpoint = "/users";

    it("responds with 200 success create user", async () => {
      const requestBody = {
        firstName: "bram",
        lastName: "dewangga",
        email: "asdf@dafg.com",
        birthdayDate: "1990-11-30",
        timezone: "Australia/Melbourne",
      };

      const { status, body } = await request(app)
        .post(endpoint)
        .send(requestBody);

      expect(status).toEqual(201);
      expect(body).toEqual("User Created");

      const newUser = await UserModel.findOne({
        email: requestBody.email,
      }).lean();

      expect(newUser.firstName).toEqual(requestBody.firstName);
      expect(newUser.lastName).toEqual(requestBody.lastName);
      expect(newUser.email).toEqual(requestBody.email);
      //expect(newUser.birthdayDate).toEqual(requestBody.birthdayDate);
      expect(newUser.timezone).toEqual(requestBody.timezone);
      expect(newUser.birthdaySended).toEqual(false);
    });

    it("responds with 400 - failed a required field doesn't exist", async () => {
      const requestBody = {
        lastName: "dewangga",
        email: "asdf@dafg.com",
        birthdayDate: "1990-11-30",
        timezone: "Australia/Melbourne",
      };

      const { status, body } = await request(app)
        .post(endpoint)
        .send(requestBody);

      expect(status).toEqual(400);
      expect(body).toEqual(expect.any(Object));
      expect(body.meta).toEqual(expect.any(Object));

      expect(body.meta.status).toEqual("failed");
      expect(body.meta.message).toEqual('"firstName" is required');
    });

    it("responds with 400 - failed false email format", async () => {
      const requestBody = {
        firstName: "bram",
        lastName: "dewangga",
        email: "asdf@dafg",
        birthdayDate: "1990-11-30",
        timezone: "Australia/Melbourne",
      };

      const { status, body } = await request(app)
        .post(endpoint)
        .send(requestBody);

      expect(status).toEqual(400);
      expect(body).toEqual(expect.any(Object));
      expect(body.meta).toEqual(expect.any(Object));

      expect(body.meta.status).toEqual("failed");
      expect(body.meta.message).toEqual('"email" must be a valid email');
    });
  });
});
