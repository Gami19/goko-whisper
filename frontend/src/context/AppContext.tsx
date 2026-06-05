import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Screen } from "../types";

type AppContextValue = {
  screen: Screen;
  nickname: string;
  stamp1Done: boolean;
  stamp2Done: boolean;
  setNickname: (name: string) => void;
  goToStamp1: () => void;
  completeStamp1: () => void;
  completeStamp2: () => void;
  goToScreen: (screen: Screen) => void;
  reset: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>("top");
  const [nickname, setNicknameState] = useState("");
  const [stamp1Done, setStamp1Done] = useState(false);
  const [stamp2Done, setStamp2Done] = useState(false);

  const setNickname = useCallback((name: string) => {
    setNicknameState(name);
  }, []);

  const goToStamp1 = useCallback(() => {
    if (nickname.trim()) {
      setScreen("stamp1");
    }
  }, [nickname]);

  const completeStamp1 = useCallback(() => {
    setStamp1Done(true);
    setScreen("stamp2");
  }, []);

  const completeStamp2 = useCallback(() => {
    setStamp2Done(true);
    setScreen("goal");
  }, []);

  const goToScreen = useCallback((target: Screen) => {
    setScreen(target);
  }, []);

  const reset = useCallback(() => {
    setScreen("top");
    setNicknameState("");
    setStamp1Done(false);
    setStamp2Done(false);
  }, []);

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
      screen,
      nickname,
      stamp1Done,
      stamp2Done,
      setNickname,
      goToStamp1,
      completeStamp1,
      completeStamp2,
      goToScreen,
      reset,
    }),
    [
      screen,
      nickname,
      stamp1Done,
      stamp2Done,
      setNickname,
      goToStamp1,
      completeStamp1,
      completeStamp2,
      goToScreen,
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

export type { Screen };
