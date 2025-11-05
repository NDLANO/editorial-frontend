/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { AudioSummaryDTO, SeriesSummaryDTO } from "@ndla/types-backend/audio-api";
import { ConceptSummaryDTO } from "@ndla/types-backend/concept-api";
import { ImageMetaSummaryDTO } from "@ndla/types-backend/image-api";
import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import SearchAudio from "./SearchAudio";
import SearchContent from "./SearchContent";
import SearchImage from "./SearchImage";
import SearchPodcastSeries from "./SearchPodcastSeries";
import { ReturnType } from "../../../../interfaces";

type ContentReturnType = ReturnType<"content", MultiSearchSummaryDTO>;
type ConceptReturnType = ReturnType<"concept", ConceptSummaryDTO>;
type ImageReturnType = ReturnType<"image", ImageMetaSummaryDTO>;
type AudioReturnType = ReturnType<"audio", AudioSummaryDTO>;
type PodcastReturnType = ReturnType<"podcast-series", SeriesSummaryDTO>;
type MissingReturnType = ReturnType<string, any>;
export type SearchResultReturnType =
  | MissingReturnType
  | ContentReturnType
  | ConceptReturnType
  | ImageReturnType
  | AudioReturnType
  | PodcastReturnType;

interface Props {
  result: SearchResultReturnType;
  locale: string;
  responsibleName?: string;
}

const SearchResult = ({ result, locale, responsibleName }: Props) => {
  const { t } = useTranslation();
  switch (result.type) {
    case "content":
      return <SearchContent content={result.value} locale={locale} responsibleName={responsibleName} />;
    case "image":
      return <SearchImage image={result.value} locale={locale} />;
    case "audio":
      return <SearchAudio audio={result.value} locale={locale} />;
    case "podcast-series":
      return <SearchPodcastSeries series={result.value} />;
    default:
      return <p>{t("searchForm.resultError", { type: result.type })}</p>;
  }
};

export default SearchResult;
