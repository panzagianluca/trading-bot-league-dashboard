"use client";

import { useEffect, useState } from "react";
import { usePolybot } from "@/hooks/use-polybot";
import { BotStatus, RiskMode } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

// ── Risk Mode Colors ─────────────────────────────────────────

const RISK_CONFIG: Record<RiskMode, { color: string; bg: string; label: string }> = {
  ULTRA_CONSERVATIVE: { color: "text-red-500", bg: "bg-red-500/10", label: "ULTRA CONSERVATIVE" },
  CONSERVATIVE: { color: "text-red-400", bg: "bg-red-400/10", label: "CONSERVATIVE" },
  MODERATE: { color: "text-yellow-400", bg: "bg-yellow-400/10", label: "MODERATE" },
  AGGRESSIVE: { color: "text-green-400", bg: "bg-green-400/10", label: "AGGRESSIVE" },
  HOUSE_MONEY: { color: "text-emerald-400", bg: "bg-emerald-400/10", label: "HOUSE MONEY" },
};

// ── Navbar ───────────────────────────────────────────────────

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function Navbar({
  connected,
  lastUpdated,
  onRefresh,
}: {
  connected: boolean;
  lastUpdated: Date | null;
  onRefresh: () => void;
}) {
  const now = useClock();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="border-b border-border h-12 px-3 sm:px-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="text-xs sm:text-sm font-medium uppercase tracking-widest">Polybot</span>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          {now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
        </span>
        <span className="text-xs text-muted-foreground">{timeStr}</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-1.5">
          <span className={`inline-block w-2 h-2 rounded-full ${connected ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {connected ? "LIVE" : "RECONNECTING..."}
          </span>
        </div>
        <button
          onClick={onRefresh}
          className="px-2 py-1 border border-border text-xs uppercase tracking-widest hover:bg-accent/50 transition-colors cursor-pointer"
        >
          ↻
        </button>
      </div>
    </div>
  );
}

// ── Challenge Progress ───────────────────────────────────────

function ChallengeProgress({ status }: { status: BotStatus }) {
  const start = 100;
  const target = 1000;
  const current = status.total_equity;
  const progress = Math.max(0, Math.min(((current - start) / (target - start)) * 100, 100));
  const profitColor = status.challenge_profit >= 0 ? "text-green-400" : "text-red-400";

  const gradientColor = progress < 30
    ? "from-red-500 to-red-400"
    : progress < 60
      ? "from-red-400 via-yellow-400 to-yellow-400"
      : "from-yellow-400 to-green-400";

  return (
    <Card>
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs sm:text-sm uppercase tracking-widest">$100 → $1,000</CardTitle>
          <span className="text-xs text-muted-foreground">{(status.challenge_progress * 100).toFixed(1)}%</span>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6 space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Equity</span>
            <p className="text-xl sm:text-2xl font-medium">${current.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Profit</span>
            <p className={`text-base sm:text-lg font-medium ${profitColor}`}>
              {status.challenge_profit >= 0 ? "+" : ""}${status.challenge_profit.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="w-full h-3 bg-muted overflow-hidden border border-border">
            <div
              className={`h-full bg-gradient-to-r ${gradientColor} transition-all duration-700`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$100</span>
            <span>$250</span>
            <span>$500</span>
            <span>$1,000</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Price Tickers ────────────────────────────────────────────

function PriceTickers({ status }: { status: BotStatus }) {
  const tickers = [
    { symbol: "BTC", price: status.btc_price },
    { symbol: "ETH", price: status.eth_price },
    { symbol: "SOL", price: status.sol_price },
    { symbol: "XRP", price: status.xrp_price },
  ];

  return (
    <Card>
      <CardHeader className="pb-2 px-3 sm:px-6">
        <CardTitle className="text-xs sm:text-sm uppercase tracking-widest">Live Prices</CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="grid grid-cols-4 sm:grid-cols-2 gap-2 sm:gap-4">
          {tickers.map((t) => (
            <div key={t.symbol} className="space-y-0.5">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{t.symbol}</span>
              <p className="text-xs sm:text-base font-medium font-mono">
                ${t.price < 10 ? t.price.toFixed(4) : t.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Balance / Stats Card ─────────────────────────────────────

function BalanceCard({ status }: { status: BotStatus }) {
  const pnlColor = status.pnl >= 0 ? "text-green-400" : "text-red-400";
  const volLabel = status.volatility_score < 1 ? "LOW" : status.volatility_score < 2 ? "MODERATE" : "HIGH";
  const volColor = status.volatility_score < 1 ? "text-green-400" : status.volatility_score < 2 ? "text-yellow-400" : "text-red-400";

  return (
    <Card>
      <CardHeader className="pb-2 px-3 sm:px-6">
        <CardTitle className="text-xs sm:text-sm uppercase tracking-widest">Balance</CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-0.5">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Available</span>
            <p className="text-sm sm:text-base font-medium">${status.balance.toFixed(2)}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Positions</span>
            <p className="text-sm sm:text-base font-medium">${status.positions_value.toFixed(2)}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Total PnL</span>
            <p className={`text-sm sm:text-base font-medium ${pnlColor}`}>
              {status.pnl >= 0 ? "+" : ""}${status.pnl.toFixed(2)}
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Volatility</span>
            <p className={`text-sm sm:text-base font-medium ${volColor}`}>{volLabel}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Risk Mode Indicator ──────────────────────────────────────

function RiskModeCard({ status }: { status: BotStatus }) {
  const config = RISK_CONFIG[status.risk_mode] || RISK_CONFIG.MODERATE;
  const modes: RiskMode[] = ["ULTRA_CONSERVATIVE", "CONSERVATIVE", "MODERATE", "AGGRESSIVE", "HOUSE_MONEY"];
  const activeIdx = modes.indexOf(status.risk_mode);

  const descriptions: Record<RiskMode, string> = {
    ULTRA_CONSERVATIVE: "Down $10+. Preservation mode.",
    CONSERVATIVE: "Below $100. Careful entries.",
    MODERATE: "$100-$150. Balanced approach.",
    AGGRESSIVE: "$150-$250. Larger positions.",
    HOUSE_MONEY: "$250+. Max opportunity.",
  };

  return (
    <Card>
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs sm:text-sm uppercase tracking-widest">Risk Mode</CardTitle>
          <Badge variant="outline" className={`text-xs px-2 py-0.5 ${config.color} ${config.bg} border-current`}>
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6 space-y-2">
        <div className="flex gap-1">
          {modes.map((m, i) => {
            const c = RISK_CONFIG[m];
            const isActive = i === activeIdx;
            return (
              <div
                key={m}
                className={`flex-1 h-2 border transition-all ${isActive
                  ? `${c.bg} border-current ${c.color}`
                  : "bg-muted border-border opacity-30"
                  }`}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>SAFE</span>
          <span>AGGRESSIVE</span>
        </div>
        <p className="text-xs text-muted-foreground">{descriptions[status.risk_mode]}</p>
      </CardContent>
    </Card>
  );
}

// ── Last Decision Card ───────────────────────────────────────

function LastDecisionCard({ status }: { status: BotStatus }) {
  const d = status.last_decision;
  const actionColor =
    d.action === "BUY" ? "text-green-400 bg-green-400/10 border-green-400/30"
      : d.action === "SELL" ? "text-red-400 bg-red-400/10 border-red-400/30"
        : "text-muted-foreground bg-muted border-border";

  return (
    <Card>
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs sm:text-sm uppercase tracking-widest">Last Decision</CardTitle>
          <Badge variant="outline" className={`text-xs px-2 py-0.5 ${actionColor}`}>
            {d.action}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">{d.reasoning}</p>
      </CardContent>
    </Card>
  );
}

// ── Log Feed ─────────────────────────────────────────────────

function parseLogLevel(line: string): "info" | "warn" | "error" | "debug" {
  const upper = line.toUpperCase();
  if (upper.includes(" ERROR ") || upper.includes(" ERR ")) return "error";
  if (upper.includes(" WARN ")) return "warn";
  if (upper.includes(" DEBUG ")) return "debug";
  return "info";
}

const LOG_COLORS = {
  info: "text-foreground/70",
  warn: "text-yellow-400",
  error: "text-red-400",
  debug: "text-muted-foreground",
};

function LogFeed({ logs, totalLines }: { logs: string[]; totalLines: number }) {
  return (
    <Card>
      <CardHeader className="pb-2 px-3 sm:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs sm:text-sm uppercase tracking-widest">Live Logs</CardTitle>
          <span className="text-xs text-muted-foreground">{totalLines.toLocaleString()} total</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {logs.length === 0 ? (
          <div className="py-8 flex items-center justify-center">
            <p className="text-sm text-muted-foreground italic">Waiting for logs...</p>
          </div>
        ) : (
          <div className="max-h-[40vh] sm:max-h-[50vh] overflow-y-auto">
            <div className="px-3 sm:px-4 py-2 space-y-0.5 font-mono">
              {logs.map((line, i) => {
                const level = parseLogLevel(line);
                return (
                  <p key={i} className={`text-[10px] sm:text-xs leading-relaxed break-all ${LOG_COLORS[level]}`}>
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Main Dashboard ───────────────────────────────────────────

export default function Dashboard() {
  const { status, logs, totalLogLines, connected, lastUpdated, loading, refetch } = usePolybot();

  if (loading) {
    return (
      <div className="h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">Connecting to Polybot...</p>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="h-screen bg-background text-foreground flex items-center justify-center flex-col gap-2">
        <p className="text-sm text-red-400">Failed to connect</p>
        <button onClick={refetch} className="text-xs border border-border px-3 py-1 hover:bg-accent/50 cursor-pointer">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar connected={connected} lastUpdated={lastUpdated} onRefresh={refetch} />

      <div className="flex-1 p-3 sm:p-4 space-y-3">
        {/* Row 1: Challenge (full on mobile) | Prices + Balance side by side */}
        <ChallengeProgress status={status} />

        <PriceTickers status={status} />
        <BalanceCard status={status} />

        {/* Row 2: Risk Mode + Last Decision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <RiskModeCard status={status} />
          <LastDecisionCard status={status} />
        </div>

        {/* Row 3: Live Logs */}
        <LogFeed logs={logs} totalLines={totalLogLines} />
      </div>
    </div>
  );
}
