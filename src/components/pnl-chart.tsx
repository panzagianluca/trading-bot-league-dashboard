"use client";

import { EquitySnapshot } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PnlChart({ data }: { data: EquitySnapshot[] }) {
  if (data.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs uppercase tracking-widest">PnL History</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <p className="text-xs text-muted-foreground italic">
            Awaiting first snapshot...
          </p>
        </CardContent>
      </Card>
    );
  }

  const values = data.map((d) => d.equity_usd);
  const lastVal = values[values.length - 1];
  const firstVal = values[0];
  const change = lastVal - firstVal;
  const changePct = firstVal > 0 ? ((change / firstVal) * 100).toFixed(1) : "0.0";
  const isUp = change >= 0;
  const strokeColor = isUp ? "#4ade80" : "#f87171";

  const height = 140;
  const width = 100;

  // Handle single data point: show a flat line at center
  let chartSvg;
  if (data.length === 1) {
    const cy = height / 2;
    chartSvg = (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
        <line x1="0" y1={cy} x2={width} y2={cy} stroke={strokeColor} strokeWidth="1" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
        <circle cx={width / 2} cy={cy} r="3" fill={strokeColor} vectorEffect="non-scaling-stroke" />
      </svg>
    );
  } else {
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 0.01;

    const points = data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d.equity_usd - min) / range) * height;
        return `${x},${y}`;
      })
      .join(" ");

    chartSvg = (
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
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs uppercase tracking-widest">PnL History</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">{data.length} pts</span>
            <span className={`text-xs ${isUp ? "text-green-400" : "text-red-400"}`}>
              {isUp ? "+" : ""}{changePct}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 flex flex-col pb-3 overflow-hidden">
        <div className="flex items-end justify-between mb-2 shrink-0">
          <span className="text-lg font-medium">${lastVal.toFixed(2)}</span>
          <span className={`text-xs ${isUp ? "text-green-400" : "text-red-400"}`}>
            {isUp ? "+" : ""}{change.toFixed(4)}
          </span>
        </div>
        <div className="flex-1 min-h-0 relative">
          <div className="absolute inset-0">
            {chartSvg}
          </div>
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1 shrink-0">
          <span>{new Date(data[0].ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          <span>{new Date(data[data.length - 1].ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
      </CardContent>
    </Card>
  );
}
