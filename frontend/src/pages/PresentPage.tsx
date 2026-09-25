import { RallyImage } from "../components/RallyImage";
import { PageLayout } from "../components/PageLayout";
import { TextButton } from "../components/TextButton";
import { useApp } from "../context/AppContext";

const GIFTS = [
  {
    name: "「五高の囁き」限定バルーン",
    image: "/images/balloon.webp",
  },
  {
    name: "「五高の囁き」限定しおり",
    image: "/images/bookmark.webp",
  },
];

export function PresentPage() {
  const { stamp1Done, stamp2Done, setActiveTab, openPin } = useApp();
  const both = stamp1Done && stamp2Done;

  return (
    <PageLayout variant="top">
      <h1 className="title-serif title-sm">参加特典</h1>
      <ul className="intro-list">
        {GIFTS.map((gift) => (
          <li key={gift.name}>
            <article className="intro-card">
              <RallyImage src={gift.image} alt="" />
              <p className="intro-card__name">{gift.name}</p>
            </article>
          </li>
        ))}
      </ul>
      {both && (
        <TextButton
          label="五高記念館へ"
          variant="serif"
          onClick={() => {
            openPin("goko");
            setActiveTab("home");
          }}
        />
      )}
    </PageLayout>
  );
}
