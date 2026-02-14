"use client";

import Link from "next/link";
import { BotSummary } from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";

export function BotSidebar({ bots }: { bots: BotSummary[] }) {
  const sorted = [...bots].sort((a, b) => b.equity_usd - a.equity_usd);

  return (
    <div className="border-r border-border h-full flex flex-col">
      <div className="px-3 py-2 border-b border-border">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          Bots ({bots.length})
        </span>
      </div>
      <ScrollArea className="flex-1">
        <div className="py-1">
          {sorted.map((bot, i) => {
            const statusColor =
              bot.status === "ACTIVE"
                ? "bg-green-400"
                : bot.status === "PAUSED"
                  ? "bg-yellow-400"
                  : "bg-red-400";
            const pnlColor = bot.pnl_usd >= 0 ? "text-green-400" : "text-red-400";
            const isStreak = bot.bot_type === "STREAK_HUNTER";

            return (
              <Link key={bot.id} href={`/bot/${bot.id}`}>
                <div className="px-3 py-1.5 flex items-center justify-between hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                    {isStreak ? (
                      <span className="text-xs">&#x1F525;</span>
                    ) : (
                      <div className={`h-1.5 w-1.5 ${statusColor} ${bot.status === "ACTIVE" ? "animate-pulse" : ""}`} />
                    )}
                    <span className={`text-xs font-medium ${isStreak ? "text-amber-400" : ""}`}>{bot.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs">${bot.equity_usd.toFixed(2)}</span>
                    <span className={`text-xs ${pnlColor}`}>
                      {bot.pnl_usd >= 0 ? "+" : ""}{bot.pnl_usd.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
