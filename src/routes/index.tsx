import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "#/lib/auth.functions.ts";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ location }) => {
    const session = await getSession();

    if (!session) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }

    return { user: session.user }
  },

  component: App
});

export function App() {
  return (
    <main className="min-h-screen px-4 pt-24 pb-12">
      <div className="mx-auto max-w-4xl">
        <h1>hello</h1>
      </div>
    </main>
  );
}
