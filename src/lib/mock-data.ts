export interface BotDecision {
  tick_ts: string;
  selected_strategy: string;
  thesis: string;
  confidence: number;
  action: "BUY" | "SELL" | "HOLD";
  market_id: string;
  asset: "BTC" | "ETH" | "SOL" | "XRP";
  horizon_minutes: 5 | 15;
  size_usd: number;
  risk_budget_pct: number;
  data_sources_used: string[];
  news_catalyst: string | null;
  invalidation_condition: string;
  diary_note: string;
}

export interface Position {
  market_id: string;
  asset: string;
  horizon: string;
  side: "BUY" | "SELL";
  size_usd: number;
  entry_price: number;
  current_price: number;
  unrealized_pnl: number;
  opened_at: string;
}

export interface DiaryEntry {
  id: number;
  round_id: number;
  entry_type: "TRADE" | "REFLECTION" | "LESSON" | "SUMMARY";
  content: string;
  created_at: string;
}

export interface EquitySnapshot {
  timestamp: string;
  equity: number;
}

export interface BotData {
  id: number;
  name: string;
  status: "ACTIVE" | "KILLED";
  equity_usd: number;
  cash_usd: number;
  weekly_pnl_usd: number;
  total_pnl_usd: number;
  realized_pnl_usd: number;
  unrealized_pnl_usd: number;
  gross_profit_usd: number;
  gross_loss_usd: number;
  profit_factor: number;
  win_rate: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  max_drawdown_pct: number;
  rank: number;
  survival_gap_usd: number;
  tools_called_last_tick: number;
  last_action: "BUY" | "SELL" | "HOLD";
  last_asset: string;
  last_strategy: string;
  last_confidence: number;
  last_diary_note: string;
  last_news_catalyst: string | null;
  positions: Position[];
  recent_decisions: BotDecision[];
  diary_entries: DiaryEntry[];
  equity_history: EquitySnapshot[];
  self_profile: {
    preferred_strategies: string[];
    risk_style: string;
    strengths: string;
    weaknesses: string;
    lessons: string[];
    playbook_weights: Record<string, number>;
  } | null;
}

export interface LeagueContext {
  round_id: number;
  round_start: string;
  round_end: string;
  time_left_hours: number;
  active_bots: number;
  killed_bots: number;
  total_equity_usd: number;
  total_pnl_usd: number;
  elimination_cutoff_rank: number;
  cutoff_weekly_pnl_usd: number;
}

function generateEquityHistory(): EquitySnapshot[] {
  const points: EquitySnapshot[] = [];
  let equity = 10;
  const now = Date.now();
  for (let i = 48; i >= 0; i--) {
    const timestamp = new Date(now - i * 30 * 60 * 1000).toISOString();
    equity += (Math.random() - 0.48) * 0.15;
    equity = Math.max(equity * 0.95, equity);
    points.push({ timestamp, equity: parseFloat(equity.toFixed(4)) });
  }
  return points;
}

export const mockLeague: LeagueContext = {
  round_id: 1,
  round_start: "2026-02-10T00:00:00Z",
  round_end: "2026-02-17T00:00:00Z",
  time_left_hours: 82.4,
  active_bots: 20,
  killed_bots: 0,
  total_equity_usd: 203.47,
  total_pnl_usd: 3.47,
  elimination_cutoff_rank: 16,
  cutoff_weekly_pnl_usd: -0.61,
};

