import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@tanstack/react-router";

import type { Presentation } from "@/features/presentation/types/presentation.types";
import { presentationThumbnailUrl } from "@/features/presentation/utils/thumbnail-url";

type PresentationCardProps = {
  presentation: Presentation;
};

export function PresentationCard({ presentation: p }: PresentationCardProps) {
  const updated = new Date(p.updatedAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const thumb = presentationThumbnailUrl(p.id);

  return (
    <Link
      to="/presentation/$presentationId"
      params={{ presentationId: p.id }}
      className="block h-full rounded-xl focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
    >
      <Card className="glass h-full overflow-hidden border-border/50 py-0 transition-colors hover:border-primary/40">
        <div className="flex gap-4 p-4">
          <img
            src={thumb}
            alt=""
            width={72}
            height={72}
            className="shrink-0 rounded-xl border border-border/50 bg-background/30"
          />
          <CardHeader className="min-w-0 flex-1 gap-1 p-0">
            <CardTitle className="line-clamp-2 text-base">{p.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {p.slideCount} slides · {p.style} · {p.tone}
            </CardDescription>
            <p className="pt-1 text-xs text-muted-foreground">
              Updated {updated}
            </p>
          </CardHeader>
        </div>
      </Card>
    </Link>
  );
}
