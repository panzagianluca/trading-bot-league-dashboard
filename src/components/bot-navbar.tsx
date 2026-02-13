"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BotStatus } from "@/lib/api";

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

export function BotNavbar({ bot, lastUpdated }: { bot: BotStatus; lastUpdated: Date | null }) {
  const statusColor =
    bot.status === "ACTIVE"
      ? "text-green-400"
      : bot.status === "PAUSED"
        ? "text-yellow-400"
        : "text-red-400";

  const pnlUsd = bot.pnl_usd;
  const pnlColor = pnlUsd >= 0 ? "text-green-400" : "text-red-400";
  const progressPct = Math.min((bot.equity_usd / 500) * 100, 100);

  const now = useClock();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dayStr = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="border-b border-border h-12 px-4 flex items-center justify-between shrink-0">
      {/* Left: Back + time */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; BACK
        </Link>
        <span className="text-xs text-muted-foreground">
          {dayStr} {timeStr}
        </span>
      </div>

      {/* Center: Bot name + status */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className={`h-1.5 w-1.5 ${bot.status === "ACTIVE" ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
        <span className="text-sm font-medium">{bot.name}</span>
        <span className={`text-xs uppercase ${statusColor}`}>{bot.status}</span>
      </div>

      {/* Right: Stats */}
      <div className="flex items-center gap-4">
        <NavStat label="Equity" value={`$${bot.equity_usd.toFixed(2)}`} />
        <NavStat label="Cash" value={`$${bot.cash_usd.toFixed(2)}`} />
        <NavStat
          label="PnL"
          value={`${pnlUsd >= 0 ? "+" : ""}${pnlUsd.toFixed(2)}`}
          color={pnlColor}
        />
        <NavStat
          label="Unrlzd"
          value={`${bot.unrealized_pnl_usd >= 0 ? "+" : ""}${bot.unrealized_pnl_usd.toFixed(2)}`}
          color={bot.unrealized_pnl_usd >= 0 ? "text-green-400" : "text-red-400"}
        />
        <div className="flex flex-col gap-0.5 items-end">
          <span className="text-xs text-muted-foreground">$500</span>
          <div className="w-20 h-1 bg-muted overflow-hidden">
            <div
              className="h-full bg-foreground/50 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
