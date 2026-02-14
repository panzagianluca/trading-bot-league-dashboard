"use client";

import { Position } from "@/lib/api";
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

export function PositionsTable({ positions }: { positions: Position[] }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm uppercase tracking-widest">Open Positions</CardTitle>
          <span className="text-sm text-muted-foreground">{positions.length} active</span>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        {positions.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground italic">
              No positions open
            </p>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
                <TableRow className="text-xs uppercase tracking-widest">
                  <TableHead className="h-8 px-4">Asset</TableHead>
                  <TableHead className="h-8">Dir</TableHead>
                  <TableHead className="h-8 text-right">Size</TableHead>
                  <TableHead className="h-8 text-right">Entry</TableHead>
                  <TableHead className="h-8 text-right">PnL</TableHead>
                  <TableHead className="h-8 text-right">Opened</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((p, i) => {
                  const pnlColor = p.unrealized_pnl_usd >= 0 ? "text-green-400" : "text-red-400";
                  const openedAgo = p.opened_at
                    ? `${Math.round((Date.now() - new Date(p.opened_at).getTime()) / 60000)}m ago`
                    : "\u2014";
                  const dir = p.direction || "UP";
                  const asset = p.asset || "?";
                  const horizon = p.horizon_minutes || "?";
                  return (
                    <TableRow key={`${p.market_id}-${i}`} className="text-sm">
                      <TableCell className="px-4 py-2 font-medium">{asset} {horizon}m</TableCell>
                      <TableCell className="py-2">
                        <Badge variant="outline" className={`text-xs px-1.5 py-0 ${directionStyle[dir] || ""}`}>
                          {dir === "UP" ? "\u2191" : "\u2193"} {dir}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 text-right">${p.size_usd.toFixed(2)}</TableCell>
                      <TableCell className="py-2 text-right">{p.avg_entry_price.toFixed(2)}</TableCell>
                      <TableCell className={`py-2 text-right font-medium ${pnlColor}`}>
                        {p.unrealized_pnl_usd >= 0 ? "+" : ""}${p.unrealized_pnl_usd.toFixed(2)}
                      </TableCell>
                      <TableCell className="py-2 text-right text-muted-foreground">{openedAgo}</TableCell>
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
