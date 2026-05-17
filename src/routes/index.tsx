import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { getSession } from "@/lib/auth.functions.ts";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LAYOUT_OPTIONS,
  SLIDE_STYLES,
  TONE_OPTIONS,
} from "@/features/presentation/constant/presentation-option";
import { Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PRESENTATION_TEMPLATES } from "@/features/presentation/constant/presentation-template";
import { createPresentation } from "@/features/presentation/action/presentation-mutation";
import { toast } from "sonner";
import { presentationQueryKeys } from "@/features/presentation/hooks/query-keys";

type HomeFormState = {
  content: string;
  slideCount: number;
  style: (typeof SLIDE_STYLES)[number]["value"];
  tone: (typeof TONE_OPTIONS)[number]["value"];
  layout: (typeof LAYOUT_OPTIONS)[number]["value"];
};

export const Route = createFileRoute("/")({
  beforeLoad: async ({ location }) => {
    const session = await getSession();

    if (!session) {
      throw redirect({
        to: "/login",
        search: { redirect: location.href },
      });
    }

    return { user: session.user };
  },

  component: App,
});

export function App() {
  const _context = Route.useRouteContext()
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<HomeFormState>({
    content: "",
    slideCount: 8,
    style: "minimal",
    tone: "formal",
    layout: "balanced",
  });

  const createMut = useMutation({
    mutationFn: () =>
      createPresentation({
        data: {
          prompt: form.content.trim(),
          slideCount: form.slideCount,
          style: form.style,
          tone: form.tone,
          layout: form.layout,
        },
      }),
    onSuccess: (presentation) => {
      toast.success('Presentation created')
      queryClient.invalidateQueries({ queryKey: presentationQueryKeys.list() })
      navigate({
        to: "/presentation/$presentationId",
        params: { presentationId: presentation.id },
      })
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : 'Could not create presentation')
    },
  })

  const handleGenerate = () => {
    if (!form.content.trim()) {
      toast.error('Please enter your content first')
      return
    }
    createMut.mutate()
  };

  return (
    <main className="min-h-screen px-4 pt-24 pb-12">
      <div className="mx-auto max-w-4xl">
        {/* TODO: add presentetation section */}

        {/* header */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-bold md:text-5xl">
            What do you want to{" "}
            <span className="text-gradient-peach">create?</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter your content and we'll generate a beautiful presentation
          </p>
        </div>

        {/* main input card */}
        <div className="glass space-y-6 rounded-3xl p-6 md:p-8">
          {/* textarea */}
          <div className="space-y-2">
            <Textarea
              placeholder="Describe your presentation topic, paste your notes, or outline your key points..."
              value={form.content}
              onChange={(e) =>
                setForm((formData) => ({
                  ...formData,
                  content: e.target.value,
                }))
              }
              className="h-[200px] max-h-[200px] min-h-[200px] resize-none overflow-y-auto rounded-2xl border-border/50 bg-background/50 text-base focus-visible:ring-primary/30"
            />
            <div className="flex justify-between px-1 text-xs text-muted-foreground">
              <span>{form.content.length.toLocaleString()} characters</span>
              <span>Markdown supported</span>
            </div>
          </div>

          {/* Options grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* slide count */}
            <div className="space-y-2.5">
              <label htmlFor="" className="text-sm font-medium">
                Slides: {form.slideCount}
              </label>
              <Slider
                value={[form.slideCount]}
                onValueChange={([v]) =>
                  setForm((formData) => ({ ...formData, slideCount: v }))
                }
                min={3}
                max={20}
                step={1}
                className="py-2"
              />
            </div>

            {/* style */}
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">Style</Label>
              <Select
                value={form.style}
                onValueChange={(value) =>
                  setForm((s) => ({
                    ...s,
                    style: value as HomeFormState["style"],
                  }))
                }
              >
                <SelectTrigger className="rounded-xl border-border/50 bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass">
                  {SLIDE_STYLES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* tone */}
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">Tone</Label>
              <Select
                value={form.tone}
                onValueChange={(value) =>
                  setForm((s) => ({
                    ...s,
                    tone: value as HomeFormState["tone"],
                  }))
                }
              >
                <SelectTrigger className="rounded-xl border-border/50 bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass">
                  {TONE_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* layout */}
            <div className="space-y-2.5">
              <Label className="text-sm font-medium">Layout</Label>
              <Select
                value={form.layout}
                onValueChange={(value) =>
                  setForm((s) => ({
                    ...s,
                    layout: value as HomeFormState["layout"],
                  }))
                }
              >
                <SelectTrigger className="rounded-xl border-border/50 bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass">
                  {LAYOUT_OPTIONS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* generate button */}
            <div className="flex justify-end pt-2">
              <Button
                size="lg"
                onClick={handleGenerate}
                disabled={createMut.isPending || !form.content.trim()}
                className="gap-2 rounded-xl px-8 font-semibold"
              >
                <Wand2 className="size-5" /> Generate PPT
              </Button>
            </div>

            {/* templates */}
            <div className="mt-8">
              <p className="mb-3 text-center text-sm text-muted-foreground">
                Try a template
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {PRESENTATION_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => {
                      setForm({
                        content: template.content,
                        slideCount: template.slides,
                        style: template.style,
                        tone: template.tone,
                        layout: template.layout,
                      });
                    }}
                    className="rounded-full border border-border/50 bg-card/50 px-4 py-2 text-sm text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-foreground"
                  >
                    {template.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
