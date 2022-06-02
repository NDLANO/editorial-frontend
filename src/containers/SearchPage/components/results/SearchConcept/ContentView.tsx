/*
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import Button from '@ndla/button';
import { LicenseByline, getLicenseByAbbreviation } from '@ndla/licenses';
import { colors } from '@ndla/core';
import { css } from '@emotion/core';
import { IConceptSummary } from '@ndla/types-concept-api';
import {
  StyledInfo,
  StyledConceptView,
  StyledLink,
  StyledDescription,
  StyledBreadcrumbs,
  Crumb,
} from './SearchStyles';
import formatDate from '../../../../../util/formatDate';
import { toEditConcept } from '../../../../../util/routeHelpers';
import HeaderStatusInformation from '../../../../../components/HeaderWithLanguage/HeaderStatusInformation';
import { LocaleType } from '../../../../../interfaces';
import { SubjectType } from '../../../../../modules/taxonomy/taxonomyApiInterfaces';
import { useLicenses } from '../../../../../modules/draft/draftQueries';

interface Props {
  concept: IConceptSummary;
  locale: LocaleType;
  title: string;
  content: string;
  breadcrumbs: SubjectType[];
  setShowForm: () => void;
  editing: boolean;
}

const ContentView = ({
  concept,
  locale,
  title,
  content,
  breadcrumbs,
  setShowForm,
  editing,
}: Props) => {
  const { t } = useTranslation();
  const { data: licenses } = useLicenses();
  const license = licenses && licenses.find(l => concept.license === l.license);

  return (
    <StyledConceptView>
      <h2>
        <StyledLink noShadow to={toEditConcept(concept.id)}>
          {title}
        </StyledLink>
        {!editing && (
          <Button
            css={css`
              line-height: 1;
              font-size: 0.7rem;
              padding: 4px 6px;
              margin-left: 5px;
            `}
            onClick={setShowForm}>
            {t('form.edit')}
          </Button>
        )}
      </h2>
      <StyledInfo>
        {`${t('topicArticleForm.info.lastUpdated')} ${formatDate(concept.lastUpdated)}`}
      </StyledInfo>
      <div>
        {concept.supportedLanguages.map(lang => {
          return lang !== locale ? (
            <StyledLink
              other
              key={`language_${lang}_${concept.id}`}
              to={toEditConcept(concept.id, lang)}>
              {t(`language.${lang}`)}
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
        {breadcrumbs?.map(breadcrumb => <Crumb key={breadcrumb.id}>{breadcrumb.name}</Crumb>) || (
          <Crumb />
        )}
        <HeaderStatusInformation
          statusText={t(`form.status.${concept.status?.current.toLowerCase()}`)}
          published={
            concept.status?.current === 'PUBLISHED' || concept.status?.other.includes('PUBLISHED')
          }
          indentLeft
          fontSize={10}
        />
      </StyledBreadcrumbs>
    </StyledConceptView>
  );
};

export default ContentView;
