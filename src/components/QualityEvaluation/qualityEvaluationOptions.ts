/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export type QualityEvaluationValue = "1" | "2" | "3" | "4" | "5";

// TODO: We should change these colors
export const qualityEvaluationOptionColors: Record<QualityEvaluationValue, string> = {
  "1": "#5cbc80",
  "2": "#90C670",
  "3": "#C3D060",
  "4": "#ead854",
  "5": "#d1372e",
};
