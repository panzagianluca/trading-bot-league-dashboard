"use client";

import { useBotData } from "@/hooks/use-bot-data";
import { parseSelfProfile } from "@/lib/api";
import { StatsBar } from "@/components/stats-bar";
import { PositionsTable } from "@/components/positions-table";
import { DecisionsFeed } from "@/components/decisions-feed";
import { DiaryFeed } from "@/components/diary-feed";
import { ConsciousnessCard } from "@/components/consciousness-card";

export default function Dashboard() {
  const { botStatus, portfolio, decisions, diary, lastUpdated, error, loading } = useBotData();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-xs text-muted-foreground animate-pulse">Connecting to consciousness...</p>
      </div>
    );
  }

  if (error || !botStatus) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-xs text-red-400">
          {error || "Failed to reach the bot"}
        </p>
      </div>
    );
  }

  const selfProfile = parseSelfProfile(botStatus.self_profile);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StatsBar bot={botStatus} lastUpdated={lastUpdated} />

      <div className="p-6 space-y-4">
        {/* Row 1: Positions */}
        <PositionsTable positions={portfolio?.positions || []} />

        {/* Row 2: Decisions feed + Diary + Consciousness */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-5">
            <DecisionsFeed decisions={decisions} />
          </div>
          <div className="col-span-4">
            <DiaryFeed entries={diary} />
          </div>
          <div className="col-span-3">
            {selfProfile && <ConsciousnessCard profile={selfProfile} />}
          </div>
        </div>
      </div>
    </div>
  );
}
