import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super("Forbidden");
    this.name = "ForbiddenError";
  }
}

const getCookies = async () => {
  if (typeof window === "undefined") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { cookies } = require("next/headers");
    return (
      (await cookies())
        .getAll()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((cookie: any) => `${cookie.name}=${cookie.value}`)
        .join("; ")
    );
  } else {
    return document.cookie;
  }
};

function setupAPIClient() {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 30000,
    withCredentials: true,
  });

  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const cookieHeader = await getCookies();

      if (cookieHeader) {
        config.headers["Cookie"] = cookieHeader;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        throw new UnauthorizedError();
      }
      if (error.response?.status === 403) {
        throw new ForbiddenError();
      }

      return Promise.reject(error);
    }
  );

  return api;
}

export const bff = setupAPIClient();
