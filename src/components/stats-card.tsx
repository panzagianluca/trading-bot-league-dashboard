"use client";

import { BotStatus } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="space-y-0.5">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <p className={`text-sm font-medium ${color || ""}`}>{value}</p>
    </div>
  );
}

export function StatsCard({ bot }: { bot: BotStatus }) {
  const pnlUsd = bot.equity_usd - 10;
  const pnlColor = pnlUsd >= 0 ? "text-green-400" : "text-red-400";
  const unrealizedColor = bot.unrealized_pnl_usd >= 0 ? "text-green-400" : "text-red-400";
  const progressPct = Math.min((bot.equity_usd / 500) * 100, 100);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs uppercase tracking-widest">Stats</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid grid-cols-2 gap-4">
          <Stat label="Equity" value={`$${bot.equity_usd.toFixed(2)}`} />
          <Stat label="Cash" value={`$${bot.cash_usd.toFixed(2)}`} />
          <Stat
            label="PnL"
            value={`${pnlUsd >= 0 ? "+" : ""}$${pnlUsd.toFixed(2)}`}
            color={pnlColor}
          />
          <Stat
            label="Unrealized"
            value={`${bot.unrealized_pnl_usd >= 0 ? "+" : ""}$${bot.unrealized_pnl_usd.toFixed(2)}`}
            color={unrealizedColor}
          />
        </div>
        <div className="mt-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Goal: $500</span>
            <span className="text-[10px] text-muted-foreground">{progressPct.toFixed(1)}%</span>
          </div>
          <div className="w-full h-1.5 bg-muted overflow-hidden">
            <div
              className="h-full bg-foreground/50 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
