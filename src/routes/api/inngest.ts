import { createFileRoute } from '@tanstack/react-router'
import { serve } from "inngest/edge";
import { inngest } from "@/integrations/inngest/client";
import { helloWorld } from '@/integrations/inngest/function';

const handler = serve({
  client: inngest,
  functions: [helloWorld],
});

export const Route = createFileRoute("/api/inngest")({
  server: {
    handlers: {
      GET: async ({ request }) => handler(request),
      POST: async ({ request }) => handler(request),
      PUT: async ({ request }) => handler(request),
    },
  },
});
