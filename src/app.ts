import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import xss from "xss-clean";
import httpStatus from "http-status";
import compression from "compression";
import { ApiError } from "@hzn-one/commons";
import express, { Application } from "express";

import v1Routes from "@v1-routes";
import { Mongo } from "@config/mongo";
import { errorHandler } from "@middlewares/error";

// load envs, should be at the very beginning of program
dotenv.config();

// connect to mongodb
Mongo.startConnection();

const app: Application = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data,
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

// root
app.get("/", (_, res) => {
  res.send(`Upscalix test`);
});

// v1 api routes
app.use("/", v1Routes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found", true));
});

// handle error
app.use(errorHandler);

export default app;
