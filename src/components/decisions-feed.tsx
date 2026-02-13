"use client";

import { BotDecision } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

function DecisionCard({ d }: { d: BotDecision }) {
  const actionColor =
    d.action === "BUY"
      ? "text-green-400"
      : d.action === "SELL"
        ? "text-red-400"
        : "text-muted-foreground";

  const time = new Date(d.tick_ts).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="border border-border p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium ${actionColor}`}>{d.action}</span>
          {d.action !== "HOLD" && (
            <>
              <span className="text-xs text-muted-foreground">{d.asset}</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {d.horizon_minutes}m
              </Badge>
            </>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground">{time}</span>
      </div>

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">{d.thesis}</p>
        {d.news_catalyst && (
          <p className="text-[10px] text-muted-foreground/70 italic">
            News: {d.news_catalyst}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
        <span>Conf: {(d.confidence * 100).toFixed(0)}%</span>
        {d.size_usd > 0 && <span>${d.size_usd.toFixed(2)}</span>}
        <span>Strategy: {d.selected_strategy}</span>
      </div>

      <div className="flex flex-wrap gap-1">
        {d.data_sources_used.map((tool) => (
          <Badge key={tool} variant="outline" className="text-[9px] px-1 py-0 text-muted-foreground">
            {tool}
          </Badge>
        ))}
      </div>
    </div>
  );
}

export function DecisionsFeed({ decisions }: { decisions: BotDecision[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs uppercase tracking-widest">Recent Decisions</CardTitle>
          <span className="text-xs text-muted-foreground">{decisions.length} ticks</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="p-4 space-y-2">
            {decisions.map((d, i) => (
              <DecisionCard key={i} d={d} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
