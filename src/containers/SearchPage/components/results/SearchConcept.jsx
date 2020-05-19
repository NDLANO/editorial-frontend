/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { Link } from 'react-router-dom';
import { colors } from '@ndla/core';
import styled from '@emotion/styled';
import { Concept } from '@ndla/icons/editor';
import { searchClasses } from '../../SearchContainer';
import { toEditConcept } from '../../../../util/routeHelpers';
import { convertFieldWithFallback } from '../../../../util/convertFieldWithFallback';
import formatDate from '../../../../util/formatDate';
import HeaderStatusInformation from '../../../../components/HeaderWithLanguage/HeaderStatusInformation';

const StyledInfo = styled.div`
  color: ${colors.text.light};
  line-height: 1rem;
  font-size: 0.7rem;
`;

const SearchConcept = ({ concept, locale, subjects, t }) => {
  const { url: metaImageSrc, alt: metaImageAlt } = concept.metaImage || {};
  const title = convertFieldWithFallback(
    concept,
    'title',
    t('conceptSearch.noTitle'),
  );
  const content = convertFieldWithFallback(
    concept,
    'content',
    t('conceptSearch.noContent'),
  );
  const breadcrumbs = subjects.filter(s => concept.subjectIds?.includes(s.id));
  return (
    <div {...searchClasses('result')}>
      <div {...searchClasses('image')}>
        {metaImageSrc ? (
          <img src={metaImageSrc} alt={metaImageAlt} />
        ) : (
          <Concept className="c-icon--large" />
        )}
      </div>
      <div {...searchClasses('content')}>
        <div {...searchClasses('header')}>
          <Link
            {...searchClasses('link')}
            to={toEditConcept(concept.id, concept.title.language)}>
            <h2 {...searchClasses('title')}>{title}</h2>
            <StyledInfo>
              {`${t('topicArticleForm.info.lastUpdated')} ${formatDate(
                concept.lastUpdated,
              )}`}
            </StyledInfo>
          </Link>
          {concept.supportedLanguages.map(lang => {
            return lang !== locale ? (
              <span
                key={`${lang}_search_content`}
                {...searchClasses('other-link')}>
                <Link
                  {...searchClasses('link')}
                  to={toEditConcept(concept.id, lang)}>
                  {t(`language.${lang}`)}
                </Link>
              </span>
            ) : (
              ''
            );
          })}
        </div>
        <HeaderStatusInformation
          statusText={t(`form.status.${concept.status.current.toLowerCase()}`)}
          published={
            concept.status?.current === 'PUBLISHED' ||
            concept.status?.other.includes('PUBLISHED')
          }
          noHelp
          indentLeft
        />
        <p {...searchClasses('description')}>{content}</p>
        <div {...searchClasses('breadcrumbs')}>
          {breadcrumbs?.map(breadcrumb => (
            <p key={breadcrumb.id} {...searchClasses('breadcrumb')}>
              {breadcrumb.name}
            </p>
          )) || <p {...searchClasses('breadcrumb')} />}
        </div>
      </div>
    </div>
  );
};

SearchConcept.propTypes = {
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
      other: PropTypes.string,
    }),
  }),
  locale: PropTypes.string,
  subjects: PropTypes.array,
};

export default injectT(SearchConcept);
