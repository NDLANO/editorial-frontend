/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { IMovieThemeDTO } from "@ndla/types-backend/frontpage-api";
import { LocaleType } from "../../interfaces";

export type ThemeNames = Partial<Record<LocaleType, string>>;

export interface FilmFormikType {
  name: string;
  title: Descendant[];
  description: Descendant[];
  visualElement: Descendant[];
  language: string;
  supportedLanguages: string[];
  slideShow: string[];
  themes: IMovieThemeDTO[];
  article?: string;
}
