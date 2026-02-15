"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { BotStatus, LogsResponse, fetchStatus, fetchLogs } from "@/lib/api";

const STATUS_INTERVAL = 7_000;
const LOGS_INTERVAL = 12_000;

export function usePolybot() {
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [totalLogLines, setTotalLogLines] = useState(0);
  const [connected, setConnected] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const failCount = useRef(0);

  const pollStatus = useCallback(async () => {
    try {
      const s = await fetchStatus();
      setStatus(s);
      setConnected(true);
      setLastUpdated(new Date());
      failCount.current = 0;
    } catch {
      failCount.current++;
      if (failCount.current >= 3) setConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const pollLogs = useCallback(async () => {
    try {
      const l = await fetchLogs(100);
      setLogs(l.logs);
      setTotalLogLines(l.total_lines);
    } catch {
      // silent — status polling handles connection state
    }
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    await Promise.all([pollStatus(), pollLogs()]);
  }, [pollStatus, pollLogs]);

  useEffect(() => {
    pollStatus();
    pollLogs();
    const statusInterval = setInterval(pollStatus, STATUS_INTERVAL);
    const logsInterval = setInterval(pollLogs, LOGS_INTERVAL);
    return () => {
      clearInterval(statusInterval);
      clearInterval(logsInterval);
    };
  }, [pollStatus, pollLogs]);

  return { status, logs, totalLogLines, connected, lastUpdated, loading, refetch };
}
