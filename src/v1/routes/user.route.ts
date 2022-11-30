import express from "express";
import { UserController } from "@v1-controllers";

import validate from "@middlewares/validate";
import { UserValidation } from "@v1-validations";

const router = express.Router();

router
  .route("/")
  .post(
    validate(UserValidation.createUser),
    UserController.postRegistrationsCustomers
  );

router
  .route("/:id")
  .delete(validate(UserValidation.deleteUser), UserController.deleteUser);

router
  .route("/:id")
  .put(validate(UserValidation.updateUser), UserController.updateUser);

router
  .route("/birthday")
  .get(validate(UserValidation.limitations), UserController.birthday);

export default router;
