export const AUTH_LOGIN_PATH = "/login";
export const AUTH_API_PREFIX = "/api/auth";
export const INNGEST_API_PATH = "/api/inngest";

const PUBLIC_PREFIX = [AUTH_LOGIN_PATH, AUTH_API_PREFIX, INNGEST_API_PATH]

export function isPublicPath(pathname:  string) {
    return PUBLIC_PREFIX.some((p) => pathname.startsWith(p))
}

export function isLoginPath(pathname:string) {
    return pathname.startsWith(AUTH_LOGIN_PATH)
}
