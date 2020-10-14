/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { injectT } from '@ndla/i18n';
import HeaderInformation from './HeaderInformation';
import HeaderActions from './HeaderActions';

export const StyledLanguageWrapper = styled.div`
  padding-left: ${spacing.small};
  margin: 0 0 ${spacing.normal};
  display: flex;
  align-items: center;
`;

const getTaxonomyPathsFromTaxonomy = taxonomy => {
  const taxonomyObjects = Object.values(taxonomy || {});
  const flattenedObjects = [].concat.apply([], taxonomyObjects);
  const nestedTaxonomyPaths = flattenedObjects.map(rt => rt?.paths);
  const flattenedPaths = [].concat.apply([], nestedTaxonomyPaths);

  return flattenedPaths;
};

const HeaderWithLanguage = ({
  content,
  isSubmitting,
  noStatus,
  setTranslateOnContinue,
  t,
  translateArticle,
  type,
  values,
  ...rest
}) => {
  const { supportedLanguages, articleType } = values;
  const { id, title, status, language } = content;

  const isNewLanguage = id && !supportedLanguages.includes(language);
  const statusText = status?.current
    ? t(`form.status.${status.current.toLowerCase()}`)
    : '';
  const published =
    status?.current === 'PUBLISHED' || status?.other?.includes('PUBLISHED');
  const multiType = articleType ? articleType : type;

  const hasMultipleTaxonomyPaths =
    getTaxonomyPathsFromTaxonomy(content?.taxonomy).length > 1;

  return (
    <header>
      <HeaderInformation
        type={multiType}
        noStatus={noStatus}
        statusText={statusText}
        isNewLanguage={isNewLanguage}
        title={title}
        published={published}
        hasMultipleTaxonomyEntries={hasMultipleTaxonomyPaths}
        {...rest}
      />
      <StyledLanguageWrapper>
        <HeaderActions
          values={values}
          noStatus={noStatus}
          isNewLanguage={isNewLanguage}
          type={multiType}
          title={title}
          isSubmitting={isSubmitting}
          translateArticle={translateArticle}
          setTranslateOnContinue={setTranslateOnContinue}
          {...rest}
        />
      </StyledLanguageWrapper>
    </header>
  );
};

HeaderWithLanguage.propTypes = {
  content: PropTypes.shape({
    current: PropTypes.object,
    id: PropTypes.number,
    language: PropTypes.string,
    status: PropTypes.shape({
      current: PropTypes.string,
      other: PropTypes.arrayOf(PropTypes.string),
    }),
    title: PropTypes.string,
  }),
  editUrl: PropTypes.func.isRequired,
  getArticle: PropTypes.func,
  isSubmitting: PropTypes.bool,
  noStatus: PropTypes.bool,
  setTranslateOnContinue: PropTypes.func.isRequired,
  type: PropTypes.oneOf([
    'image',
    'audio',
    'iframe',
    'topic-article',
    'standard',
    'concept',
  ]),
  translateArticle: PropTypes.func,
  values: PropTypes.shape({
    supportedLanguages: PropTypes.arrayOf(PropTypes.string),
    articleType: PropTypes.string,
  }),
};

export default injectT(HeaderWithLanguage);
