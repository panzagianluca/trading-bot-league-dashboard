"use client";

import { useEffect, useState, useCallback } from "react";
import {
  BotStatus,
  Portfolio,
  Decision,
  DiaryEntry,
  EquitySnapshot,
  fetchBotStatus,
  fetchPortfolio,
  fetchDecisions,
  fetchDiary,
  fetchEquityHistory,
} from "@/lib/api";

const POLL_INTERVAL = 60_000;

export function useBotData(botId = 1) {
  const [botStatus, setBotStatus] = useState<BotStatus | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [diary, setDiary] = useState<DiaryEntry[]>([]);
  const [equityHistory, setEquityHistory] = useState<EquitySnapshot[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const [status, port, decs, diaryEntries, equity] = await Promise.all([
        fetchBotStatus(botId),
        fetchPortfolio(botId),
        fetchDecisions(botId, 30),
        fetchDiary(botId, 10),
        fetchEquityHistory(botId),
      ]);
      setBotStatus(status);
      setPortfolio(port);
      setDecisions(decs);
      setDiary(diaryEntries);
      setEquityHistory(equity);
      setLastUpdated(new Date());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, [botId]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchAll]);

  return {
    botStatus, portfolio, decisions, diary, equityHistory,
    lastUpdated, error, loading, refetch: fetchAll,
  };
}
