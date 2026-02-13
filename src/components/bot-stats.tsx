"use client";

import { BotData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="space-y-0.5">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <p className={`text-sm font-medium ${color || ""}`}>{value}</p>
    </div>
  );
}

export function BotStats({ bot }: { bot: BotData }) {
  const pnlColor = bot.total_pnl_usd >= 0 ? "text-green-400" : "text-red-400";
  const realizedColor = bot.realized_pnl_usd >= 0 ? "text-green-400" : "text-red-400";
  const unrealizedColor = bot.unrealized_pnl_usd >= 0 ? "text-green-400" : "text-red-400";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs uppercase tracking-widest">Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4">
          <Stat label="Equity" value={`$${bot.equity_usd.toFixed(2)}`} />
          <Stat label="Cash" value={`$${bot.cash_usd.toFixed(2)}`} />
          <Stat
            label="Total PnL"
            value={`${bot.total_pnl_usd >= 0 ? "+" : ""}$${bot.total_pnl_usd.toFixed(2)}`}
            color={pnlColor}
          />
          <Stat
            label="Profit Factor"
            value={bot.profit_factor.toFixed(2)}
            color={bot.profit_factor >= 1 ? "text-green-400" : "text-red-400"}
          />
          <Stat
            label="Realized"
            value={`${bot.realized_pnl_usd >= 0 ? "+" : ""}$${bot.realized_pnl_usd.toFixed(2)}`}
            color={realizedColor}
          />
          <Stat
            label="Unrealized"
            value={`${bot.unrealized_pnl_usd >= 0 ? "+" : ""}$${bot.unrealized_pnl_usd.toFixed(2)}`}
            color={unrealizedColor}
          />
          <Stat
            label="Win Rate"
            value={`${(bot.win_rate * 100).toFixed(1)}%`}
            color={bot.win_rate >= 0.5 ? "text-green-400" : "text-red-400"}
          />
          <Stat label="Trades" value={`${bot.winning_trades}W / ${bot.losing_trades}L`} />
          <Stat label="Max Drawdown" value={`${bot.max_drawdown_pct.toFixed(1)}%`} color="text-red-400" />
          <Stat label="Gross Profit" value={`$${bot.gross_profit_usd.toFixed(2)}`} color="text-green-400" />
          <Stat label="Gross Loss" value={`$${bot.gross_loss_usd.toFixed(2)}`} color="text-red-400" />
          <Stat label="Tools/Tick" value={`${bot.tools_called_last_tick}`} />
        </div>
      </CardContent>
    </Card>
  );
}
