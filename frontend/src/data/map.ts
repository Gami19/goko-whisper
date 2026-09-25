export type PinId = "spot1" | "spot2" | "goko";

export type MapPin = {
  id: PinId;
  name: string;
  x: number;
  y: number;
};

// パーセントはダミー SVG 上の仮位置。本番イラストのあとで合わせる。
export const MAP_PINS: MapPin[] = [
  { id: "spot1", name: "第一の囁き", x: 36, y: 50 },
  { id: "spot2", name: "模擬店", x: 68, y: 57 },
  { id: "goko", name: "五高記念館", x: 53, y: 42 },
];

export type FoodStall = {
  id: string;
  name: string;
  image: string;
  x: number;
  y: number;
};

// 模擬店ピンと同じ座標。別ピンは置かない。
export const FOOD_STALLS: FoodStall[] = [
  { id: "stall-1", name: "模擬店", image: "/images/stall.webp", x: 68, y: 57 },
];

export const STALL_ZOOM = 2.5;
