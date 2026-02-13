"use client";

import { Position } from "@/lib/mock-data";
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

export function PositionsTable({ positions }: { positions: Position[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs uppercase tracking-widest">Open Positions</CardTitle>
          <span className="text-xs text-muted-foreground">{positions.length} active</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="text-[10px] uppercase tracking-widest">
              <TableHead className="h-8 px-4">Asset</TableHead>
              <TableHead className="h-8">Horizon</TableHead>
              <TableHead className="h-8">Side</TableHead>
              <TableHead className="h-8 text-right">Size</TableHead>
              <TableHead className="h-8 text-right">Entry</TableHead>
              <TableHead className="h-8 text-right">Current</TableHead>
              <TableHead className="h-8 text-right">PnL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions.map((p, i) => {
              const pnlColor = p.unrealized_pnl >= 0 ? "text-green-400" : "text-red-400";
              return (
                <TableRow key={i} className="text-xs">
                  <TableCell className="px-4 py-2 font-medium">{p.asset}</TableCell>
                  <TableCell className="py-2">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {p.horizon}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2">
                    <Badge
                      variant={p.side === "BUY" ? "default" : "secondary"}
                      className="text-[10px] px-1.5 py-0"
                    >
                      {p.side}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2 text-right">${p.size_usd.toFixed(2)}</TableCell>
                  <TableCell className="py-2 text-right">{p.entry_price.toFixed(2)}</TableCell>
                  <TableCell className="py-2 text-right">{p.current_price.toFixed(2)}</TableCell>
                  <TableCell className={`py-2 text-right font-medium ${pnlColor}`}>
                    {p.unrealized_pnl >= 0 ? "+" : ""}{p.unrealized_pnl.toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
