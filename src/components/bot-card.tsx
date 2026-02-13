"use client";

import Link from "next/link";
import { BotSummary } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

const riskColors: Record<string, string> = {
  zen: "text-purple-400",
  flow: "text-cyan-400",
  aggressive: "text-red-400",
  cautious: "text-yellow-400",
};

const actionColors: Record<string, string> = {
  BUY: "text-green-400",
  SELL: "text-red-400",
  HOLD: "text-muted-foreground",
};

export function BotCard({ bot, inDanger }: { bot: BotSummary; inDanger?: boolean }) {
  const statusColor =
    bot.status === "ACTIVE"
      ? "bg-green-400"
      : bot.status === "PAUSED"
        ? "bg-yellow-400"
        : "bg-red-400";

  const pnlColor = bot.pnl_usd >= 0 ? "text-green-400" : "text-red-400";
  const progressPct = Math.min((bot.equity_usd / 500) * 100, 100);

  return (
    <Link href={`/bot/${bot.id}`}>
      <div className={`border p-3 space-y-2 hover:border-foreground/30 transition-colors cursor-pointer ${inDanger ? "border-red-400/40 bg-red-400/5" : "border-border"}`}>
        {/* Header: name + status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {inDanger ? (
              <span className="text-xs">&#x1F480;</span>
            ) : (
              <div className={`h-1.5 w-1.5 ${statusColor} ${bot.status === "ACTIVE" ? "animate-pulse" : ""}`} />
            )}
            <span className={`text-sm font-medium ${inDanger ? "text-red-400/80" : ""}`}>{bot.name}</span>
          </div>
          <Badge variant="outline" className={`text-xs px-1.5 py-0 ${riskColors[bot.risk_style] || ""}`}>
            {bot.risk_style}
          </Badge>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Equity</span>
            <span className="text-xs font-medium">${bot.equity_usd.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">PnL</span>
            <span className={`text-xs font-medium ${pnlColor}`}>
              {bot.pnl_usd >= 0 ? "+" : ""}{bot.pnl_usd.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Cash</span>
            <span className="text-xs font-medium">${bot.cash_usd.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Last</span>
            <span className={`text-xs font-medium ${actionColors[bot.last_action] || ""}`}>
              {bot.last_action}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-0.5">
          <div className="w-full h-1 bg-muted overflow-hidden">
            <div
              className="h-full bg-foreground/40 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-[9px] text-muted-foreground">{progressPct.toFixed(1)}% to $500</span>
        </div>
      </div>
    </Link>
  );
}
