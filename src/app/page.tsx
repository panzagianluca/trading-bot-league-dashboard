import { mockBot, mockLeague } from "@/lib/mock-data";
import { StatsBar } from "@/components/stats-bar";
import { EquityChart } from "@/components/equity-chart";
import { BotStats } from "@/components/bot-stats";
import { LastAction } from "@/components/last-action";
import { PositionsTable } from "@/components/positions-table";
import { DecisionsFeed } from "@/components/decisions-feed";
import { DiaryFeed } from "@/components/diary-feed";
import { SelfProfile } from "@/components/self-profile";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <StatsBar league={mockLeague} bot={mockBot} />

      <div className="p-6 space-y-4">
        {/* Row 1: Equity chart + Performance stats + Last action */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-4">
            <EquityChart data={mockBot.equity_history} />
          </div>
          <div className="col-span-5">
            <BotStats bot={mockBot} />
          </div>
          <div className="col-span-3">
            <LastAction bot={mockBot} />
          </div>
        </div>

        {/* Row 2: Positions */}
        <PositionsTable positions={mockBot.positions} />

        {/* Row 3: Decisions feed + Diary + Self profile */}
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-5">
            <DecisionsFeed decisions={mockBot.recent_decisions} />
          </div>
          <div className="col-span-4">
            <DiaryFeed entries={mockBot.diary_entries} />
          </div>
          <div className="col-span-3">
            <SelfProfile bot={mockBot} />
          </div>
        </div>
      </div>
    </div>
  );
}
