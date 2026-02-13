"use client";

import { EquitySnapshot } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PnlChart({ data }: { data: EquitySnapshot[] }) {
  if (data.length < 2) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs uppercase tracking-widest">PnL History</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <p className="text-xs text-muted-foreground italic">
            Awaiting history...
          </p>
        </CardContent>
      </Card>
    );
  }

  const values = data.map((d) => d.equity_usd);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 0.01;
  const height = 140;
  const width = 100;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d.equity_usd - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const lastVal = values[values.length - 1];
  const firstVal = values[0];
  const change = lastVal - firstVal;
  const changePct = firstVal > 0 ? ((change / firstVal) * 100).toFixed(1) : "0.0";
  const isUp = change >= 0;
  const strokeColor = isUp ? "#4ade80" : "#f87171";

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs uppercase tracking-widest">PnL History</CardTitle>
          <span className={`text-xs ${isUp ? "text-green-400" : "text-red-400"}`}>
            {isUp ? "+" : ""}{changePct}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col pb-3">
        <div className="flex items-end justify-between mb-2">
          <span className="text-lg font-medium">${lastVal.toFixed(2)}</span>
          <span className={`text-xs ${isUp ? "text-green-400" : "text-red-400"}`}>
            {isUp ? "+" : ""}{change.toFixed(4)}
          </span>
        </div>
        <div className="flex-1 min-h-0">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.5"
              points={points}
              vectorEffect="non-scaling-stroke"
            />
            <polyline
              fill={isUp ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)"}
              stroke="none"
              points={`0,${height} ${points} ${width},${height}`}
            />
          </svg>
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>{new Date(data[0].ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          <span>{new Date(data[data.length - 1].ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </CardContent>
    </Card>
  );
}
