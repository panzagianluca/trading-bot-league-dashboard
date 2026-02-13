"use client";

import { DiaryEntry } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const typeColors: Record<string, string> = {
  TRADE: "text-blue-400",
  REFLECTION: "text-purple-400",
  LESSON: "text-yellow-400",
  SUMMARY: "text-muted-foreground",
};

export function DiaryFeed({ entries }: { entries: DiaryEntry[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs uppercase tracking-widest">Diary</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="p-4 space-y-3">
            {entries.map((e) => {
              const time = new Date(e.created_at).toLocaleString([], {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
              return (
                <div key={e.id} className="border border-border p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${typeColors[e.entry_type] || ""}`}>
                      {e.entry_type}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{time}</span>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed">{e.content}</p>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
