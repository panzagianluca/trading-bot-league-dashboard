"use client";

import { SelfProfile } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

const riskStyleColors: Record<string, string> = {
  zen: "text-purple-400 border-purple-400/30",
  flow: "text-cyan-400 border-cyan-400/30",
  aggressive: "text-red-400 border-red-400/30",
  cautious: "text-yellow-400 border-yellow-400/30",
};

export function ConsciousnessCard({ profile }: { profile: SelfProfile }) {
  const weights = profile.playbook_weights || {};
  const maxWeight = Math.max(
    ...Object.values(weights),
    0.01
  );

  const styleClass = riskStyleColors[profile.risk_style] || "text-muted-foreground";

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs uppercase tracking-widest">Consciousness</CardTitle>
          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${styleClass}`}>
            {profile.risk_style}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="px-6 pb-4 space-y-4">
            {/* Strengths / mantra */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Mantra</span>
              <p className="text-[11px] text-foreground/70 leading-relaxed italic line-clamp-4">
                {profile.strengths}
              </p>
            </div>

            {/* Config */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Min Confidence</span>
                <p className="text-sm font-medium">{(profile.min_confidence * 100).toFixed(0)}%</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Max Position</span>
                <p className="text-sm font-medium">{profile.max_position_pct}%</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Markets</span>
                <div className="flex gap-1">
                  {(profile.preferred_markets || []).map((m) => (
                    <Badge key={m} variant="outline" className="text-[10px] px-1.5 py-0">
                      {m}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Horizons</span>
                <div className="flex gap-1">
                  {(profile.preferred_horizons || []).map((h) => (
                    <Badge key={h} variant="outline" className="text-[10px] px-1.5 py-0">
                      {h}m
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Playbook weights */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Strategy Weights</span>
              {Object.entries(weights).map(([name, weight]) => (
                <div key={name} className="space-y-0.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">{name}</span>
                    <span>{(weight * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={maxWeight > 0 ? (weight / maxWeight) * 100 : 0} className="h-1" />
                </div>
              ))}
            </div>

            {/* Weaknesses */}
            {profile.weaknesses && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-red-400/70">Weaknesses</span>
                <p className="text-[11px] text-foreground/70">{profile.weaknesses}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
