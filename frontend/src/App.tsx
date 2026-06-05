import { useEffect, useRef, useState } from "react";
import { DevNav } from "./components/DevNav";
import { AppProvider, useApp } from "./context/AppContext";
import { WHISPERS } from "./data/whispers";
import { GoalPage } from "./pages/GoalPage";
import { StampPage } from "./pages/StampPage";
import { TopPage } from "./pages/TopPage";
import type { Screen } from "./types";

type TransitionPhase = "idle" | "exit" | "enter";

function ScreenRenderer() {
  const { screen, completeStamp1, completeStamp2 } = useApp();
  const [displayedScreen, setDisplayedScreen] = useState<Screen>(screen);
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const prevScreen = useRef<Screen>(screen);

  useEffect(() => {
    if (screen === prevScreen.current) return;

    setPhase("exit");

    const exitTimer = setTimeout(() => {
      setDisplayedScreen(screen);
      setPhase("enter");
      prevScreen.current = screen;
    }, 400);

    const enterTimer = setTimeout(() => {
      setPhase("idle");
    }, 800);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(enterTimer);
    };
  }, [screen]);

  const transitionClass =
    phase === "exit"
      ? "page-transition page-transition--exit"
      : phase === "enter"
        ? "page-transition page-transition--enter"
        : "page-transition";

  const renderScreen = () => {
    switch (displayedScreen) {
      case "top":
        return <TopPage />;
      case "stamp1":
        return (
          <StampPage
            content={WHISPERS[1]}
            onComplete={completeStamp1}
          />
        );
      case "stamp2":
        return (
          <StampPage
            content={WHISPERS[2]}
            onComplete={completeStamp2}
          />
        );
      case "goal":
        return <GoalPage />;
    }
  };

  return <div className={transitionClass}>{renderScreen()}</div>;
}

function App() {
  return (
    <AppProvider>
      <div className="app-shell">
        <ScreenRenderer />
        <DevNav />
      </div>
    </AppProvider>
  );
}

export default App;
