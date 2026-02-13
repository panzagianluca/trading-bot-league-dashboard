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
              Observing the void... no positions yet
            </p>
          </div>
        ) : (
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
                <TableRow className="text-xs uppercase tracking-widest">
                  <TableHead className="h-8 px-4">Market</TableHead>
                  <TableHead className="h-8">Side</TableHead>
                  <TableHead className="h-8 text-right">Size</TableHead>
                  <TableHead className="h-8 text-right">Entry</TableHead>
                  <TableHead className="h-8 text-right">PnL</TableHead>
                  <TableHead className="h-8 text-right">Opened</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((p, i) => {
                  const pnlColor = p.unrealized_pnl_usd >= 0 ? "text-green-400" : "text-red-400";
                  const shortMarket = p.market_id.length > 10
                    ? `${p.market_id.slice(0, 6)}...${p.market_id.slice(-4)}`
                    : p.market_id;
                  const openedAgo = p.opened_at
                    ? `${Math.round((Date.now() - new Date(p.opened_at).getTime()) / 60000)}m ago`
                    : "—";
                  return (
                    <TableRow key={`${p.market_id}-${i}`} className="text-sm">
                      <TableCell className="px-4 py-2 font-medium font-mono">{shortMarket}</TableCell>
                      <TableCell className="py-2">
                        <Badge
                          variant={p.side === "BUY" ? "default" : "secondary"}
                          className="text-xs px-1.5 py-0"
                        >
                          {p.side}
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
