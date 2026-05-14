import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "#/lib/auth-client.ts";

export const Route = createFileRoute("/")({ component: App });

export function App() {
  const { data } = authClient.useSession()
  console.log(data);
  
  return (
    <div>
      {data?.user.name}
    </div>
  )
}
