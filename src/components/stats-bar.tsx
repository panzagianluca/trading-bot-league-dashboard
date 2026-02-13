"use client";

import { LeagueContext, BotData } from "@/lib/mock-data";

function StatBlock({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
      {sub && <span className="text-[10px] text-muted-foreground">{sub}</span>}
    </div>
  );
}

export function StatsBar({ league, bot }: { league: LeagueContext; bot: BotData }) {
  const pnlColor = bot.weekly_pnl_usd >= 0 ? "text-green-400" : "text-red-400";

  return (
    <div className="border-b border-border px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-400 animate-pulse" />
          <span className="text-xs font-medium">ROUND {league.round_id}</span>
        </div>
        <StatBlock label="Time Left" value={`${league.time_left_hours.toFixed(1)}h`} />
        <StatBlock label="Active" value={`${league.active_bots} bots`} />
        <StatBlock label="Cutoff Rank" value={`#${league.elimination_cutoff_rank}`} sub={`${league.cutoff_weekly_pnl_usd >= 0 ? "+" : ""}${league.cutoff_weekly_pnl_usd.toFixed(2)}`} />
      </div>
      <div className="flex items-center gap-8">
        <StatBlock label="Bot" value={bot.name} />
        <StatBlock label="Rank" value={`#${bot.rank}`} />
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Weekly PnL</span>
          <span className={`text-sm font-medium ${pnlColor}`}>
            {bot.weekly_pnl_usd >= 0 ? "+" : ""}{bot.weekly_pnl_usd.toFixed(2)}
          </span>
        </div>
        <StatBlock label="Equity" value={`$${bot.equity_usd.toFixed(2)}`} />
        <StatBlock label="Survival Gap" value={`${bot.survival_gap_usd >= 0 ? "+" : ""}${bot.survival_gap_usd.toFixed(2)}`} />
      </div>
    </div>
  );
}
