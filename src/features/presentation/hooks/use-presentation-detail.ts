import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  SlideLayout,
  SlideStyle,
  SlideTone,
} from "../constant/presentation-option";
import { presentationQueryKeys } from "./query-keys";
import {
  regeneratePresentation,
  deletePresentation,
  updatePresentation,
} from "@/features/presentation/action/presentation-mutation";
import { getPresentationWithSlides } from "../action/presentation-query";

type SettingsForm = {
  title: string;
  prompt: string;
  slideCount: number;
  style: SlideStyle;
  tone: SlideTone;
  layout: SlideLayout;
};

export const usePresentationDetail = (
  presentationId: string,
  opts?: {
    onDelete?: () => void;
  }
) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: presentationQueryKeys.detail(presentationId),
    queryFn: async () =>
      getPresentationWithSlides({ data: { id: presentationId } }),
    refetchInterval: (q) =>
      q.state.data?.status === "GENERATING" ? 3000 : false,
  });

  const [form, setForm] = useState<SettingsForm>({
    title: "",
    prompt: "",
    slideCount: 8,
    style: "minimal",
    tone: "formal",
    layout: "balanced",
  });

  useEffect(() => {
    if (!query.data) return;
    setForm({
      title: query.data.title,
      prompt: query.data.prompt,
      slideCount: query.data.slideCount,
      style: query.data.style as SlideStyle,
      tone: query.data.tone as SlideTone,
      layout: query.data.layout as SlideLayout,
    });
  }, [query.data]);

  const updateMut = useMutation({
    mutationFn: () =>
      updatePresentation({
        data: {
          id: presentationId,
          title: form.title,
          prompt: form.prompt,
          slideCount: form.slideCount,
          style: form.style,
          tone: form.tone,
          layout: form.layout,
        },
      }),
    onSuccess: () => {
      toast.success("Presentation saved");
      queryClient.invalidateQueries({ queryKey: presentationQueryKeys.list() });
      queryClient.invalidateQueries({
        queryKey: presentationQueryKeys.detail(presentationId),
      });
    },
    onError: (e) => {
      toast.error(
        e instanceof Error ? e.message : "Failed to save presentation"
      );
    },
  });

  const regenerateMut = useMutation({
    mutationFn: () => regeneratePresentation({ data: { id: presentationId } }),
    onSuccess: () => {
      toast.success("Regenerating slides...");
      queryClient.invalidateQueries({
        queryKey: presentationQueryKeys.detail(presentationId),
      });
    },
    onError: (e) => {
      toast.error(
        e instanceof Error ? e.message : "Failed to regenerate presentation"
      );
    },
  });

  const deleteMut = useMutation({
    mutationFn: () => deletePresentation({ data: { id: presentationId } }),
    onSuccess: () => {
      toast.success("Presentation deleted");
      queryClient.invalidateQueries({ queryKey: presentationQueryKeys.list() });
      queryClient.removeQueries({
        queryKey: presentationQueryKeys.detail(presentationId),
      });
      opts?.onDelete?.();
    },
    onError: (e) => {
      toast.error(
        e instanceof Error ? e.message : "Failed to delete presentation"
      );
    },
  });

  const slides = query.data?.slides ?? [];
  const isGenerating = query.data?.status === "GENERATING";

  const updatedLabel = useMemo(() => {
    if (!query.data?.updatedAt) return "";
    return new Date(query.data.updatedAt).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }, [query.data?.updatedAt]);

  return {
    query,
    slides,
    isGenerating,
    updatedLabel,
    form,
    setForm,
    updateMut,
    regenerateMut,
    deleteMut,
  };
};
