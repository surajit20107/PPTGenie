import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { usePresentationDetail } from "@/features/presentation/hooks/use-presentation-detail";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Play, RefreshCw } from "lucide-react";
import { GenerationStatus } from "@/components/generation-status";
import { presentationThumbnailUrl } from "@/features/presentation/utils/thumbnail-url";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LAYOUT_OPTIONS, SLIDE_STYLES, TONE_OPTIONS } from "@/features/presentation/constant/presentation-option";

export const Route = createFileRoute("/presentation/$presentationId")({
  component: Presentation,
});

function Presentation() {
  const { presentationId } = Route.useParams();
  const navigate = useNavigate();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const {
    query,
    slides,
    isGenerating,
    updatedLabel,
    form,
    setForm,
    updateMut,
    regenerateMut,
    deleteMut,
  } = usePresentationDetail(presentationId, {
    onDelete: () => navigate({ to: "/" }),
  });

  if (query.isPending) {
    return (
      <main className="min-h-screen px-4 pt-24 pb-12">
        <div className="mx-auto max-w-6xl text-muted-foreground">
          Loading presentation...
        </div>
      </main>
    );
  }

  if (query.isError) {
    const error = query.error;
    return (
      <main className="min-h-screen px-4 pt-24 pb-12">
        <div className="mx-auto max-w-6xl space-y-4">
          <p className="text-destructive">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
          <Button asChild variant={"outline"} className="rounded-xl">
            <Link to="/">Back Home</Link>
          </Button>
        </div>
      </main>
    );
  }

  const data = query.data;
  const thumb = presentationThumbnailUrl(data.id);
  const activeSlide = slides.at(activeSlideIndex);

  return (
    <main className="min-h-screen px-4 pt-24 pb-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="gap-1 rounded-xl"
            >
              <Link to="/">
                {" "}
                <ArrowLeft className="size-4" /> Home
              </Link>
            </Button>

            <GenerationStatus status={data?.status} />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 space-y-4">
            <div className="glass flex items-center gap-4 rounded-2xl p-4">
              <img
                src={thumb}
                alt="presentation thumbnail"
                width={56}
                height={56}
                className="rounded-xl border border-border/50 bg-background/30"
              />
              <div className="min-w-0 flex-1">
                <h1 className="truncate font-semibold">{data.title}</h1>
                <p className="text-sm text-muted-foreground">
                  {slides.length} slides
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {slides.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 rounded-xl"
                      onClick={() => setShowSlideshow(true)}
                    >
                      <Play className="size-4" />
                      <span className="hidden sm:inline">Slideshow</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 rounded-xl"
                      // onClick={handleExportPptx}
                      disabled={isExporting}
                    >
                      <Download className="size-4" />
                      <span className="hidden sm:inline">
                        {isExporting ? "Exporting…" : "Export"}
                      </span>
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 rounded-xl"
                  disabled={regenerateMut.isPending || isGenerating}
                  onClick={() => regenerateMut.mutate()}
                >
                  <RefreshCw
                    className={`size-4 ${isGenerating ? "animate-spin" : ""}`}
                  />
                  <span className="hidden sm:inline">
                    {isGenerating ? "Generating…" : "Regenerate"}
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  {showSettings ? "Hide settings" : "Edit settings"}
                </Button>
              </div>
            </div>

            {showSettings && (
              <div className="glass space-y-4 rounded-2xl p-6">
                <div className="space-y-2">
                  <Label htmlFor="pres-title" className="text-sm font-medium">
                    Title
                  </Label>
                  <input
                    id="pres-title"
                    value={form.title}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        title: e.target.value,
                      }))
                    }
                    className="flex h-10 w-full rounded-xl border border-border/50 bg-background/50 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Prompt</Label>
                  <Textarea
                    value={form.prompt}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        prompt: e.target.value,
                      }))
                    }
                    className="min-h-[120px] resize-y rounded-xl border-border/50 bg-background/50 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Slides: {form.slideCount}
                    </Label>
                    <Slider
                      value={[form.slideCount]}
                      onValueChange={([v]) =>
                        setForm((s) => ({
                          ...s,
                          slideCount: v,
                        }))
                      }
                      min={3}
                      max={20}
                      step={1}
                      className="py-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Style</Label>
                    <Select
                      value={form.style}
                      onValueChange={(value) =>
                        setForm((s) => ({
                          ...s,
                          style: value as (typeof SLIDE_STYLES)[number]['value'],
                        }))
                      }
                    >
                      <SelectTrigger className="bg-background/50 border-border/50 rounded-xl">
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
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tone</Label>
                    <Select
                      value={form.tone}
                      onValueChange={(value) =>
                        setForm((s) => ({
                          ...s,
                          tone: value as (typeof TONE_OPTIONS)[number]['value'],
                        }))
                      }
                    >
                      <SelectTrigger className="bg-background/50 border-border/50 rounded-xl">
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
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Layout</Label>
                    <Select
                      value={form.layout}
                      onValueChange={(value) =>
                        setForm((s) => ({
                          ...s,
                          layout: value as (typeof LAYOUT_OPTIONS)[number]['value'],
                        }))
                      }
                    >
                      <SelectTrigger className="bg-background/50 border-border/50 rounded-xl">
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
                </div>




              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
