/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export type ApiResponse<T> = { data: T; status: number } | undefined;

export class HttpResponse {
  public static Success<T>(data: T): NextResponse {
    return NextResponse.json(data, {
      status: 200,
    });
  }

  public static Created<T>(data: T): NextResponse {
    return NextResponse.json(data, { status: 201 });
  }

  public static BadRequest({ message }: { message: string }): NextResponse {
    return NextResponse.json({ message }, { status: 400 });
  }

  public static Unauthorized({ message }: { message?: string }): NextResponse {
    return NextResponse.json(
      message ? { message } : { code: "token_not_valid" },
      {
        status: 401,
      }
    );
  }

  public static Forbidden({ message }: { message: string }): NextResponse {
    return NextResponse.json({ message }, { status: 403 });
  }

  public static NotFound({ message }: { message: string }): NextResponse {
    return NextResponse.json({ message }, { status: 404 });
  }

  public static InternalServerError = (data?: any) => {
    console.error("InternalServerError", data);
    return NextResponse.json("Ops...", { status: 500 });
  };

  public static handleErrorMessage = ({
    response,
  }: { response: { data: any; status: number } } | any) => {
    if (!response) {
      return HttpResponse.InternalServerError();
    }

    if (response.status === 401) {
      return HttpResponse.Unauthorized({});
    }

    if (response.status === 400) {
      return HttpResponse.BadRequest({ message: response.data });
    }

    if (response.status === 403) {
      return HttpResponse.Forbidden({ message: response.data });
    }

    return HttpResponse.InternalServerError({ message: response.data });
  };
}
