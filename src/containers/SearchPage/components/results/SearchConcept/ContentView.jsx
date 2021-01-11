/*
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import { css } from '@emotion/core';
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

const ContentView = ({
  concept,
  locale,
  title,
  content,
  breadcrumbs,
  setShowForm,
  t,
  editing,
  licenses,
}) => {
  const license = licenses && licenses.find(l => concept.license === l.license);

  return (
    <StyledConceptView>
      <h2>
        <StyledLink
          noShadow
          to={toEditConcept(concept.id, concept.title.language)}>
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
        {`${t('topicArticleForm.info.lastUpdated')} ${formatDate(
          concept.lastUpdated,
        )}`}
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
        <StyledDescription>
          {t('form.name.license')}: {license.description}
        </StyledDescription>
      )}
      <StyledBreadcrumbs>
        {breadcrumbs?.map(breadcrumb => (
          <Crumb key={breadcrumb.id}>{breadcrumb.name}</Crumb>
        )) || <Crumb />}
        <HeaderStatusInformation
          statusText={t(`form.status.${concept.status.current.toLowerCase()}`)}
          published={
            concept.status?.current === 'PUBLISHED' ||
            concept.status?.other.includes('PUBLISHED')
          }
          noHelp
          indentLeft
          fontSize={10}
        />
      </StyledBreadcrumbs>
    </StyledConceptView>
  );
};

ContentView.propTypes = {
  concept: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.shape({
      title: PropTypes.string,
      language: PropTypes.string,
    }),
    content: PropTypes.shape({
      content: PropTypes.string,
    }),
    supportedLanguages: PropTypes.arrayOf(PropTypes.string),
    subjectIds: PropTypes.arrayOf(PropTypes.string),
    metaImage: PropTypes.shape({
      alt: PropTypes.string,
      url: PropTypes.string,
    }),
    lastUpdated: PropTypes.string,
    status: PropTypes.shape({
      current: PropTypes.string,
      other: PropTypes.arrayOf(PropTypes.string),
    }),
    license: PropTypes.string,
  }),
  locale: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
  breadcrumbs: PropTypes.array,
  setShowForm: PropTypes.func,
  editing: PropTypes.bool,
  licenses: PropTypes.array,
};

export default ContentView;
