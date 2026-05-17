import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/pagination";

type Slide = {
  id: string;
  order: number;
  title: string;
  content: string;
  notes?: string | null;
  imageUrl?: string | null;
};

type SlideshowModalProps = {
  slides: Slide[];
  initialIndex?: number;
  onClose: () => void;
};

export function SlideshowModal({
  slides,
  initialIndex = 0,
  onClose,
}: SlideshowModalProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const currentSlide = slides[currentIndex];

  const toggleAutoplay = useCallback(() => {
    if (!swiperRef.current) return;
    if (isPlaying) {
      swiperRef.current.autoplay.stop();
    } else {
      swiperRef.current.autoplay.start();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "p" || e.key === " ") {
        e.preventDefault();
        toggleAutoplay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, toggleAutoplay]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <Swiper
        modules={[Keyboard, Autoplay, Pagination]}
        keyboard={{ enabled: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        initialSlide={initialIndex}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          swiper.autoplay.stop();
        }}
        onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
        onAutoplayStart={() => setIsPlaying(true)}
        onAutoplayStop={() => setIsPlaying(false)}
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              {slide.imageUrl && (
                <img
                  src={slide.imageUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-40"
                />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/60" />

              <div className="relative z-10 flex h-full flex-col items-center justify-center px-8 md:px-16 lg:px-24">
                <div className="w-full max-w-5xl text-center">
                  <h1 className="mb-8 text-4xl leading-tight font-bold text-white md:text-6xl lg:text-7xl">
                    {slide.title}
                  </h1>
                  <div className="mx-auto max-w-3xl text-xl leading-relaxed whitespace-pre-line text-white/80 md:text-2xl lg:text-3xl">
                    {slide.content}
                  </div>
                </div>
              </div>

              {slide.notes && showControls && (
                <div className="absolute bottom-32 left-1/2 z-20 max-w-2xl -translate-x-1/2 rounded-xl bg-black/60 px-6 py-3 backdrop-blur-sm">
                  <p className="text-center text-sm text-white/70">
                    <span className="font-medium text-white/90">Notes:</span>{" "}
                    {slide.notes}
                  </p>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className={`absolute right-0 bottom-0 left-0 z-30 p-6 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="size-12 rounded-full text-white hover:bg-white/20"
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="size-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-12 rounded-full text-white hover:bg-white/20"
            onClick={toggleAutoplay}
          >
            {isPlaying ? (
              <Pause className="size-6" />
            ) : (
              <Play className="size-6" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-12 rounded-full text-white hover:bg-white/20"
            onClick={() => swiperRef.current?.slideNext()}
            disabled={currentIndex >= slides.length - 1}
          >
            <ChevronRight className="size-6" />
          </Button>
        </div>

        <div className="mt-4 text-center">
          <span className="text-sm text-white/60">
            {currentIndex + 1} / {slides.length}
          </span>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className={`absolute top-4 right-4 z-30 size-12 rounded-full text-white transition-opacity duration-300 hover:bg-white/20 ${
          showControls ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      >
        <X className="size-6" />
      </Button>
    </div>
  );
}
