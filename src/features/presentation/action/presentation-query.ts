import { createServerFn } from "@tanstack/react-start";
import { presentationIdInputSchema } from "../types/schema";
import { prisma } from "@/lib/db";
import { authFnMiddleware } from "@/middleware/auth";

export const getPresentationWithSlides = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => presentationIdInputSchema.parse(data))
  .middleware([authFnMiddleware])
  .handler(async ({ data, context }) => {
    const userId = context.session.user.id;
    const row = await prisma.presentation.findFirst({
      where: {
        id: data.id,
        userId,
      },
      include: {
        slides: {
            orderBy: { order: "asc" },
        }
      }
    });

    if (!row) {
        throw new Error("Presentation not found");
    }

    return row;
  });
