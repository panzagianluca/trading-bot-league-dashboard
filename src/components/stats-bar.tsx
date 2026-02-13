"use client";

import { BotStatus } from "@/lib/api";

function StatBlock({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${color || ""}`}>{value}</span>
    </div>
  );
}

export function StatsBar({ bot, lastUpdated }: { bot: BotStatus; lastUpdated: Date | null }) {
  const statusColor =
    bot.status === "ACTIVE"
      ? "text-green-400"
      : bot.status === "PAUSED"
        ? "text-yellow-400"
        : "text-red-400";

  const pnlUsd = bot.equity_usd - 10;
  const pnlColor = pnlUsd >= 0 ? "text-green-400" : "text-red-400";
  const progressPct = Math.min((bot.equity_usd / 500) * 100, 100);

  return (
    <div className="border-b border-border px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 ${bot.status === "ACTIVE" ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
          <span className="text-xs font-medium">{bot.name}</span>
          <span className={`text-[10px] uppercase ${statusColor}`}>{bot.status}</span>
        </div>
        <StatBlock label="Equity" value={`$${bot.equity_usd.toFixed(2)}`} />
        <StatBlock label="Cash" value={`$${bot.cash_usd.toFixed(2)}`} />
        <StatBlock
          label="PnL"
          value={`${pnlUsd >= 0 ? "+" : ""}${pnlUsd.toFixed(2)}`}
          color={pnlColor}
        />
        <StatBlock
          label="Unrealized"
          value={`${bot.unrealized_pnl_usd >= 0 ? "+" : ""}${bot.unrealized_pnl_usd.toFixed(2)}`}
          color={bot.unrealized_pnl_usd >= 0 ? "text-green-400" : "text-red-400"}
        />
      </div>
      <div className="flex items-center gap-6">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Goal: $500</span>
          <div className="w-32 h-1.5 bg-muted overflow-hidden">
            <div
              className="h-full bg-foreground/50 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-[10px] text-muted-foreground">{progressPct.toFixed(1)}%</span>
        </div>
        {lastUpdated && (
          <span className="text-[10px] text-muted-foreground">
            {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        )}
      </div>
    </div>
  );
}
