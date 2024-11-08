/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing, colors } from "@ndla/core";
import { Concept, CheckboxCircleFill, Globe } from "@ndla/icons/editor";
import { Button } from "@ndla/primitives";
import { IConceptSummary } from "@ndla/types-backend/concept-api";
import { SearchParams } from "../../../../containers/SearchPage/components/form/SearchForm";
import Spinner from "../../../Spinner";

const StyledConceptResult = styled.div`
  display: grid;
  grid-template-columns: 10% 70% 20%;
  grid-template-rows: auto auto;
  padding: ${spacing.normal} 0;
  border-bottom: 1px solid ${colors.brand.greyLight};
  &:last-child {
    border: none;
  }
`;

const StyledConcept = styled(Concept)`
  grid-column: 1 / 2;
  grid-row: 1 / 2;
`;
const StyledGlobe = styled(Globe)`
  grid-column: 1 / 2;
  grid-row: 1 / 2;
`;

const StyledConceptResultHeader = styled.h1`
  align-items: center;
  display: flex;
  grid-column: 2 / 2;
  grid-row: 1 / 1;
  margin: 0;
`;

const StyledConceptContent = styled.p`
  grid-row: 2 / 2;
  grid-column: 2 / 2;
  margin: 0;
`;

const StyledButton = styled(Button)`
  grid-row-start: 1 / 3;
  grid-column: 3 / 3;
  align-self: center;
`;

const StyledCheckIcon = styled(CheckboxCircleFill)`
  margin-left: 10px;
  margin-top: 2px;
  height: 25px;
  width: 25px;
  fill: ${colors.support.green};
`;

interface Props {
  searchObject: SearchParams;
  results: IConceptSummary[];
  addConcept: (concept: IConceptSummary) => void;
  searching?: boolean;
}

const SearchConceptResults = ({ results, searchObject, addConcept, searching = true }: Props) => {
  const { t } = useTranslation();
  return (
    <div>
      {searching && <Spinner appearance="absolute" />}
      {results.length === 0 ? <p>{t(`searchPage.conceptNoHits`, { query: searchObject.query })}</p> : null}
      {results.map((result) => (
        <StyledConceptResult key={result.id}>
          {result.glossData ? <StyledGlobe /> : <StyledConcept />}
          <StyledConceptResultHeader>
            {(result.glossData
              ? `${t(`languages.${result.glossData.originalLanguage}`)}: ${result.glossData.gloss}`
              : result.title.title) ?? t("conceptSearch.noTitle")}
            {(result.status.current === "PUBLISHED" || result.status.other.includes("PUBLISHED")) && (
              <StyledCheckIcon aria-label={t("form.workflow.published")} title={t("form.workflow.published")} />
            )}
          </StyledConceptResultHeader>
          <StyledConceptContent>
            {result.glossData ? result.title.title : result.content.content ?? t("conceptSearch.noContent")}
          </StyledConceptContent>
          <StyledButton
            onClick={(evt) => {
              evt.stopPropagation();
              addConcept(result);
            }}
          >
            {t(`form.content.${result.conceptType}.choose`)}
          </StyledButton>
        </StyledConceptResult>
      ))}
    </div>
  );
};

export default SearchConceptResults;
