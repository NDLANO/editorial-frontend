/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GlobalLine, CheckboxCircleLine, InfoI } from "@ndla/icons";
import { Button, ListItemContent, ListItemHeading, ListItemImage, ListItemRoot, Text } from "@ndla/primitives";
import { SafeLinkIconButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { ConceptSummaryDTO } from "@ndla/types-backend/concept-api";
import { useTranslation } from "react-i18next";
import config from "../../../../config";
import { PUBLISHED } from "../../../../constants";
import { FormActionsContainer } from "../../../FormikForm";

const StyledListItemImage = styled(ListItemImage, {
  base: {
    minWidth: "102px",
    maxWidth: "102px",
    minHeight: "77px",
    maxHeight: "77px",
    tabletDown: {
      display: "none",
    },
  },
});

const StyledListItemContent = styled(ListItemContent, {
  base: {
    flexDirection: "column",
    gap: "4xsmall",
    alignItems: "flex-start",
  },
});

const StyledText = styled(Text, {
  base: {
    lineClamp: "2",
  },
});

const StyledListItemMainContent = styled(ListItemContent, {
  base: {
    alignItems: "flex-end",
  },
});

const StyledFormActionsContainer = styled(FormActionsContainer, {
  base: {
    marginInlineStart: "auto",
  },
});

interface Props {
  result: ConceptSummaryDTO;
  addConcept: (concept: ConceptSummaryDTO) => void;
}

const SearchConceptResult = ({ result, addConcept }: Props) => {
  const { t } = useTranslation();

  return (
    <ListItemRoot nonInteractive asChild consumeCss>
      <li>
        <StyledListItemImage src="" alt="" fallbackElement={result.glossData ? <GlobalLine /> : <InfoI />} />
        <StyledListItemContent>
          <ListItemContent>
            <ListItemHeading>
              {(result.glossData
                ? `${t(`languages.${result.glossData.originalLanguage}`)}: ${result.glossData.gloss}`
                : result.title.title) ?? t("conceptSearch.noTitle")}
            </ListItemHeading>
          </ListItemContent>
          <StyledListItemMainContent>
            {!!result.content.content.length && (
              <StyledText textStyle="body.small">{result.content.content}</StyledText>
            )}
            <StyledFormActionsContainer>
              {!!(result.status?.current === PUBLISHED || result.status?.other.includes(PUBLISHED)) && (
                <SafeLinkIconButton
                  size="small"
                  variant="success"
                  target="_blank"
                  aria-label={t("form.workflow.published")}
                  title={t("form.workflow.published")}
                  to={`${config.ndlaFrontendDomain}/concept/${result.id}`}
                >
                  <CheckboxCircleLine />
                </SafeLinkIconButton>
              )}
              <Button
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  addConcept(result);
                }}
              >
                {t("form.choose")}
              </Button>
            </StyledFormActionsContainer>
          </StyledListItemMainContent>
        </StyledListItemContent>
      </li>
    </ListItemRoot>
  );
};

export default SearchConceptResult;
