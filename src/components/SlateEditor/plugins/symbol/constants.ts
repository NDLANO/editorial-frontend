/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SymbolData } from "./types";

// WARNING: Some of these symbols contain special unicode characters that look like normal characters.
// Make sure not to accidentally change them!
export const symbolMap = {
  half: { text: "½" },
  oneQuarter: { text: "¼" },
  threeQuarters: { text: "¾" },
  squared: { text: "²" },
  cubed: { text: "³" },
  copyright: { text: "©" },
  trademark: { text: "™" },
  degrees: { text: "°" },
  yen: { text: "¥" },
  nonBreakingHyphen: { text: "‑" },
  enDash: { text: "–" },
  nonBreakingSpace: { text: " ", icon: "␣" },
  paragraph: { text: "§" },
  invertedQuestionMark: { text: "¿" },
  alpha: { text: "α" },
  beta: { text: "β" },
  gamma: { text: "γ" },
  plusMinus: { text: "±" },
  rightArrow: { text: "→" },
};

export type SymbolName = keyof typeof symbolMap | "unknown";

export const symbols: SymbolData[] = Object.entries(symbolMap).map(([name, data]) => ({
  name: name as SymbolName,
  ...data,
}));
