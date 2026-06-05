import type { WhisperContent } from "../types";

export const WHISPERS: Record<1 | 2, WhisperContent> = {
  1: {
    label: "第一の囁き",
    text: "我、ここに灯を\n掲げり",
    hint: "次の囁きは、模擬店の扉の向こうにある。",
  },
  2: {
    label: "第二の囁き",
    text: "知は、暗闇を\n照らす灯なり",
    hint: "五高記念館へ。長い旅の終わりが、そこにある。",
  },
};
