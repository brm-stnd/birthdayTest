import { Request, Response, NextFunction } from "express";
import { UserService } from "@v1-services";
import { IGeneral } from "@definitions";
import { IUserController } from "@v1-definitions";

const UserController = {
  postRegistrationsCustomers: async (
    req: Request<null, unknown, IUserController.IPostCreateUserRequest>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await UserService.createCustomers(req.body);

      res.status(201).json("User Created");
    } catch (error) {
      next(error);
    }
  },
  deleteUser: async (
    req: Request<IGeneral.IIdParam, null, null>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id, res);

      res.status(200).json("User Deleted");
    } catch (error) {
      next(error);
    }
  },
  updateUser: async (
    req: Request<
      IGeneral.IIdParam,
      null,
      IUserController.IPostCreateUserRequest
    >,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      await UserService.updateUser(id, req.body, res);

      res.status(200).json("User Updated");
    } catch (error) {
      next(error);
    }
  },
  birthday: async (
    req: Request<IGeneral.IPagination, null, null>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, limit } = req.query;
      await UserService.birthday(+page, +limit, res);

      res.status(200).json("Sended birthday");
    } catch (error) {
      next(error);
    }
  },
};

export { UserController };
