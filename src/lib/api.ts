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

// ── Placeholder fetchers (will use real endpoints later) ──────

export async function fetchAllBots(): Promise<BotSummary[]> {
  // TODO: Replace with GET /api/bots when available
  // For now, fetch the single bot we have
  try {
    const bot = await fetchBotStatus(1);
    const profile = parseSelfProfile(bot.self_profile);
    const decisions = await fetchDecisions(1, 1);
    return [{
      id: bot.id,
      name: bot.name,
      status: bot.status,
      equity_usd: bot.equity_usd,
      cash_usd: bot.cash_usd,
      unrealized_pnl_usd: bot.unrealized_pnl_usd,
      pnl_usd: bot.equity_usd - 10,
      last_action: decisions[0]?.action || "HOLD",
      last_tick_ts: decisions[0]?.tick_ts || bot.created_at,
      risk_style: profile?.risk_style || "unknown",
    }];
  } catch {
    return [];
  }
}

export async function fetchEquityHistory(botId = 1): Promise<EquitySnapshot[]> {
  // TODO: Replace with GET /api/bots/{id}/equity-history when available
  // For now, extract from diary equity_at_reflection
  try {
    const diary = await fetchDiary(botId, 50);
    const snapshots: EquitySnapshot[] = [];
    for (const entry of diary) {
      const meta = parseReflectionMetadata(entry.metadata);
      if (meta?.equity_at_reflection != null) {
        snapshots.push({
          ts: entry.created_at,
          equity_usd: meta.equity_at_reflection,
        });
      }
    }
    // Sort chronologically
    snapshots.sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());
    return snapshots;
  } catch {
    return [];
  }
}

export async function fetchLeagueStats(): Promise<LeagueStats> {
  // TODO: Replace with GET /api/league/stats when available
  try {
    const bots = await fetchAllBots();
    return {
      round_id: 1,
      round_name: "Week 1",
      days_left: 5,
      total_equity_usd: bots.reduce((s, b) => s + b.equity_usd, 0),
      total_cash_usd: bots.reduce((s, b) => s + b.cash_usd, 0),
      total_pnl_usd: bots.reduce((s, b) => s + b.pnl_usd, 0),
      total_unrealized_pnl_usd: bots.reduce((s, b) => s + b.unrealized_pnl_usd, 0),
      bots_active: bots.filter((b) => b.status === "ACTIVE").length,
      bots_killed: bots.filter((b) => b.status === "KILLED").length,
    };
  } catch {
    return {
      round_id: 1, round_name: "Week 1", days_left: 0,
      total_equity_usd: 0, total_cash_usd: 0, total_pnl_usd: 0,
      total_unrealized_pnl_usd: 0, bots_active: 0, bots_killed: 0,
    };
  }
}
