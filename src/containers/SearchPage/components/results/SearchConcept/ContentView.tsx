/*
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { ButtonV2 } from '@ndla/button';
import { getLicenseByAbbreviation } from '@ndla/licenses';
import { LicenseByline } from '@ndla/notion';
import { colors } from '@ndla/core';
import styled from '@emotion/styled';
import { IConceptSummary } from '@ndla/types-backend/concept-api';
import { Node } from '@ndla/types-taxonomy';
import {
  StyledInfo,
  StyledConceptView,
  StyledLink,
  StyledDescription,
  StyledBreadcrumbs,
  Crumb,
} from './SearchStyles';
import formatDate from '../../../../../util/formatDate';
import { toEditConcept, toEditGloss } from '../../../../../util/routeHelpers';
import HeaderStatusInformation from '../../../../../components/HeaderWithLanguage/HeaderStatusInformation';
import { LocaleType } from '../../../../../interfaces';
import { useLicenses } from '../../../../../modules/draft/draftQueries';

interface Props {
  concept: IConceptSummary;
  locale: LocaleType;
  title: string;
  content: string;
  breadcrumbs: Node[];
  setShowForm: () => void;
  editing: boolean;
  responsibleName?: string;
}

const StyledButton = styled(ButtonV2)`
  min-height: 24px;
  line-height: 1;
  font-size: 0.7rem;
  padding: 4px 6px;
  margin-left: 5px;
`;

const toEditConceptPage = (concept: IConceptSummary, locale?: string) =>
  concept.conceptType === 'concept'
    ? toEditConcept(concept.id, locale)
    : toEditGloss(concept.id, locale);

const ContentView = ({
  concept,
  locale,
  title,
  content,
  breadcrumbs,
  setShowForm,
  editing,
  responsibleName,
}: Props) => {
  const { t } = useTranslation();
  const { data: licenses } = useLicenses();
  const license = licenses && licenses.find((l) => concept.license === l.license);

  return (
    <StyledConceptView>
      <h2>
        <StyledLink noShadow to={toEditConceptPage(concept)}>
          {title}
        </StyledLink>
        {false && !editing && <StyledButton onClick={setShowForm}>{t('form.edit')}</StyledButton>}
      </h2>
      <StyledInfo>
        {`${t('topicArticleForm.info.lastUpdated')} ${formatDate(concept.lastUpdated)}`}
      </StyledInfo>
      <div>
        {concept.supportedLanguages.map((lang) => {
          return lang !== locale ? (
            <StyledLink
              other
              key={`language_${lang}_${concept.id}`}
              to={toEditConceptPage(concept, lang)}
            >
              {t(`languages.${lang}`)}
            </StyledLink>
          ) : (
            ''
          );
        })}
      </div>
      <StyledDescription>{content}</StyledDescription>
      {license && (
        <LicenseByline
          licenseRights={getLicenseByAbbreviation(license.license, locale).rights}
          locale={locale}
          color={colors.brand.grey}
        />
      )}
      <StyledBreadcrumbs>
        {breadcrumbs?.map((breadcrumb) => <Crumb key={breadcrumb.id}>{breadcrumb.name}</Crumb>) || (
          <Crumb />
        )}
        <HeaderStatusInformation
          id={concept.id}
          inSearch
          type="concept"
          statusText={t(`form.status.${concept.status?.current.toLowerCase()}`)}
          published={
            concept.status?.current === 'PUBLISHED' || concept.status?.other.includes('PUBLISHED')
          }
          compact
          responsibleName={responsibleName}
        />
      </StyledBreadcrumbs>
    </StyledConceptView>
  );
};

export default ContentView;
