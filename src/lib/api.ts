const API_BASE = "https://naturals-vanilla-described-prisoners.trycloudflare.com";

// ── Types ──────────────────────────────────────────────────────

export interface SelfProfile {
  round: number;
  risk_style: string;
  lessons: string[];
  strengths: string;
  weaknesses: string | null;
  min_confidence: number;
  max_position_pct: number;
  playbook_weights: {
    momentum: number;
    contrarian: number;
    event_driven: number;
    mean_reversion: number;
  };
  preferred_markets: string[];
  preferred_horizons: number[];
  preferred_strategies: string[];
  updated_at: string;
}

export interface BotStatus {
  id: number;
  name: string;
  status: "ACTIVE" | "KILLED" | "PAUSED";
  self_profile: string; // JSON string — parse with parseSelfProfile
  created_at: string;
  equity_usd: number;
  cash_usd: number;
  unrealized_pnl_usd: number;
}

export interface Portfolio {
  bot_id: number;
  status: string;
  equity_usd: number;
  cash_usd: number;
  unrealized_pnl_usd: number;
  last_updated: string;
  positions: Position[];
}

export interface Position {
  id: number;
  market_id: string;
  asset: string;
  side: "BUY" | "SELL";
  size_usd: number;
  entry_price: number;
  current_price: number;
  unrealized_pnl: number;
}

export interface Decision {
  id: number;
  round_id: number;
  tick_ts: string;
  selected_strategy: string | null;
  thesis: string;
  confidence: number | null;
  action: "HOLD" | "BUY" | "SELL";
  market_id: string;
  asset: string;
  horizon_minutes: number;
  size_usd: number | null;
  risk_budget_pct: number | null;
  data_sources_used: string[] | null;
  news_catalyst: string | null;
  invalidation_condition: string | null;
  time_stop_minutes: number | null;
  next_review_minutes: number | null;
  diary_note: string;
  raw_output: string;
}

export interface ReflectionMetadata {
  lessons: string[];
  reflection: string;
  equity_at_reflection: number;
}

export interface DiaryEntry {
  id: number;
  round_id: number;
  entry_type: "REFLECTION" | "LESSON" | "MILESTONE";
  content: string;
  metadata: string; // JSON string — parse with parseReflectionMetadata
  created_at: string;
}

export interface EquitySnapshot {
  ts: string;
  equity_usd: number;
  cash_usd: number;
  unrealized_pnl_usd: number;
}

export interface LeagueStats {
  round_id: number;
  round_name: string;
  days_left: number;
  total_equity_usd: number;
  total_cash_usd: number;
  total_pnl_usd: number;
  total_unrealized_pnl_usd: number;
  bots_active: number;
  bots_killed: number;
  bots_total: number;
}

export interface BotSummary {
  id: number;
  name: string;
  status: "ACTIVE" | "KILLED" | "PAUSED";
  equity_usd: number;
  cash_usd: number;
  unrealized_pnl_usd: number;
  pnl_usd: number;
  last_action: string;
  last_tick_ts: string;
  risk_style: string;
  killed_at: string | null;
}

// ── Parsers ────────────────────────────────────────────────────

export function parseSelfProfile(raw: string): SelfProfile | null {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function parseReflectionMetadata(raw: string): ReflectionMetadata | null {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ── Fetchers ───────────────────────────────────────────────────

export async function fetchBotStatus(botId = 1): Promise<BotStatus> {
  const res = await fetch(`${API_BASE}/api/bots/${botId}`);
  if (!res.ok) throw new Error(`Bot status: ${res.status}`);
  return res.json();
}

export async function fetchPortfolio(botId = 1): Promise<Portfolio> {
  const res = await fetch(`${API_BASE}/api/bots/${botId}/portfolio`);
  if (!res.ok) throw new Error(`Portfolio: ${res.status}`);
  return res.json();
}

export async function fetchDecisions(botId = 1, limit = 20): Promise<Decision[]> {
  const res = await fetch(`${API_BASE}/api/bots/${botId}/decisions?limit=${limit}`);
  if (!res.ok) throw new Error(`Decisions: ${res.status}`);
  return res.json();
}

export async function fetchDiary(botId = 1, limit = 10): Promise<DiaryEntry[]> {
  const res = await fetch(`${API_BASE}/api/bots/${botId}/diary?limit=${limit}`);
  if (!res.ok) throw new Error(`Diary: ${res.status}`);
  return res.json();
}

// ── Real endpoint fetchers ─────────────────────────────────────

export async function fetchAllBots(): Promise<BotSummary[]> {
  const res = await fetch(`${API_BASE}/api/bots`);
  if (!res.ok) throw new Error(`Bots list: ${res.status}`);
  return res.json();
}

export async function fetchEquityHistory(botId = 1): Promise<EquitySnapshot[]> {
  const res = await fetch(`${API_BASE}/api/bots/${botId}/equity-history`);
  if (!res.ok) throw new Error(`Equity history: ${res.status}`);
  return res.json();
}

export async function fetchLeagueStats(): Promise<LeagueStats> {
  const res = await fetch(`${API_BASE}/api/league/stats`);
  if (!res.ok) throw new Error(`League stats: ${res.status}`);
  return res.json();
}
