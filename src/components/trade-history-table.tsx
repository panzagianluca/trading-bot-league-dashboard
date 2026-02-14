"use client";

import { TradeHistory, TradeHistoryItem } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const directionStyle = {
  UP: "text-green-400 bg-green-400/10 border-green-400/30",
  DOWN: "text-red-400 bg-red-400/10 border-red-400/30",
};

const actionStyle: Record<string, string> = {
  BUY: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  SELL: "text-orange-400 bg-orange-400/10 border-orange-400/30",
  CLAIMED: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  HOLDING: "text-muted-foreground bg-muted border-border",
};

const outcomeStyle: Record<string, { color: string; label: string }> = {
  WON: { color: "text-green-400", label: "\u2713 WON" },
  LOST: { color: "text-red-400", label: "\u2717 LOST" },
  OPEN: { color: "text-yellow-400", label: "\u23F3 OPEN" },
  REJECTED: { color: "text-muted-foreground", label: "\u2298 REJECTED" },
  SOLD_EARLY: { color: "text-orange-400", label: "\u21A9 SOLD" },
};

function timeAgo(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

function SummaryRow({ summary }: { summary: TradeHistory["summary"] }) {
  return (
    <div className="grid grid-cols-4 gap-3 px-4 py-2 border-b border-border">
      <div className="space-y-0.5">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Trades</span>
        <p className="text-sm font-medium">{summary.total_orders}</p>
      </div>
      <div className="space-y-0.5">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Win Rate</span>
        <p className={`text-sm font-medium ${summary.win_rate >= 50 ? "text-green-400" : "text-red-400"}`}>
          {summary.win_rate.toFixed(1)}%
        </p>
      </div>
      <div className="space-y-0.5">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">W / L</span>
        <p className="text-sm font-medium">
          <span className="text-green-400">{summary.total_won}</span>
          {" / "}
          <span className="text-red-400">{summary.total_lost}</span>
        </p>
      </div>
      <div className="space-y-0.5">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Direction</span>
        <p className="text-sm font-medium">
          <span className="text-green-400">{summary.direction_up}</span>
          {" \u2191 "}
          <span className="text-red-400">{summary.direction_down}</span>
          {" \u2193"}
        </p>
      </div>
    </div>
  );
}

export function TradeHistoryTable({ tradeHistory }: { tradeHistory: TradeHistory | null }) {
  if (!tradeHistory) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2 shrink-0">
          <CardTitle className="text-sm uppercase tracking-widest">Trade History</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground italic">Loading trades...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-0 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm uppercase tracking-widest">Trade History</CardTitle>
          <span className="text-sm text-muted-foreground">
            {tradeHistory.summary.open_positions} open
          </span>
        </div>
      </CardHeader>
      <SummaryRow summary={tradeHistory.summary} />
      <CardContent className="p-0 flex-1 min-h-0">
        {tradeHistory.history.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground italic">No trades yet...</p>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
                <TableRow className="text-xs uppercase tracking-widest">
                  <TableHead className="h-8 px-4">Time</TableHead>
                  <TableHead className="h-8">Asset</TableHead>
                  <TableHead className="h-8">Dir</TableHead>
                  <TableHead className="h-8">Action</TableHead>
                  <TableHead className="h-8 text-right">Size</TableHead>
                  <TableHead className="h-8 text-right">Price</TableHead>
                  <TableHead className="h-8">Outcome</TableHead>
                  <TableHead className="h-8 text-right">PnL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tradeHistory.history.map((t, i) => {
                  const oc = outcomeStyle[t.outcome] || outcomeStyle.OPEN;
                  const pnlColor = t.realized_pnl_usd === null
                    ? "text-muted-foreground"
                    : t.realized_pnl_usd >= 0
                      ? "text-green-400"
                      : "text-red-400";
                  return (
                    <TableRow key={`${t.id}-${i}`} className="text-sm">
                      <TableCell className="px-4 py-2 text-muted-foreground">{timeAgo(t.timestamp)}</TableCell>
                      <TableCell className="py-2 font-medium">{t.asset} {t.horizon_minutes}m</TableCell>
                      <TableCell className="py-2">
                        <Badge variant="outline" className={`text-xs px-1.5 py-0 ${directionStyle[t.direction]}`}>
                          {t.direction === "UP" ? "\u2191" : "\u2193"} {t.direction}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2">
                        <Badge variant="outline" className={`text-xs px-1.5 py-0 ${actionStyle[t.action] || ""}`}>
                          {t.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 text-right">${t.size_usd.toFixed(2)}</TableCell>
                      <TableCell className="py-2 text-right">{t.price.toFixed(2)}</TableCell>
                      <TableCell className="py-2">
                        <span className={`text-xs font-medium ${oc.color}`}>{oc.label}</span>
                      </TableCell>
                      <TableCell className={`py-2 text-right font-medium ${pnlColor}`}>
                        {t.realized_pnl_usd !== null
                          ? `${t.realized_pnl_usd >= 0 ? "+" : ""}$${t.realized_pnl_usd.toFixed(2)}`
                          : "\u2014"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
