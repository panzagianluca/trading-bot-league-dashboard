"use client";

import { BotData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function LastAction({ bot }: { bot: BotData }) {
  const actionColor =
    bot.last_action === "BUY"
      ? "text-green-400"
      : bot.last_action === "SELL"
        ? "text-red-400"
        : "text-muted-foreground";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs uppercase tracking-widest">Last Action</CardTitle>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${actionColor}`}>{bot.last_action}</span>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{bot.last_asset}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Strategy</span>
          <span className="text-xs">{bot.last_strategy}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Confidence</span>
          <span className="text-xs">{(bot.last_confidence * 100).toFixed(0)}%</span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Diary Note</span>
          <p className="text-xs text-foreground/70">{bot.last_diary_note}</p>
        </div>
        {bot.last_news_catalyst && (
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">News Catalyst</span>
            <p className="text-xs text-foreground/70 italic">{bot.last_news_catalyst}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
