"use client";

import { BotData } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function SelfProfile({ bot }: { bot: BotData }) {
  const profile = bot.self_profile;
  if (!profile) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs uppercase tracking-widest">Self Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">No profile yet. Bot is still developing identity.</p>
        </CardContent>
      </Card>
    );
  }

  const maxWeight = Math.max(...Object.values(profile.playbook_weights));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs uppercase tracking-widest">Self Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Strategies</span>
          <div className="flex flex-wrap gap-1">
            {profile.preferred_strategies.map((s) => (
              <Badge key={s} variant="outline" className="text-[10px] px-1.5 py-0">
                {s}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Risk Style</span>
          <p className="text-xs text-foreground/80">{profile.risk_style}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-green-400/70">Strengths</span>
            <p className="text-[11px] text-foreground/70">{profile.strengths}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-red-400/70">Weaknesses</span>
            <p className="text-[11px] text-foreground/70">{profile.weaknesses}</p>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Playbook Weights</span>
          {Object.entries(profile.playbook_weights).map(([name, weight]) => (
            <div key={name} className="space-y-0.5">
              <div className="flex justify-between text-[10px]">
                <span className="text-muted-foreground">{name}</span>
                <span>{(weight * 100).toFixed(0)}%</span>
              </div>
              <Progress value={(weight / maxWeight) * 100} className="h-1" />
            </div>
          ))}
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Lessons Learned</span>
          <div className="space-y-1">
            {profile.lessons.map((lesson, i) => (
              <p key={i} className="text-[11px] text-foreground/70 pl-2 border-l border-border">
                {lesson}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
