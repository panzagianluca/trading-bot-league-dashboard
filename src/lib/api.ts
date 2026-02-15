const API_BASE = "https://d0kusks0flg5.share.zrok.io";

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
  challenge_progress: number;
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

export async function fetchHealth(): Promise<{ status: string }> {
  const res = await fetch(bust(`${API_BASE}/health`), NO_CACHE);
  if (!res.ok) throw new Error(`Health: ${res.status}`);
  return res.json();
}
