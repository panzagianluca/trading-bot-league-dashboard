"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  BotStatus,
  SignalsResponse,
  BotState,
  fetchStatus,
  fetchLogs,
  fetchSignals,
  fetchState,
} from "@/lib/api";

const STATUS_INTERVAL = 7_000;
const LOGS_INTERVAL = 12_000;
const SIGNALS_INTERVAL = 15_000;

export function usePolybot() {
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [totalLogLines, setTotalLogLines] = useState(0);
  const [signals, setSignals] = useState<SignalsResponse | null>(null);
  const [botState, setBotState] = useState<BotState | null>(null);
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
      // silent
    }
  }, []);

  const pollSignals = useCallback(async () => {
    try {
      const s = await fetchSignals();
      setSignals(s);
    } catch {
      // silent — endpoints may not exist yet
    }
  }, []);

  const pollState = useCallback(async () => {
    try {
      const s = await fetchState();
      setBotState(s);
    } catch {
      // silent — endpoints may not exist yet
    }
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    await Promise.all([pollStatus(), pollLogs(), pollSignals(), pollState()]);
  }, [pollStatus, pollLogs, pollSignals, pollState]);

  useEffect(() => {
    pollStatus();
    pollLogs();
    pollSignals();
    pollState();
    const statusInterval = setInterval(pollStatus, STATUS_INTERVAL);
    const logsInterval = setInterval(pollLogs, LOGS_INTERVAL);
    const signalsInterval = setInterval(pollSignals, SIGNALS_INTERVAL);
    const stateInterval = setInterval(pollState, SIGNALS_INTERVAL);
    return () => {
      clearInterval(statusInterval);
      clearInterval(logsInterval);
      clearInterval(signalsInterval);
      clearInterval(stateInterval);
    };
  }, [pollStatus, pollLogs, pollSignals, pollState]);

  return {
    status, logs, totalLogLines, signals, botState,
    connected, lastUpdated, loading, refetch,
  };
}
