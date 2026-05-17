import { createServerFn } from "@tanstack/react-start";
import { createPresentationInputSchema, presentationIdInputSchema } from "../types/schema";
import { authFnMiddleware } from "@/middleware/auth";
import { prisma } from "@/lib/db";
import { generateSlug } from "random-word-slugs";
import { PresentationStatus } from "../../../../generated/prisma/enums";
import { inngest } from "@/integrations/inngest/client";

export const createPresentation = createServerFn({ method: 'POST' })
    .inputValidator((data: unknown) => createPresentationInputSchema.parse(data))
    .middleware([authFnMiddleware])
    .handler(async ({ data, context }) => {
        const userId = context.session.user.id;
        const presentation = await prisma.presentation.create({
            data: {
                userId,
                title: generateSlug(),
                prompt: data.prompt,
                slideCount: data.slideCount,
                style: data.style,
                tone: data.tone,
                layout: data.layout,
                status: PresentationStatus.GENERATING,
            }
        })

        // inngest background job to generate presentation
        await inngest.send({
            name: 'presentation/generate',
            data:{presentationId: presentation.id}
        })

        return presentation;
    })

export const updatePresentation = createServerFn({ method: 'POST' })
    .inputValidator((data: unknown) => presentationIdInputSchema.parse(data))
    .middleware([authFnMiddleware])
    .handler(async ({ data, context }) => {
        const userId = context.session.user.id;
        const { id, ...patch } = data;

        const existing = await prisma.presentation.findFirst({
            where: { id, userId }
        })

        if (!existing) throw new Error('Presentation not found');
        const updateData = patch

        return prisma.presentation.update({
            where: { id },
            data: updateData,
        })
    })

export const deletePresentation = createServerFn({ method: 'POST' })
    .inputValidator((data: unknown) => presentationIdInputSchema.parse(data))
    .middleware([authFnMiddleware])
    .handler(async ({ data, context }) => {
        const userId = context.session.user.id;

        const existing = await prisma.presentation.findFirst({
            where: { id: data.id, userId }
        })

        if (!existing) throw new Error('Presentation not found');

        await prisma.presentation.delete({
            where: { id: data.id },
        })

        return { success: true as const };
    })


export const regeneratePresentation = createServerFn({ method: 'POST' })
    .inputValidator((data: unknown) => presentationIdInputSchema.parse(data))
    .middleware([authFnMiddleware])
    .handler(async ({ data, context }) => {
        const userId = context.session.user.id;
        const existing = await prisma.presentation.findFirst({
            where: { id: data.id, userId }
        })

        if (!existing) throw new Error('Presentation Not Found');

        await prisma.presentation.update({
            where: { id: data.id },
            data: {
                status: PresentationStatus.GENERATING,
            }
        })

        // inngest background job to generate presentation
        await inngest.send({
            name: 'presentation/generate',
            data:{presentationId: existing.id}
        })

        return { success: true as const };
    })
