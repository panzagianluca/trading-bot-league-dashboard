"use client";

import { Decision } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

function DecisionCard({ d }: { d: Decision }) {
  const actionColor =
    d.action === "BUY"
      ? "text-green-400"
      : d.action === "SELL"
        ? "text-red-400"
        : "text-muted-foreground";

  const time = new Date(d.tick_ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="border border-border p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${actionColor}`}>{d.action}</span>
          {d.asset && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {d.asset}
            </Badge>
          )}
          {d.horizon_minutes > 0 && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {d.horizon_minutes}m
            </Badge>
          )}
          {d.confidence !== null && d.confidence > 0 && (
            <span className="text-[10px] text-muted-foreground">
              {(d.confidence * 100).toFixed(0)}%
            </span>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground">{time}</span>
      </div>

      <p className="text-xs text-foreground/70 leading-relaxed">{d.thesis}</p>

      {d.diary_note && (
        <p className="text-[11px] text-muted-foreground/60 italic border-l border-border pl-2">
          {d.diary_note}
        </p>
      )}

      {d.news_catalyst && (
        <p className="text-[10px] text-muted-foreground/50 italic">
          Catalyst: {d.news_catalyst}
        </p>
      )}
    </div>
  );
}

export function DecisionsFeed({ decisions }: { decisions: Decision[] }) {
  const holdCount = decisions.filter((d) => d.action === "HOLD").length;
  const totalCount = decisions.length;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs uppercase tracking-widest">Live Thinking</CardTitle>
          <span className="text-[10px] text-muted-foreground">
            {holdCount}/{totalCount} HOLD
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-2">
            {decisions.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-8">
                In stillness, opportunity grows...
              </p>
            ) : (
              decisions.map((d) => <DecisionCard key={d.id} d={d} />)
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
