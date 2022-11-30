import { ApiError } from "@hzn-one/commons";
import axios from "axios";
import config from "./config";

const request = (baseUrl: string, additionalHeaders = {}) => {
  const create = axios.create({
    baseURL: baseUrl,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...additionalHeaders,
    },
  });

  create.defaults.timeout = 10000;

  create.interceptors.request.use((req) => {
    if (config.APP_ENV !== "production") {
      const { method, url, params, data } = req;
      console.info({ method, url, params, data });
    }
    return req;
  });

  create.interceptors.response.use(
    (res) => {
      if (config.APP_ENV !== "production") {
        const { status, statusText, data } = res;
        console.info({ status, statusText, data });
      }
      return res;
    },
    (error) => {
      if (error.response) {
        const errorMessage =
          error.response.data?.meta?.message ||
          error.response.message ||
          "error undefined";
        throw new ApiError(error.response.status, errorMessage, true);
      }
      throw error;
    }
  );

  return create;
};

export default request;
