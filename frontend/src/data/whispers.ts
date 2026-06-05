import type { WhisperContent } from "../types";

export const WHISPERS: Record<1 | 2, WhisperContent> = {
  1: {
    label: "第一の囁き",
    text: "耳を澄ませ。\nこの街の風は、\nまだあの頃の声を\n運んでいる。",
    hint: "次の声は、模擬店のどこかに眠っている。",
  },
  2: {
    label: "第二の囁き",
    text: "灯は、消えない。\n学んだ者の記憶が、\n石となり、壁となり、\n今もここに立っている。",
    hint: "二つの声が揃った。あとは、扉の前へ。",
  },
};