export const mockBot: BotData = {
  id: 1,
  name: "BOT-01",
  status: "ACTIVE",
  equity_usd: 10.83,
  cash_usd: 7.21,
  weekly_pnl_usd: 0.83,
  total_pnl_usd: 0.83,
  realized_pnl_usd: 0.71,
  unrealized_pnl_usd: 0.12,
  gross_profit_usd: 1.94,
  gross_loss_usd: 1.11,
  profit_factor: 1.75,
  win_rate: 0.583,
  total_trades: 12,
  winning_trades: 7,
  losing_trades: 5,
  max_drawdown_pct: 4.2,
  rank: 5,
  survival_gap_usd: 1.44,
  tools_called_last_tick: 6,
  last_action: "BUY",
  last_asset: "BTC",
  last_strategy: "momentum_breakout",
  last_confidence: 0.72,
  last_diary_note: "Strong momentum on BTC 15m with volume confirmation. Entry at favorable spread.",
  last_news_catalyst: "Bitcoin breaks $105k resistance on ETF inflow data",
  positions: [
    {
      market_id: "0xabc123",
      asset: "BTC",
      horizon: "15m",
      side: "BUY",
      size_usd: 2.10,
      entry_price: 0.54,
      current_price: 0.58,
      unrealized_pnl: 0.16,
      opened_at: "2026-02-13T08:15:00Z",
    },
    {
      market_id: "0xdef456",
      asset: "ETH",
      horizon: "5m",
      side: "SELL",
      size_usd: 1.52,
      entry_price: 0.47,
      current_price: 0.44,
      unrealized_pnl: 0.09,
      opened_at: "2026-02-13T08:30:00Z",
    },
    {
      market_id: "0xghi789",
      asset: "SOL",
      horizon: "15m",
      side: "BUY",
      size_usd: 0.90,
      entry_price: 0.51,
      current_price: 0.49,
      unrealized_pnl: -0.04,
      opened_at: "2026-02-13T08:45:00Z",
    },
  ],
  recent_decisions: [
    {
      tick_ts: "2026-02-13T09:00:00Z",
      selected_strategy: "momentum_breakout",
      thesis: "BTC 15m showing strong upward momentum with volume spike",
      confidence: 0.72,
      action: "BUY",
      market_id: "0xabc123",
      asset: "BTC",
      horizon_minutes: 15,
      size_usd: 2.10,
      risk_budget_pct: 2.1,
      data_sources_used: ["get_updown_markets", "get_orderbook", "search_news", "estimate_slippage", "get_recent_trades", "get_onchain_flows"],
      news_catalyst: "Bitcoin breaks $105k resistance on ETF inflow data",
      invalidation_condition: "Price drops below $104.5k within 5 minutes",
      diary_note: "Strong momentum on BTC 15m with volume confirmation.",
    },
    {
      tick_ts: "2026-02-13T08:45:00Z",
      selected_strategy: "mean_reversion",
      thesis: "ETH 5m overextended, expecting pullback",
      confidence: 0.61,
      action: "SELL",
      market_id: "0xdef456",
      asset: "ETH",
      horizon_minutes: 5,
      size_usd: 1.52,
      risk_budget_pct: 1.5,
      data_sources_used: ["get_updown_markets", "get_orderbook", "get_market_history", "estimate_slippage"],
      news_catalyst: null,
      invalidation_condition: "ETH reclaims $3,850 level",
      diary_note: "Fading overextension. Tight stop.",
    },
    {
      tick_ts: "2026-02-13T08:30:00Z",
      selected_strategy: "event_driven",
      thesis: "SOL upgrade announcement expected, positioning early",
      confidence: 0.55,
      action: "BUY",
      market_id: "0xghi789",
      asset: "SOL",
      horizon_minutes: 15,
      size_usd: 0.90,
      risk_budget_pct: 0.9,
      data_sources_used: ["search_news", "get_updown_markets", "get_orderbook"],
      news_catalyst: "Solana v2.1 upgrade vote scheduled for today",
      invalidation_condition: "No announcement within 30 minutes",
      diary_note: "Small speculative position on catalyst.",
    },
    {
      tick_ts: "2026-02-13T08:15:00Z",
      selected_strategy: "hold",
      thesis: "No clear setup in allowed universe",
      confidence: 0.30,
      action: "HOLD",
      market_id: "",
      asset: "BTC",
      horizon_minutes: 5,
      size_usd: 0,
      risk_budget_pct: 0,
      data_sources_used: ["get_updown_markets", "get_orderbook"],
      news_catalyst: null,
      invalidation_condition: "",
      diary_note: "Markets thin. Waiting for better setup.",
    },
  ],
  diary_entries: [
    {
      id: 1,
      round_id: 1,
      entry_type: "TRADE",
      content: "Entered BTC 15m UP at 0.54. Momentum thesis with ETF flow catalyst. Spread was tight (32bps). Confident.",
      created_at: "2026-02-13T08:15:00Z",
    },
    {
      id: 2,
      round_id: 1,
      entry_type: "TRADE",
      content: "Shorted ETH 5m at 0.47. Overextended on low volume. Mean reversion play. Small size.",
      created_at: "2026-02-13T08:30:00Z",
    },
    {
      id: 3,
      round_id: 1,
      entry_type: "LESSON",
      content: "Slippage on SOL markets is consistently worse than BTC/ETH. Need to size down 30% or skip entirely when depth < $300.",
      created_at: "2026-02-13T07:00:00Z",
    },
    {
      id: 4,
      round_id: 1,
      entry_type: "REFLECTION",
      content: "Round 1 Day 3: Developing a preference for momentum on BTC and mean reversion on ETH. SOL has been unreliable. XRP untouched — need to research.",
      created_at: "2026-02-13T00:00:00Z",
    },
    {
      id: 5,
      round_id: 1,
      entry_type: "SUMMARY",
      content: "Day 2 summary: 4 trades, 3 wins, 1 loss. Net +$0.31. Best trade was BTC 15m momentum (+$0.18). Worst was SOL 5m (-$0.07). Learning: stick to BTC/ETH for now.",
      created_at: "2026-02-12T23:59:00Z",
    },
  ],
  equity_history: generateEquityHistory(),
  self_profile: {
    preferred_strategies: ["momentum_breakout", "mean_reversion"],
    risk_style: "Moderate. Aggressive on high-conviction BTC setups, conservative otherwise.",
    strengths: "Good at timing BTC momentum entries. Disciplined on spread checks.",
    weaknesses: "Tendency to overtrade SOL despite poor liquidity. Needs to be more patient.",
    lessons: [
      "Slippage kills small edges — only trade when depth > $500",
      "BTC 15m has better risk/reward than 5m due to lower fee impact",
      "News catalysts within 30min of market open have highest hit rate",
      "HOLD is a valid strategy — no trade is better than a bad trade",
    ],
    playbook_weights: {
      momentum_breakout: 0.40,
      mean_reversion: 0.30,
      event_driven: 0.20,
      contrarian: 0.10,
    },
  },
};
