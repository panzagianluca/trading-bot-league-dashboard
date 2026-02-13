"use client";

import { useEffect, useState } from "react";
import { LeagueStats } from "@/lib/api";

function NavStat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${color || ""}`}>{value}</span>
    </div>
  );
}

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function LeagueNavbar({ stats, onRefresh }: { stats: LeagueStats | null; onRefresh?: () => void }) {
  const now = useClock();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dayStr = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="border-b border-border h-12 px-4 flex items-center justify-between shrink-0">
      {/* Left: Title + time */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium uppercase tracking-widest">Trading Bot League</span>
        <span className="text-xs text-muted-foreground">
          {dayStr} {timeStr}
        </span>
      </div>

      {/* Right: Aggregated stats */}
      {stats && (
        <div className="flex items-center gap-4">
          <NavStat label="Bots" value={`${stats.bots_active}/${stats.bots_total}`} />
          <NavStat label="Equity" value={`$${stats.total_equity_usd.toFixed(2)}`} />
          <NavStat label="Cash" value={`$${stats.total_cash_usd.toFixed(2)}`} />
          <NavStat
            label="PnL"
            value={`${stats.total_pnl_usd >= 0 ? "+" : ""}${stats.total_pnl_usd.toFixed(2)}`}
            color={stats.total_pnl_usd >= 0 ? "text-green-400" : "text-red-400"}
          />
          <NavStat label="Round" value={stats.round_name} />
          <NavStat label="Left" value={`${stats.days_left}d`} />
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="ml-2 px-2 py-1 border border-border text-xs uppercase tracking-widest hover:bg-accent/50 transition-colors cursor-pointer"
              title="Refresh data"
            >
              ↻
            </button>
          )}
        </div>
      )}
    </div>
  );
}
