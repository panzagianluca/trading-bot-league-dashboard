"use client";

import { useEffect, useState } from "react";
import { usePolybot } from "@/hooks/use-polybot";
import { BotStatus, RiskMode, SignalsResponse, Signal, BotState } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ── Risk Mode Colors ─────────────────────────────────────────

const RISK_CONFIG: Record<RiskMode, { color: string; bg: string; label: string }> = {
  ULTRA_CONSERVATIVE: { color: "text-red-500", bg: "bg-red-500/10", label: "ULTRA CONSERVATIVE" },
  CONSERVATIVE: { color: "text-red-400", bg: "bg-red-400/10", label: "CONSERVATIVE" },
  MODERATE: { color: "text-yellow-400", bg: "bg-yellow-400/10", label: "MODERATE" },
  AGGRESSIVE: { color: "text-green-400", bg: "bg-green-400/10", label: "AGGRESSIVE" },
  HOUSE_MONEY: { color: "text-emerald-400", bg: "bg-emerald-400/10", label: "HOUSE MONEY" },
};

// ── Helpers ──────────────────────────────────────────────────

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

function Stat({ label, value, color, small }: { label: string; value: string; color?: string; small?: boolean }) {
  return (
    <div className="space-y-0.5">
      <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <p className={`${small ? "text-xs sm:text-sm" : "text-sm sm:text-base"} font-medium ${color || ""}`}>{value}</p>
    </div>
  );
}

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
  onRefresh,
}: {
  connected: boolean;
  onRefresh: () => void;
}) {
  const now = useClock();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  return (
    <div className="border-b border-border h-11 px-3 sm:px-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="text-xs sm:text-sm font-medium uppercase tracking-widest">Polybot v3</span>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          {now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
        </span>
        <span className="text-xs text-muted-foreground">{timeStr}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`inline-block w-2 h-2 rounded-full ${connected ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
        <span className="text-xs text-muted-foreground hidden sm:inline">
          {connected ? "LIVE" : "RECONNECTING..."}
        </span>
        <button
          onClick={onRefresh}
          className="px-2 py-0.5 border border-border text-xs hover:bg-accent/50 transition-colors cursor-pointer"
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
  const rawProgress = status.challenge_progress;
  const progress = rawProgress != null
    ? Math.max(0, Math.min(rawProgress * 100, 100))
    : Math.max(0, Math.min(((current - start) / (target - start)) * 100, 100));
  const profitColor = status.challenge_profit >= 0 ? "text-green-400" : "text-red-400";

  const gradientColor = progress < 30
    ? "from-red-500 to-red-400"
    : progress < 60
      ? "from-red-400 via-yellow-400 to-yellow-400"
      : "from-yellow-400 to-green-400";

  return (
    <Card>
      <CardHeader className="pb-1 px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs sm:text-sm uppercase tracking-widest">$100 → $1,000</CardTitle>
          <span className="text-xs text-muted-foreground">{progress.toFixed(1)}%</span>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6 space-y-2">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest">Equity</span>
            <p className="text-xl sm:text-2xl font-medium">${current.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest">Profit</span>
            <p className={`text-sm sm:text-lg font-medium ${profitColor}`}>
              {status.challenge_profit >= 0 ? "+" : ""}${status.challenge_profit.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="w-full h-2.5 bg-muted overflow-hidden border border-border">
            <div
              className={`h-full bg-gradient-to-r ${gradientColor} transition-all duration-700`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
            <span>$100</span>
            <span>$250</span>
            <span>$500</span>
            <span>$1K</span>
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
      <CardHeader className="pb-1 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-xs sm:text-sm uppercase tracking-widest">Live Prices</CardTitle>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {tickers.map((t) => (
            <div key={t.symbol} className="space-y-0.5">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground">{t.symbol}</span>
              <p className="text-[11px] sm:text-sm font-medium font-mono">
                ${t.price < 10 ? t.price.toFixed(4) : t.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Balance + Risk + Streaks ─────────────────────────────────

function BalanceCard({ status, botState }: { status: BotStatus; botState: BotState | null }) {
  const pnlColor = status.pnl >= 0 ? "text-green-400" : "text-red-400";
  const config = RISK_CONFIG[status.risk_mode] || RISK_CONFIG.MODERATE;

  return (
    <Card>
      <CardHeader className="pb-1 px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs sm:text-sm uppercase tracking-widest">Balance</CardTitle>
          <Badge variant="outline" className={`text-[10px] sm:text-xs px-1.5 py-0 ${config.color} ${config.bg} border-current`}>
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Available" value={`$${status.balance.toFixed(2)}`} />
          <Stat label="Positions" value={`$${status.positions_value.toFixed(2)}`} />
          <Stat label="Total PnL" value={`${status.pnl >= 0 ? "+" : ""}$${status.pnl.toFixed(2)}`} color={pnlColor} />
          <Stat
            label="Volatility"
            value={status.volatility_score < 1 ? "LOW" : status.volatility_score < 2 ? "MOD" : "HIGH"}
            color={status.volatility_score < 1 ? "text-green-400" : status.volatility_score < 2 ? "text-yellow-400" : "text-red-400"}
          />
        </div>

        {/* Streaks + Circuit Breaker */}
        {botState && (
          <div className="mt-3 pt-3 border-t border-border flex flex-wrap gap-3 sm:gap-4">
            {botState.win_streak > 0 && (
              <Stat label="Win Streak" value={`🔥 ${botState.win_streak}`} color="text-green-400" small />
            )}
            {botState.loss_streak > 0 && (
              <Stat label="Loss Streak" value={`💀 ${botState.loss_streak}`} color="text-red-400" small />
            )}
            {botState.circuit_breaker_active && (
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-red-400 font-medium uppercase">
                  Circuit Breaker ({botState.circuit_breaker_ticks_remaining} ticks)
                </span>
              </div>
            )}
            {!botState.circuit_breaker_active && botState.win_streak === 0 && botState.loss_streak === 0 && (
              <Stat label="Streaks" value="—" small />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Last Decision ────────────────────────────────────────────

function LastDecisionCard({ status }: { status: BotStatus }) {
  const d = status.last_decision;
  const actionColor =
    d.action === "BUY" ? "text-green-400 bg-green-400/10 border-green-400/30"
      : d.action === "SELL" ? "text-red-400 bg-red-400/10 border-red-400/30"
        : "text-muted-foreground bg-muted border-border";

  return (
    <Card>
      <CardHeader className="pb-1 px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs sm:text-sm uppercase tracking-widest">Last Decision</CardTitle>
          <Badge variant="outline" className={`text-xs px-2 py-0 ${actionColor}`}>
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

// ── Signal Comparison Panel ──────────────────────────────────

function SignalStats({ signals }: { signals: SignalsResponse }) {
  const total = signals.total_signals;
  const agreePct = total > 0 ? ((signals.agreement_count / total) * 100).toFixed(0) : "—";
  const bayesTotal = signals.bayes_wins + signals.bayes_losses;
  const bayesWinRate = bayesTotal > 0 ? ((signals.bayes_wins / bayesTotal) * 100).toFixed(0) : "—";
  const llmTotal = signals.llm_would_have_won + signals.llm_would_have_lost;
  const llmWinRate = llmTotal > 0 ? ((signals.llm_would_have_won / llmTotal) * 100).toFixed(0) : "—";
  const blockedSaves = signals.llm_would_have_lost;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 px-3 sm:px-4 py-2 border-b border-border">
      <Stat label="Signals" value={`${total}`} small />
      <Stat label="Agree" value={`${agreePct}%`} small />
      <Stat label="Bayes WR" value={`${bayesWinRate}%`} color={Number(bayesWinRate) >= 50 ? "text-green-400" : "text-red-400"} small />
      <Stat label="LLM WR" value={`${llmWinRate}%`} color={Number(llmWinRate) >= 50 ? "text-green-400" : "text-red-400"} small />
      <Stat label="Blocked Saves" value={`${blockedSaves}`} color="text-green-400" small />
    </div>
  );
}

function SignalRow({ s }: { s: Signal }) {
  const dirColor = s.llm_outcome === "Up" ? "text-green-400" : "text-red-400";
  const bayesDirColor = s.bayes_outcome === "Up" ? "text-green-400" : "text-red-400";
  const agreeColor = s.signals_agree ? "text-green-400" : "text-yellow-400";
  const resultColor = s.actual_winner === null ? "text-muted-foreground" : s.actual_winner === s.bayes_outcome ? "text-green-400" : "text-red-400";

  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 border-b border-border/50 text-[10px] sm:text-xs">
      <span className="text-muted-foreground">{timeAgo(s.timestamp)}</span>
      <span className="font-mono hidden sm:block">${s.btc_price.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
      <span className={dirColor}>{s.llm_outcome} ({(s.llm_confidence * 100).toFixed(0)}%)</span>
      <span className={bayesDirColor}>{s.bayes_outcome} ({s.bayes_edge_pct.toFixed(0)}%)</span>
      <span className={`${agreeColor} hidden sm:block`}>{s.signals_agree ? "✓" : "✗"}</span>
      <span className={`hidden sm:block ${s.executed ? "text-foreground" : "text-muted-foreground"}`}>
        {s.executed ? "YES" : "NO"}
      </span>
      <span className={`hidden sm:block ${s.executed ? "" : "text-muted-foreground"}`}>
        {s.executed ? `$${s.bayes_kelly_size.toFixed(1)}` : "—"}
      </span>
      <span className={resultColor}>
        {s.actual_winner ? (s.actual_winner === s.bayes_outcome ? "✓ WIN" : "✗ LOSS") : "⏳"}
      </span>
    </div>
  );
}

function SignalPanel({ signals }: { signals: SignalsResponse }) {
  return (
    <Card>
      <CardHeader className="pb-0 px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs sm:text-sm uppercase tracking-widest">Bayesian vs LLM</CardTitle>
          <span className="text-xs text-muted-foreground">{signals.executed_count} executed</span>
        </div>
      </CardHeader>
      <SignalStats signals={signals} />
      <CardContent className="p-0">
        {/* Header */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 sm:gap-2 px-3 sm:px-4 py-1 text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest border-b border-border">
          <span>Time</span>
          <span className="hidden sm:block">BTC</span>
          <span>LLM</span>
          <span>Bayes</span>
          <span className="hidden sm:block">Agree</span>
          <span className="hidden sm:block">Exec</span>
          <span className="hidden sm:block">Size</span>
          <span>Result</span>
        </div>
        <div className="max-h-[30vh] sm:max-h-[35vh] overflow-y-auto">
          {signals.signals.length === 0 ? (
            <p className="text-xs text-muted-foreground italic text-center py-6">No signals yet...</p>
          ) : (
            signals.signals.map((s, i) => <SignalRow key={`${s.market_id}-${i}`} s={s} />)
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Pending Trades ───────────────────────────────────────────

function PendingTradesCard({ botState }: { botState: BotState }) {
  const trades = [...(botState.pending_trades || []), ...(botState.positions || [])];

  return (
    <Card>
      <CardHeader className="pb-1 px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs sm:text-sm uppercase tracking-widest">Open Positions</CardTitle>
          <span className="text-xs text-muted-foreground">{trades.length}</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {trades.length === 0 ? (
          <p className="text-xs text-muted-foreground italic text-center py-4">No open positions</p>
        ) : (
          <div className="max-h-[25vh] overflow-y-auto">
            {trades.map((t, i) => (
              <div key={`${t.market_id}-${i}`} className="px-3 sm:px-4 py-2 border-b border-border/50">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-foreground/80 truncate flex-1">{t.outcome}</span>
                  <span className="text-xs font-mono">${t.size_usd.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[10px] text-muted-foreground">Entry: {t.entry_price.toFixed(2)}¢</span>
                  <span className="text-[10px] text-muted-foreground">BTC: ${t.btc_price.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  <span className="text-[10px] text-muted-foreground">{timeAgo(t.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Trade History ────────────────────────────────────────────

function TradeHistoryCard({ botState }: { botState: BotState }) {
  const trades = botState.trade_history || [];
  const wins = trades.filter(t => t.result === "WIN").length;
  const losses = trades.filter(t => t.result === "LOSS").length;
  const totalPnl = trades.reduce((sum, t) => sum + (t.pnl || 0), 0);

  return (
    <Card>
      <CardHeader className="pb-0 px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs sm:text-sm uppercase tracking-widest">Trade History</CardTitle>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-green-400">{wins}W</span>
            <span className="text-red-400">{losses}L</span>
            <span className={totalPnl >= 0 ? "text-green-400" : "text-red-400"}>
              {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {trades.length === 0 ? (
          <p className="text-xs text-muted-foreground italic text-center py-4">No trades yet...</p>
        ) : (
          <div className="max-h-[30vh] overflow-y-auto">
            {trades.map((t, i) => {
              const resultColor = t.result === "WIN" ? "text-green-400" : t.result === "LOSS" ? "text-red-400" : "text-yellow-400";
              const pnlColor = t.pnl >= 0 ? "text-green-400" : "text-red-400";
              return (
                <div key={`${t.market_id}-${i}`} className="px-3 sm:px-4 py-2 border-b border-border/50">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span className={`text-xs font-medium ${resultColor}`}>
                        {t.result === "WIN" ? "✓" : t.result === "LOSS" ? "✗" : "⏳"}
                      </span>
                      <span className="text-xs text-foreground/80 truncate">{t.outcome}</span>
                    </div>
                    <span className={`text-xs font-mono ${pnlColor}`}>
                      {t.pnl >= 0 ? "+" : ""}${t.pnl.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-[10px] text-muted-foreground">
                    <span>${t.size_usd.toFixed(2)}</span>
                    <span>{t.entry_price.toFixed(2)}¢ → {t.exit_price.toFixed(2)}¢</span>
                    <span>{timeAgo(t.timestamp)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
      <CardHeader className="pb-1 px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs sm:text-sm uppercase tracking-widest">Live Logs</CardTitle>
          <span className="text-xs text-muted-foreground">{totalLines.toLocaleString()} total</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {logs.length === 0 ? (
          <p className="text-xs text-muted-foreground italic text-center py-6">Waiting for logs...</p>
        ) : (
          <div className="max-h-[35vh] sm:max-h-[40vh] overflow-y-auto">
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
  const { status, logs, totalLogLines, signals, botState, connected, lastUpdated, loading, refetch } = usePolybot();

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
      <Navbar connected={connected} onRefresh={refetch} />

      <div className="flex-1 p-3 sm:p-4 space-y-3">
        {/* Challenge + Prices */}
        <ChallengeProgress status={status} />
        <PriceTickers status={status} />

        {/* Balance + Risk + Streaks + Circuit Breaker */}
        <BalanceCard status={status} botState={botState} />

        {/* Last Decision */}
        <LastDecisionCard status={status} />

        {/* Signal Comparison (only renders when /signals data available) */}
        {signals && <SignalPanel signals={signals} />}

        {/* Open Positions + Trade History (only renders when /state data available) */}
        {botState && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <PendingTradesCard botState={botState} />
            <TradeHistoryCard botState={botState} />
          </div>
        )}

        {/* Live Logs */}
        <LogFeed logs={logs} totalLines={totalLogLines} />
      </div>
    </div>
  );
}
