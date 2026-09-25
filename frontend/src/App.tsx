import { useEffect, useRef, useState } from "react";
import { BottomNav } from "./components/BottomNav";
import { BottomSheet } from "./components/BottomSheet";
import { MapViewer } from "./components/MapViewer";
import { PageLayout } from "./components/PageLayout";
import { AppProvider, useApp } from "./context/AppContext";
import type { PinId } from "./data/map";
import { AdminPage } from "./pages/AdminPage";
import { FoodPage } from "./pages/FoodPage";
import { GoalPage } from "./pages/GoalPage";
import { PresentPage } from "./pages/PresentPage";
import { RedeemedPage } from "./pages/RedeemedPage";
import { SoldOutPage } from "./pages/SoldOutPage";
import { StampPage } from "./pages/StampPage";
import { TopPage } from "./pages/TopPage";
import type { Screen, WhisperId } from "./types";

type TransitionPhase = "idle" | "exit" | "enter";

function whichFor(
  next: Screen,
  pendingWhisper: WhisperId | null,
  stamp1Done: boolean,
  stamp2Done: boolean,
): WhisperId | null {
  if (next === "whisper") return pendingWhisper;
  if (next === "guide") {
    if (stamp1Done) return 1;
    if (stamp2Done) return 2;
  }
  return null;
}

function ScreenRenderer() {
  const {
    screen,
    pendingWhisper,
    stamp1Done,
    stamp2Done,
    clearPendingWhisper,
    openPin,
  } = useApp();
  const [displayedScreen, setDisplayedScreen] = useState<Screen>(screen);
  const [displayedWhich, setDisplayedWhich] = useState<WhisperId | null>(() =>
    whichFor(screen, pendingWhisper, stamp1Done, stamp2Done),
  );
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const prevScreen = useRef<Screen>(screen);

  useEffect(() => {
    if (screen === prevScreen.current) return;

    setPhase("exit");

    const exitTimer = setTimeout(() => {
      setDisplayedScreen(screen);
      setDisplayedWhich(
        whichFor(screen, pendingWhisper, stamp1Done, stamp2Done),
      );
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
  }, [screen, pendingWhisper, stamp1Done, stamp2Done]);

  const transitionClass =
    phase === "exit"
      ? "page-transition page-transition--exit"
      : phase === "enter"
        ? "page-transition page-transition--enter"
        : "page-transition";

  const renderScreen = () => {
    switch (displayedScreen) {
      case "top":
        return <TopPage mode="top" />;
      case "askName":
        return <TopPage mode="askName" />;
      case "whisper":
        return displayedWhich ? (
          <StampPage
            mode="whisper"
            which={displayedWhich}
            onComplete={() => {
              const pin: PinId = displayedWhich === 2 ? "spot2" : "spot1";
              clearPendingWhisper();
              openPin(pin);
            }}
          />
        ) : null;
      case "guide":
        return displayedWhich ? (
          <StampPage mode="guide" which={displayedWhich} />
        ) : null;
      case "goal":
        return <GoalPage />;
      case "redeemed":
        return <RedeemedPage />;
      case "soldOut":
        return <SoldOutPage />;
      case "admin":
        return <AdminPage />;
    }
  };

  return <div className={transitionClass}>{renderScreen()}</div>;
}

function HomeStage() {
  const {
    screen,
    stamp1Done,
    stamp2Done,
    selectedPin,
    sheetLevel,
    focusId,
    focusToken,
    openPin,
    setSheetLevel,
  } = useApp();

  if (screen === "admin") {
    return (
      <div className="tab-scroll">
        <AdminPage />
      </div>
    );
  }

  const reached: Record<PinId, boolean> = {
    spot1: stamp1Done,
    spot2: stamp2Done,
    goko: stamp1Done && stamp2Done,
  };

  return (
    <div className="home-map">
      <MapViewer
        selectedId={selectedPin}
        focusId={focusId}
        focusToken={focusToken}
        reached={reached}
        sheetLevel={sheetLevel}
        onSelect={openPin}
      />
      <BottomSheet level={sheetLevel} onLevel={setSheetLevel}>
        <ScreenRenderer />
      </BottomSheet>
    </div>
  );
}

function TabContent() {
  const { activeTab } = useApp();

  switch (activeTab) {
    case "home":
      return <HomeStage />;
    case "food":
      return (
        <div className="tab-scroll">
          <FoodPage />
        </div>
      );
    case "present":
      return (
        <div className="tab-scroll">
          <PresentPage />
        </div>
      );
  }
}

function AppShell() {
  const { storageBlocked } = useApp();

  if (storageBlocked) {
    return (
      <PageLayout variant="top">
        <p className="text-paper">
          このブラウザでは記録を残せません。通常のタブで開いてください。
        </p>
      </PageLayout>
    );
  }

  return (
    <div className="app-shell">
      <div className="tab-content">
        <TabContent />
      </div>
      <BottomNav />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

export default App;
