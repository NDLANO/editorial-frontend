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

const getTaxonomyPathsFromTaxonomy = (taxonomy, articleId) => {
  const taxonomyObjects = Object.values(taxonomy || {});
  const flattenedObjects = [].concat.apply([], taxonomyObjects);
  const primaryTaxonomyPaths = flattenedObjects.map(rt => rt?.path);
  const nestedTaxonomyPaths = flattenedObjects.map(rt => rt?.paths);
  const flattenedPaths = [].concat.apply(
    primaryTaxonomyPaths,
    nestedTaxonomyPaths.map(path => `/subjects${path}`),
  );

  return flattenedPaths.concat(`/article/${articleId}`);
};

const HeaderWithLanguage = ({
  t,
  values,
  noStatus,
  content,
  type,
  isSubmitting,
  translateArticle,
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

  const taxonomyPaths = getTaxonomyPathsFromTaxonomy(content?.taxonomy, id);

  return (
    <header>
      <HeaderInformation
        type={multiType}
        noStatus={noStatus}
        statusText={statusText}
        isNewLanguage={isNewLanguage}
        title={title}
        published={published}
        taxonomyPaths={taxonomyPaths}
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
          {...rest}
        />
      </StyledLanguageWrapper>
    </header>
  );
};

HeaderWithLanguage.propTypes = {
  noStatus: PropTypes.bool,
  values: PropTypes.shape({
    supportedLanguages: PropTypes.arrayOf(PropTypes.string),
    articleType: PropTypes.string,
  }),
  content: PropTypes.shape({
    id: PropTypes.number,
    language: PropTypes.string,
    status: PropTypes.shape({
      current: PropTypes.string,
      other: PropTypes.arrayOf(PropTypes.string),
    }),
    current: PropTypes.object,
    title: PropTypes.string,
  }),
  editUrl: PropTypes.func.isRequired,
  getArticle: PropTypes.func,
  type: PropTypes.oneOf([
    'image',
    'audio',
    'iframe',
    'topic-article',
    'standard',
    'concept',
  ]),
  isSubmitting: PropTypes.bool,
  translateArticle: PropTypes.func,
};

export default injectT(HeaderWithLanguage);
