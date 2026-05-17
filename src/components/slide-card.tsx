import { useState } from "react";
import { ImageIcon, Loader2 } from "lucide-react";

type SlideCardProps = {
  slide: {
    id: string;
    order: number;
    title: string;
    content: string;
    notes?: string | null;
    imageUrl?: string | null;
  };
  isActive?: boolean;
  onClick?: () => void;
};

export function SlideCard({ slide, isActive, onClick }: SlideCardProps) {
  const [imageStatus, setImageStatus] = useState<
    "loading" | "loaded" | "error"
  >("loading");

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl p-3 text-left transition-all ${
        isActive
          ? "bg-primary/10 ring-2 ring-primary/50"
          : "border border-border/30 bg-card/50 hover:border-border/60 hover:bg-card/80"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex size-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${
            isActive
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {slide.order + 1}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="mb-2 line-clamp-1 text-sm font-medium">
            {slide.title}
          </h3>
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
            {slide.imageUrl ? (
              <>
                {imageStatus === "loading" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
                {imageStatus === "error" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-muted/50">
                    <ImageIcon className="size-5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Loading…
                    </span>
                  </div>
                )}
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className={`h-full w-full object-cover transition-opacity ${
                    imageStatus === "loaded" ? "opacity-100" : "opacity-0"
                  }`}
                  loading="lazy"
                  onLoad={() => setImageStatus("loaded")}
                  onError={() => setImageStatus("error")}
                />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-muted-foreground">No image</span>
              </div>
            )}
          </div>
          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
            {slide.content}
          </p>
        </div>
      </div>
    </button>
  );
}
