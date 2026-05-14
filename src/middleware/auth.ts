import { auth } from "#/lib/auth.ts";
import { AUTH_LOGIN_PATH, isLoginPath, isPublicPath } from "#/lib/auth-paths.ts";
import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";

export const authFnMiddlewar = createMiddleware({type: 'function'}).server(
    async ({next}) => {
        const headers = getRequestHeaders()
        const  session = await auth.api.getSession({ headers })

        if (!session) throw redirect({to: AUTH_LOGIN_PATH });
        return next({ context: {session}})
    }
)

export const authMiddleware = createMiddleware({ type: "request" }).server(
  async ({ request, next }) => {
    const { pathname } = new URL(request.url);
    const headers = getRequestHeaders();

    const session = await auth.api.getSession({ headers });

    if (isLoginPath(pathname) && session) throw redirect({ to: "/" });
    if (isPublicPath(pathname) && )
    // if (isPublicPath(pathname)) return next();
    if (!session) throw redirect({to:AUTH_LOGIN_PATH})

    return next({context: {session}});
  }
);
