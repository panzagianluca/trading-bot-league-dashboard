"use client";

import { LeagueStats } from "@/lib/api";

function NavStat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className={`text-xs font-medium ${color || ""}`}>{value}</span>
    </div>
  );
}

export function LeagueNavbar({ stats }: { stats: LeagueStats | null }) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dayStr = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="border-b border-border h-12 px-4 flex items-center justify-between shrink-0">
      {/* Left: time + day */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-muted-foreground">
          {dayStr} {timeStr}
        </span>
      </div>

      {/* Center: Title */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <span className="text-xs font-medium uppercase tracking-widest">Trading Bot League</span>
      </div>

      {/* Right: Aggregated stats */}
      {stats && (
        <div className="flex items-center gap-4">
          <NavStat label="Bots" value={`${stats.bots_active}/${stats.bots_active + stats.bots_killed}`} />
          <NavStat label="Equity" value={`$${stats.total_equity_usd.toFixed(2)}`} />
          <NavStat label="Cash" value={`$${stats.total_cash_usd.toFixed(2)}`} />
          <NavStat
            label="PnL"
            value={`${stats.total_pnl_usd >= 0 ? "+" : ""}${stats.total_pnl_usd.toFixed(2)}`}
            color={stats.total_pnl_usd >= 0 ? "text-green-400" : "text-red-400"}
          />
          <NavStat label="Round" value={stats.round_name} />
          <NavStat label="Left" value={`${stats.days_left}d`} />
        </div>
      )}
    </div>
  );
}
