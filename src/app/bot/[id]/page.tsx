"use client";

import { use } from "react";
import { useBotData } from "@/hooks/use-bot-data";
import { parseSelfProfile } from "@/lib/api";
import { BotNavbar } from "@/components/bot-navbar";
import { PnlChart } from "@/components/pnl-chart";
import { PositionsTable } from "@/components/positions-table";
import { StatsCard } from "@/components/stats-card";
import { DecisionsFeed } from "@/components/decisions-feed";
import { DiaryFeed } from "@/components/diary-feed";
import { ConsciousnessCard } from "@/components/consciousness-card";

export default function BotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const botId = parseInt(id, 10);
  const { botStatus, portfolio, decisions, diary, equityHistory, lastUpdated, error, loading } = useBotData(botId);

  if (loading) {
    return (
      <div className="h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-xs text-muted-foreground animate-pulse">Connecting to consciousness...</p>
      </div>
    );
  }

  if (error || !botStatus) {
    return (
      <div className="h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-xs text-red-400">{error || "Failed to reach the bot"}</p>
      </div>
    );
  }

  const selfProfile = parseSelfProfile(botStatus.self_profile);

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <BotNavbar bot={botStatus} lastUpdated={lastUpdated} />

      <div className="flex-1 min-h-0 p-4 flex flex-col gap-3 overflow-hidden">
        {/* Row 1: PnL Chart | Positions | Stats card */}
        <div className="flex gap-3 h-[45%] min-h-0 overflow-hidden">
          <div className="min-w-0" style={{ flex: "4 1 0%" }}>
            <PnlChart data={equityHistory} />
          </div>
          <div className="min-w-0" style={{ flex: "4 1 0%" }}>
            <PositionsTable positions={portfolio?.positions || []} />
          </div>
          <div className="min-w-0" style={{ flex: "2 1 0%" }}>
            <StatsCard bot={botStatus} />
          </div>
        </div>

        {/* Row 2: Live Thinking | Diary | Consciousness */}
        <div className="flex gap-3 flex-1 min-h-0 overflow-hidden">
          <div className="min-w-0 min-h-0" style={{ flex: "4 1 0%" }}>
            <DecisionsFeed decisions={decisions} />
          </div>
          <div className="min-w-0 min-h-0" style={{ flex: "4 1 0%" }}>
            <DiaryFeed entries={diary} />
          </div>
          <div className="min-w-0 min-h-0" style={{ flex: "2 1 0%" }}>
            {selfProfile ? (
              <ConsciousnessCard profile={selfProfile} />
            ) : (
              <div className="h-full border border-border flex items-center justify-center">
                <p className="text-xs text-muted-foreground italic">Identity forming...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
