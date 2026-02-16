// Proxied through Next.js rewrites to avoid CORS
const API_BASE = "/api/bot";

// ── Types ──────────────────────────────────────────────────────

export interface LastDecision {
  action: "BUY" | "SELL" | "HOLD";
  reasoning: string;
}

export interface BotStatus {
  balance: number;
  positions_value: number;
  total_equity: number;
  pnl: number;
  btc_price: number;
  eth_price: number;
  sol_price: number;
  xrp_price: number;
  challenge_progress: number | null;
  challenge_profit: number;
  risk_mode: "ULTRA_CONSERVATIVE" | "CONSERVATIVE" | "MODERATE" | "AGGRESSIVE" | "HOUSE_MONEY";
  volatility_score: number;
  last_decision: LastDecision;
}

export interface LogsResponse {
  logs: string[];
  total_lines: number;
}

export type RiskMode = BotStatus["risk_mode"];

// ── Signal Types ───────────────────────────────────────────────

export interface Signal {
  timestamp: string;
  market_id: string;
  market_question: string;
  btc_price: number;
  open_price: number;
  llm_action: "BUY" | "SELL" | "HOLD";
  llm_outcome: "Up" | "Down";
  llm_confidence: number;
  bayes_outcome: "Up" | "Down";
  bayes_posterior: number;
  bayes_edge: number;
  bayes_edge_pct: number;
  bayes_has_edge: boolean;
  bayes_kelly_size: number;
  signals_agree: boolean;
  executed: boolean;
  execution_reason: string;
  resolved: boolean;
  actual_winner: "Up" | "Down" | null;
}

export interface SignalsResponse {
  signals: Signal[];
  total_signals: number;
  agreement_count: number;
  executed_count: number;
  bayes_wins: number;
  bayes_losses: number;
  llm_would_have_won: number;
  llm_would_have_lost: number;
}

// ── State Types ────────────────────────────────────────────────

export interface PendingTrade {
  market_id: string;
  market_question: string;
  outcome: string;
  entry_price: number;
  size_usd: number;
  btc_price: number;
  timestamp: string;
}

export interface TradeHistoryEntry {
  market_id: string;
  market_question: string;
  outcome: string;
  entry_price: number;
  exit_price: number;
  size_usd: number;
  pnl: number;
  result: "WIN" | "LOSS" | "OPEN";
  timestamp: string;
}

export interface BotState {
  pending_trades: PendingTrade[];
  positions: PendingTrade[];
  trade_history: TradeHistoryEntry[];
  reflections: string[];
  win_streak: number;
  loss_streak: number;
  circuit_breaker_active: boolean;
  circuit_breaker_ticks_remaining: number;
}

// ── Fetchers ───────────────────────────────────────────────────

function bust(url: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}_t=${Date.now()}`;
}

const NO_CACHE: RequestInit = {
  cache: "no-store",
  headers: { "Cache-Control": "no-cache" },
};

export async function fetchStatus(): Promise<BotStatus> {
  const res = await fetch(bust(`${API_BASE}/status`), NO_CACHE);
  if (!res.ok) throw new Error(`Status: ${res.status}`);
  return res.json();
}

export async function fetchLogs(lines = 50): Promise<LogsResponse> {
  const res = await fetch(bust(`${API_BASE}/logs?lines=${lines}`), NO_CACHE);
  if (!res.ok) throw new Error(`Logs: ${res.status}`);
  return res.json();
}

export async function fetchSignals(): Promise<SignalsResponse> {
  const res = await fetch(bust(`${API_BASE}/signals`), NO_CACHE);
  if (!res.ok) throw new Error(`Signals: ${res.status}`);
  return res.json();
}

export async function fetchState(): Promise<BotState> {
  const res = await fetch(bust(`${API_BASE}/state`), NO_CACHE);
  if (!res.ok) throw new Error(`State: ${res.status}`);
  return res.json();
}

export async function fetchHealth(): Promise<{ status: string }> {
  const res = await fetch(bust(`${API_BASE}/health`), NO_CACHE);
  if (!res.ok) throw new Error(`Health: ${res.status}`);
  return res.json();
}
