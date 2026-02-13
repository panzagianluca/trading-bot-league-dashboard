"use client";

import { useEffect, useState, useCallback } from "react";
import { BotSummary, LeagueStats, fetchAllBots, fetchLeagueStats } from "@/lib/api";

const POLL_INTERVAL = 60_000;

export function useLeagueData() {
  const [bots, setBots] = useState<BotSummary[]>([]);
  const [stats, setStats] = useState<LeagueStats | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const [botList, leagueStats] = await Promise.all([
        fetchAllBots(),
        fetchLeagueStats(),
      ]);
      setBots(botList);
      setStats(leagueStats);
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAll]);

  return { bots, stats, lastUpdated, error, loading, refetch: fetchAll };
}
