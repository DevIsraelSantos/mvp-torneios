import { getToken } from "next-auth/jwt";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { CustomMiddleware } from "./chain";

const REDIRECT_ROUTES = {
  REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE: "/home",
  REDIRECT_TO_FISRT_PAGE: "/dashboard",
} as const;

const publicRoutes = [
  { path: "/home1", whenAuthenticated: "next" },
  { path: "/home", whenAuthenticated: "redirect" },
] as const;

export function withAuthMiddleware(
  middleware: CustomMiddleware
): CustomMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse
  ) => {
    const path = request.nextUrl.pathname;

    const publicRoute = publicRoutes.find(
      (route) => route.path === path || route.path + "/" === path
    );

    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });
    const isLoggedIn = !!token;

    if (!isLoggedIn && !publicRoute) {
      return NextResponse.redirect(
        new URL(
          REDIRECT_ROUTES.REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE,
          request.url
        )
      );
    }

    if (
      isLoggedIn &&
      publicRoute &&
      publicRoute.whenAuthenticated === "redirect"
    ) {
      return NextResponse.redirect(
        new URL(REDIRECT_ROUTES.REDIRECT_TO_FISRT_PAGE, request.url)
      );
    }

    return middleware(request, event, response);
  };
}
