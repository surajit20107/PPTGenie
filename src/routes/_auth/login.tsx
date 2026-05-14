import { LoginForm } from "@/components/auth/LoginForm";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { z } from "zod";
export const Route = createFileRoute("/_auth/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: Login,
});

export function Login() {
  const { redirect } = Route.useSearch();
  return (
    <div className="items-center-justify-center p-4k flex min-h-screen">
      <div className="w-full max-w-md">
        <div className="glass space-y-6 rounded-3xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <Link to="/" className="no-underline">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary">
                {/* <Presentation className="size-8 text-primary-foreground" /> */}
              </div>
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold">
                Welcome to <span className="text-primary">PPT.ai</span>
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Sign in to create beautiful presentations
              </p>
            </div>
          </div>

          {/* Login form */}
          <LoginForm redirectTo={redirect} />
        </div>
      </div>
    </div>
  );
}
