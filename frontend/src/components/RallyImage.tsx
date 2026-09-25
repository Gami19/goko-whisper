import { useState } from "react";

type RallyImageProps = {
  src: string;
  alt: string;
};

export function RallyImage({ src, alt }: RallyImageProps) {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  return (
    <div className="rally-image">
      {state === "loading" && <div className="rally-image__placeholder" />}
      {state === "error" && <p className="rally-image__missing">画像なし</p>}
      <img
        src={src}
        srcSet={`${src} 480w`}
        sizes="(max-width: 480px) 100vw, 480px"
        alt={alt}
        className={
          state === "ready"
            ? "rally-image__img"
            : "rally-image__img rally-image__img--pending"
        }
        onLoad={() => setState("ready")}
        onError={() => setState("error")}
      />
    </div>
  );
}
