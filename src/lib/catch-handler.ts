import { AxiosError } from "axios";
import { redirect } from "next/navigation";
import { ForbiddenError, UnauthorizedError } from "./bff-instance";

export function CatchHandler(error: AxiosError): AxiosError {
  if (error instanceof UnauthorizedError) {
    redirect("/logout");
  }

  if (error instanceof ForbiddenError) {
    redirect("/");
  }

  return error;
}
