/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { colors } from "@ndla/core";
import { Concept, Globe } from "@ndla/icons/editor";
import { getLicenseByAbbreviation } from "@ndla/licenses";
import { IConceptSummary } from "@ndla/types-backend/concept-api";
import { Node } from "@ndla/types-taxonomy";
import { Text } from "@ndla/typography";
import { LicenseLink } from "@ndla/ui";
import HeaderStatusInformation from "../../../../components/HeaderWithLanguage/HeaderStatusInformation";
import { LocaleType } from "../../../../interfaces";
import { useLicenses } from "../../../../modules/draft/draftQueries";
import formatDate from "../../../../util/formatDate";
import { toEditConcept, toEditGloss } from "../../../../util/routeHelpers";
import {
  NoShadowAnchor,
  StyledSearchBreadcrumb,
  StyledSearchBreadcrumbs,
  StyledSearchContent,
  StyledSearchDescription,
  StyledSearchImageContainer,
  StyledSearchResult,
  StyledSearchTitle,
} from "../form/StyledSearchComponents";

interface Props {
  concept: IConceptSummary;
  locale: LocaleType;
  subjects: Node[];
  editingState: [boolean, Dispatch<SetStateAction<boolean>>];
  responsibleName?: string;
}

const FlexBoxWrapper = styled.div`
  display: flex;
  flex-flow: row;
  margin-right: 0.2rem;
  box-shadow: none;
  align-items: center;
`;

const StyledLink = styled(Link)`
  &:any-link {
    color: ${colors.brand.primary};
  }
`;

const Title = StyledSearchTitle.withComponent("h2");
const NoShadowLink = NoShadowAnchor.withComponent(Link);

const toEditConceptPage = (concept: IConceptSummary, locale?: string) =>
  concept.conceptType === "concept" ? toEditConcept(concept.id, locale) : toEditGloss(concept.id, locale);

const SearchConcept = ({ concept, locale, subjects, editingState, responsibleName }: Props) => {
  const { t } = useTranslation();
  const { data: licenses } = useLicenses();
  const license = licenses && licenses.find((l) => concept.license === l.license);
  const conceptTitle = concept.glossData
    ? `${t(`languages.${concept.glossData.originalLanguage}`)}: ${concept.glossData.gloss}`
    : concept.title.title;

  const conceptInfo = concept.glossData ? concept.title.title : concept.content.content;
  const { url: metaImageSrc, alt: metaImageAlt } = concept.metaImage || {};
  const isGloss = concept.conceptType === "gloss";
  const breadcrumbs = subjects.filter((s) => concept.subjectIds?.includes(s.id));

  return (
    <StyledSearchResult data-testid="concept-search-result">
      <StyledSearchImageContainer>
        {metaImageSrc ? (
          <img src={`${metaImageSrc}?width=200&language=${locale}`} alt={metaImageAlt} />
        ) : isGloss ? (
          <Globe size="large" />
        ) : (
          <Concept size="large" />
        )}
      </StyledSearchImageContainer>
      <StyledSearchContent>
        <div>
          <FlexBoxWrapper>
            <Title>
              <NoShadowLink to={toEditConceptPage(concept)}>{conceptTitle}</NoShadowLink>
            </Title>
          </FlexBoxWrapper>
          <Text element="span" textStyle="meta-text-xsmall">
            {`${t("conceptForm.info.lastUpdated")} ${formatDate(concept.lastUpdated)}`}
          </Text>
          <div>
            {concept.supportedLanguages.map((lang) => {
              return lang !== locale ? (
                <StyledLink key={`language_${lang}_${concept.id}`} to={toEditConceptPage(concept, lang)}>
                  {t(`languages.${lang}`)}
                </StyledLink>
              ) : (
                ""
              );
            })}
          </div>
        </div>
        <StyledSearchDescription>{conceptInfo}</StyledSearchDescription>
        {license && <LicenseLink license={getLicenseByAbbreviation(license.license, locale)} />}
        <StyledSearchBreadcrumbs style={{ marginTop: "0px" }}>
          {breadcrumbs?.map((breadcrumb) => (
            <StyledSearchBreadcrumb key={breadcrumb.id}>{breadcrumb.name}</StyledSearchBreadcrumb>
          )) || <StyledSearchBreadcrumb />}
          <HeaderStatusInformation
            id={concept.id}
            inSearch
            type="concept"
            statusText={t(`form.status.${concept.status?.current.toLowerCase()}`)}
            published={concept.status?.current === "PUBLISHED" || concept.status?.other.includes("PUBLISHED")}
            compact
            responsibleName={responsibleName}
          />
        </StyledSearchBreadcrumbs>
      </StyledSearchContent>
    </StyledSearchResult>
  );
};

export default SearchConcept;
