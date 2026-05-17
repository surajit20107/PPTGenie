import { useState } from "react";

type SlidePreviewProps = {
  slide: {
    id: string;
    order: number;
    title: string;
    content: string;
    notes?: string | null;
    imageUrl?: string | null;
  };
  isFullscreen?: boolean;
};

export function SlidePreview({ slide, isFullscreen }: SlidePreviewProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={`overflow-hidden ${
        isFullscreen ? "h-full w-full bg-black" : "glass rounded-2xl"
      }`}
    >
      <div
        className={`relative bg-linear-to-br from-background to-muted ${
          isFullscreen ? "h-full w-full" : "aspect-video"
        }`}
      >
        {slide.imageUrl && (
          <img
            src={slide.imageUrl}
            alt=""
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              isFullscreen
                ? imageLoaded
                  ? "opacity-50"
                  : "opacity-0"
                : imageLoaded
                  ? "opacity-30"
                  : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(false)}
          />
        )}
        {isFullscreen && (
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30" />
        )}
        <div
          className={`relative z-10 flex h-full flex-col justify-center ${
            isFullscreen
              ? "items-center p-12 text-center md:p-20 lg:p-28"
              : "p-8 md:p-12"
          }`}
        >
          <h2
            className={`mb-4 font-bold ${
              isFullscreen
                ? "text-4xl text-white md:text-6xl lg:text-7xl"
                : "text-2xl md:text-4xl"
            }`}
          >
            {slide.title}
          </h2>
          <div
            className={`whitespace-pre-line ${
              isFullscreen
                ? "max-w-4xl text-xl text-white/80 md:text-2xl lg:text-3xl"
                : "max-w-2xl text-base text-muted-foreground md:text-lg"
            }`}
          >
            {slide.content}
          </div>
        </div>
      </div>
      {slide.notes && !isFullscreen && (
        <div className="border-t border-border/50 bg-muted/30 p-4">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Speaker notes:</span> {slide.notes}
          </p>
        </div>
      )}
    </div>
  );
}
