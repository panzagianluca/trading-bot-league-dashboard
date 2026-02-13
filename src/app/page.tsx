"use client";

import { useLeagueData } from "@/hooks/use-league-data";
import { LeagueNavbar } from "@/components/league-navbar";
import { BotSidebar } from "@/components/bot-sidebar";
import { BotCard } from "@/components/bot-card";

export default function HomePage() {
  const { bots, stats, error, loading } = useLeagueData();

  if (loading) {
    return (
      <div className="h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-xs text-muted-foreground animate-pulse">Loading league...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-xs text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <LeagueNavbar stats={stats} />

      <div className="flex-1 flex min-h-0">
        {/* Left sidebar: 20% bot list */}
        <div className="w-[20%] shrink-0">
          <BotSidebar bots={bots} />
        </div>

        {/* Right: 80% bot grid */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-3 gap-3">
            {bots.map((bot) => (
              <BotCard key={bot.id} bot={bot} />
            ))}
          </div>
          {bots.length === 0 && (
            <p className="text-xs text-muted-foreground italic text-center py-16">
              No bots found...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
