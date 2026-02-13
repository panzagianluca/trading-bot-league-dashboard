"use client";

import Link from "next/link";
import { BotSummary } from "@/lib/api";
import { ScrollArea } from "@/components/ui/scroll-area";

const riskColors: Record<string, string> = {
  zen: "text-purple-400",
  flow: "text-cyan-400",
  aggressive: "text-red-400",
  cautious: "text-yellow-400",
};

export function BotSidebar({ bots }: { bots: BotSummary[] }) {
  const sorted = [...bots].sort((a, b) => b.equity_usd - a.equity_usd);

  return (
    <div className="border-r border-border h-full flex flex-col">
      <div className="px-3 py-2 border-b border-border">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
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

            return (
              <Link key={bot.id} href={`/bot/${bot.id}`}>
                <div className="px-3 py-1.5 flex items-center justify-between hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-4">{i + 1}</span>
                    <div className={`h-1.5 w-1.5 ${statusColor} ${bot.status === "ACTIVE" ? "animate-pulse" : ""}`} />
                    <span className="text-[11px] font-medium">{bot.name}</span>
                    <span className={`text-[10px] ${riskColors[bot.risk_style] || "text-muted-foreground"}`}>
                      {bot.risk_style}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px]">${bot.equity_usd.toFixed(2)}</span>
                    <span className={`text-[10px] ${pnlColor}`}>
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
