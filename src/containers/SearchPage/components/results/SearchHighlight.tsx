/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IMultiSearchSummaryDTO } from "@ndla/types-backend/search-api";

interface Props {
  content: IMultiSearchSummaryDTO;
  locale: string;
}

const StyledText = styled(Text, {
  base: {
    cursor: "help",
  },
});

const StyledDiv = styled("div", {
  base: {
    display: "inline-block",
  },
});

const SearchHighlight = ({ content, locale }: Props) => {
  const { t } = useTranslation();
  if (content.highlights === undefined) {
    return null;
  }

  const highlightsInLocale = content.highlights.filter((highlight) => highlight.field.split(".")[1] === locale);

  const highlightsToSearch = highlightsInLocale.length ? highlightsInLocale : content.highlights;

  const selectHighlights = (field: string) =>
    highlightsToSearch.find((highlight) => highlight.field.split(".")[0] === field);

  const selectedHighlights =
    selectHighlights("content") ||
    selectHighlights("embedAttributes") ||
    selectHighlights("tags") ||
    selectHighlights("notes") ||
    selectHighlights("previousVersionsNotes");

  return selectedHighlights ? (
    <StyledDiv>
      <Text textStyle="body.small" fontWeight="bold">
        {t("searchPage.highlights.title")}
      </Text>
      <StyledText
        textStyle="body.small"
        title={t(`searchPage.highlights.${selectedHighlights.field.split(".")[0]}`)}
        dangerouslySetInnerHTML={{
          __html: selectedHighlights.matches.join(" [...] "),
        }}
      />
    </StyledDiv>
  ) : null;
};

export default SearchHighlight;
