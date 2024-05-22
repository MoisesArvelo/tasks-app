import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getServerSession } from "next-auth";
import { signOut, useSession } from "next-auth/react";

const request = axios.create({
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "*/*",
  },
  timeout: 20000,
});

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return handleError(error);
  },
);

request.interceptors.response.use(
  async (res) => {
    return res.data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.status === 401) {
      try {
        const refreshAccessToken = await request.get("api/auth/session");

        const session = refreshAccessToken.data.payload;

        originalRequest.headers.Authorization = `Bearer ${session?.user?.account?.access_token}`;
        return request(originalRequest);
      } catch (e) {
        signOut();
      }
    }
    return handleError(error);
  },
);

export const handleError = async (e: AxiosError<any>) => {
  if (e.response) {
    let status: string | number = "";
    let message: string = "";
    let code: string | number = "";

    if (e.response.data && e.response.data.status) {
      status = e.response.data.status;
    } else if (e.response.status) {
      status = e.response.status;
    }

    if (e.response.data && e.response.data.message) {
      if (e.response.data.message === "Error Validation.") {
        message = e.response.data.data[0].message;
      } else {
        message = e.response.data.message;
      }
      code = e.code ?? e.response.status;
    }

    const error = {
      error: e,
      status,
      message,
      code,
    };

    return Promise.reject(error);
  }

  throw e;
};

export default request;
