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
  const standard = bots.filter((b) => b.status === "ACTIVE" && b.bot_type !== "STREAK_HUNTER");
  const streak = bots.filter((b) => b.bot_type === "STREAK_HUNTER");
  const killed = bots.filter((b) => b.status === "KILLED");
  const sorted = [...standard].sort((a, b) => b.equity_usd - a.equity_usd);
  const killLine = sorted.length - 4;

  return (
    <div className="border-r border-border h-full flex flex-col">
      <div className="px-3 py-2 border-b border-border">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          Bots ({standard.length}/{bots.length})
        </span>
      </div>
      <ScrollArea className="flex-1">
        <div className="py-1">
          {sorted.map((bot, i) => {
            const inDanger = i >= killLine;
            const statusColor =
              bot.status === "ACTIVE"
                ? "bg-green-400"
                : bot.status === "PAUSED"
                  ? "bg-yellow-400"
                  : "bg-red-400";
            const pnlColor = bot.pnl_usd >= 0 ? "text-green-400" : "text-red-400";

            return (
              <div key={bot.id}>
                {i === killLine && (
                  <div className="flex items-center gap-2 px-3 py-1.5 my-1">
                    <div className="flex-1 border-t border-red-400/40" />
                    <span className="text-xs uppercase tracking-widest text-red-400/70">
                      ELIMINATION ZONE
                    </span>
                    <div className="flex-1 border-t border-red-400/40" />
                  </div>
                )}
                <Link href={`/bot/${bot.id}`}>
                  <div className={`px-3 py-1.5 flex items-center justify-between hover:bg-accent/50 transition-colors cursor-pointer ${inDanger ? "bg-red-400/5" : ""}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
                      {inDanger ? (
                        <span className="text-xs">&#x1F480;</span>
                      ) : (
                        <div className={`h-1.5 w-1.5 ${statusColor} ${bot.status === "ACTIVE" ? "animate-pulse" : ""}`} />
                      )}
                      <span className={`text-xs font-medium ${inDanger ? "text-red-400/80" : ""}`}>{bot.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs">${bot.equity_usd.toFixed(2)}</span>
                      <span className={`text-xs ${pnlColor}`}>
                        {bot.pnl_usd >= 0 ? "+" : ""}{bot.pnl_usd.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}

          {/* Streak Hunter bots */}
          {streak.length > 0 && (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 my-1">
                <div className="flex-1 border-t border-amber-400/40" />
                <span className="text-xs uppercase tracking-widest text-amber-400/70">
                  &#x1F525; STREAK ({streak.length})
                </span>
                <div className="flex-1 border-t border-amber-400/40" />
              </div>
              {streak.map((bot) => (
                <Link key={bot.id} href={`/bot/${bot.id}`}>
                  <div className="px-3 py-1.5 flex items-center justify-between hover:bg-accent/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">&#x1F525;</span>
                      <span className="text-xs font-medium text-amber-400">{bot.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs">${bot.equity_usd.toFixed(2)}</span>
                      {bot.streak_info && (
                        <span className="text-xs text-amber-400/70">
                          {bot.streak_info.current_streak}/{bot.streak_info.streak_target}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </>
          )}

          {/* Killed bots section */}
          {killed.length > 0 && (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 my-1">
                <div className="flex-1 border-t border-muted-foreground/20" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground/50">
                  &#x1FAA6; KILLED ({killed.length})
                </span>
                <div className="flex-1 border-t border-muted-foreground/20" />
              </div>
              {killed.map((bot) => (
                <Link key={bot.id} href={`/bot/${bot.id}`}>
                  <div className="px-3 py-1.5 flex items-center justify-between hover:bg-accent/50 transition-colors cursor-pointer opacity-40">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4">&#x2620;</span>
                      <span className="text-xs font-medium line-through text-muted-foreground">{bot.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">${bot.equity_usd.toFixed(2)}</span>
                      <span className="text-xs text-red-400/60">
                        {bot.pnl_usd.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
