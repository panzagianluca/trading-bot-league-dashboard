"use client";

import { useLeagueData } from "@/hooks/use-league-data";
import { LeagueNavbar } from "@/components/league-navbar";
import { BotSidebar } from "@/components/bot-sidebar";
import { BotCard } from "@/components/bot-card";

export default function HomePage() {
  const { bots, stats, error, loading, refetch } = useLeagueData();
  const active = bots.filter((b) => b.status === "ACTIVE");
  const sorted = [...active].sort((a, b) => b.equity_usd - a.equity_usd);
  const killLine = sorted.length - 4;
  const dangerIds = new Set(sorted.slice(killLine).map((b) => b.id));

  if (loading) {
    return (
      <div className="h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">Loading league...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <LeagueNavbar stats={stats} onRefresh={refetch} />

      <div className="flex-1 flex min-h-0">
        {/* Left sidebar: 20% bot list */}
        <div className="w-[20%] shrink-0">
          <BotSidebar bots={bots} />
        </div>

        {/* Right: 80% bot grid */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-3 gap-3">
            {sorted.map((bot) => (
              <BotCard key={bot.id} bot={bot} inDanger={dangerIds.has(bot.id)} />
            ))}
          </div>
          {sorted.length === 0 && (
            <p className="text-sm text-muted-foreground italic text-center py-16">
              No bots found...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
