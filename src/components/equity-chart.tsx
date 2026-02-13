"use client";

import { EquitySnapshot } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EquityChart({ data }: { data: EquitySnapshot[] }) {
  if (data.length < 2) return null;

  const values = data.map((d) => d.equity);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const height = 120;
  const width = 100;

  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d.equity - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const lastVal = values[values.length - 1];
  const firstVal = values[0];
  const change = lastVal - firstVal;
  const changePct = ((change / firstVal) * 100).toFixed(1);
  const isUp = change >= 0;
  const strokeColor = isUp ? "#4ade80" : "#f87171";

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs uppercase tracking-widest">Equity (24h)</CardTitle>
          <span className={`text-xs ${isUp ? "text-green-400" : "text-red-400"}`}>
            {isUp ? "+" : ""}{changePct}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-end justify-between mb-1">
          <span className="text-lg font-medium">${lastVal.toFixed(2)}</span>
          <span className={`text-xs ${isUp ? "text-green-400" : "text-red-400"}`}>
            {isUp ? "+" : ""}{change.toFixed(4)}
          </span>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[120px]" preserveAspectRatio="none">
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
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>{new Date(data[0].timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          <span>{new Date(data[data.length - 1].timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </CardContent>
    </Card>
  );
}
