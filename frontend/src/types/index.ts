export type Tab = "home" | "food" | "present";

export type Screen = "top" | "stamp1" | "stamp2" | "goal";

export type WhisperContent = {
  label: string;
  text: string;
  hint: string;
};

export type GoalToken = {
  code: string;
  expiresAt: number;
};
