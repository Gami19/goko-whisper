import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Screen, Tab } from "../types";

const AUTO_FLOW_STEP_MS = 800;

type AppContextValue = {
  activeTab: Tab;
  screen: Screen;
  nickname: string;
  stamp1Done: boolean;
  stamp2Done: boolean;
  autoFlowActive: boolean;
  setNickname: (name: string) => void;
  startHomeAutoFlow: () => void;
  completeStamp1: () => void;
  completeStamp2: () => void;
  setActiveTab: (tab: Tab) => void;
  reset: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTabState] = useState<Tab>("home");
  const [screen, setScreen] = useState<Screen>("top");
  const [nickname, setNicknameState] = useState("");
  const [stamp1Done, setStamp1Done] = useState(false);
  const [stamp2Done, setStamp2Done] = useState(false);
  const [autoFlowActive, setAutoFlowActive] = useState(false);

  const activeTabRef = useRef<Tab>("home");
  const autoTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAutoFlow = useCallback(() => {
    autoTimersRef.current.forEach(clearTimeout);
    autoTimersRef.current = [];
  }, []);

  const scheduleAutoStep = useCallback(
    (step: () => void, delay: number) => {
      const id = setTimeout(() => {
        if (activeTabRef.current !== "home") return;
        step();
      }, delay);
      autoTimersRef.current.push(id);
    },
    [],
  );

  const setNickname = useCallback((name: string) => {
    setNicknameState(name);
  }, []);

  const startHomeAutoFlow = useCallback(() => {
    if (!nickname.trim() || activeTabRef.current !== "home" || screen !== "top") {
      return;
    }

    clearAutoFlow();
    setAutoFlowActive(true);
    setStamp1Done(true);
    setScreen("stamp1");

    scheduleAutoStep(() => {
      setStamp2Done(true);
      setScreen("stamp2");
    }, AUTO_FLOW_STEP_MS);

    scheduleAutoStep(() => {
      setScreen("goal");
      setAutoFlowActive(false);
    }, AUTO_FLOW_STEP_MS * 2);
  }, [nickname, screen, clearAutoFlow, scheduleAutoStep]);

  const completeStamp1 = useCallback(() => {
    setStamp1Done(true);
    setScreen("stamp2");
  }, []);

  const completeStamp2 = useCallback(() => {
    setStamp2Done(true);
    setScreen("goal");
  }, []);

  const setActiveTab = useCallback(
    (tab: Tab) => {
      if (tab !== "home") {
        clearAutoFlow();
        setAutoFlowActive(false);
      }
      activeTabRef.current = tab;
      setActiveTabState(tab);
    },
    [clearAutoFlow],
  );

  const reset = useCallback(() => {
    clearAutoFlow();
    setAutoFlowActive(false);
    setScreen("top");
    setNicknameState("");
    setStamp1Done(false);
    setStamp2Done(false);
  }, [clearAutoFlow]);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    return () => clearAutoFlow();
  }, [clearAutoFlow]);

  useEffect(() => {
    history.pushState({ screen }, "", window.location.pathname);

    const handlePopState = () => {
      const confirmed = window.confirm("この旅を中断しますか？");
      if (confirmed) {
        reset();
      } else {
        history.pushState({ screen }, "", window.location.pathname);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [screen, reset]);

  const value = useMemo(
    () => ({
      activeTab,
      screen,
      nickname,
      stamp1Done,
      stamp2Done,
      autoFlowActive,
      setNickname,
      startHomeAutoFlow,
      completeStamp1,
      completeStamp2,
      setActiveTab,
      reset,
    }),
    [
      activeTab,
      screen,
      nickname,
      stamp1Done,
      stamp2Done,
      autoFlowActive,
      setNickname,
      startHomeAutoFlow,
      completeStamp1,
      completeStamp2,
      setActiveTab,
      reset,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- context hook co-located with provider
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within AppProvider");
  }
  return ctx;
}

export type { Screen, Tab };
