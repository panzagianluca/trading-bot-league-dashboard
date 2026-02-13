"use client";

import { DiaryEntry, parseReflectionMetadata } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const typeColors: Record<string, string> = {
  REFLECTION: "text-purple-400 border-purple-400/30",
  LESSON: "text-yellow-400 border-yellow-400/30",
  MILESTONE: "text-cyan-400 border-cyan-400/30",
};

function DiaryCard({ entry }: { entry: DiaryEntry }) {
  const time = new Date(entry.created_at).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const meta = parseReflectionMetadata(entry.metadata);

  return (
    <div className="border border-border p-3 space-y-2">
      <div className="flex items-center justify-between">
        <Badge
          variant="outline"
          className={`text-xs px-1.5 py-0 ${typeColors[entry.entry_type] || ""}`}
        >
          {entry.entry_type}
        </Badge>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>

      <p className="text-sm text-foreground/80 leading-relaxed">{entry.content}</p>

      {meta?.reflection && (
        <p className="text-xs text-muted-foreground/60 italic border-l border-border pl-2">
          {meta.reflection}
        </p>
      )}

      {meta?.lessons && meta.lessons.length > 0 && (
        <div className="space-y-1">
          {meta.lessons.map((lesson, i) => (
            <p key={i} className="text-xs text-muted-foreground/50 pl-2 border-l border-yellow-400/20">
              {lesson}
            </p>
          ))}
        </div>
      )}

      {meta?.equity_at_reflection != null && (
        <span className="text-xs text-muted-foreground/40">
          Equity: ${meta.equity_at_reflection.toFixed(2)}
        </span>
      )}
    </div>
  );
}

export function DiaryFeed({ entries }: { entries: DiaryEntry[] }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm uppercase tracking-widest">Diary</CardTitle>
          <span className="text-xs text-muted-foreground">
            {entries.length} entries
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            {entries.length === 0 ? (
              <p className="text-sm text-muted-foreground italic text-center py-8">
                The journal awaits its first entry...
              </p>
            ) : (
              entries.map((e) => <DiaryCard key={e.id} entry={e} />)
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
