"use client";

import { useEffect, useState, useCallback } from "react";
import {
  BotStatus,
  Portfolio,
  Decision,
  DiaryEntry,
  fetchBotStatus,
  fetchPortfolio,
  fetchDecisions,
  fetchDiary,
} from "@/lib/api";

const POLL_INTERVAL = 60_000; // 60 seconds

export function useBotData() {
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [diary, setDiary] = useState<DiaryEntry[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const [status, port, decs, diaryEntries] = await Promise.all([
        fetchBotStatus(),
        fetchPortfolio(),
        fetchDecisions(30),
        fetchDiary(10),
      ]);
      setBotStatus(status);
      setPortfolio(port);
      setDecisions(decs);
      setDiary(diaryEntries);
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

  return { botStatus, portfolio, decisions, diary, lastUpdated, error, loading, refetch: fetchAll };
}
