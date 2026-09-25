import { RallyImage } from "../components/RallyImage";
import { PageLayout } from "../components/PageLayout";
import { useApp } from "../context/AppContext";
import { FOOD_STALLS, STALL_ZOOM } from "../data/map";

export function FoodPage() {
  const { setActiveTab, focusMap } = useApp();

  return (
    <PageLayout variant="top">
      <h1 className="title-serif title-sm">模擬店の味</h1>
      <ul className="intro-list">
        {FOOD_STALLS.map((stall) => (
          <li key={stall.id}>
            <button
              type="button"
              className="intro-card"
              onClick={() => {
                focusMap({
                  x: stall.x,
                  y: stall.y,
                  zoom: STALL_ZOOM,
                  pinId: "spot2",
                });
                setActiveTab("home");
              }}
            >
              <RallyImage src={stall.image} alt="" />
              <span className="intro-card__name">{stall.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}
