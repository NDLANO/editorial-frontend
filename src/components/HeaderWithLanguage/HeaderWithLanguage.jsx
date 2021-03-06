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
  margin: 0;
  display: flex;
  align-items: center;
`;

const getTaxonomyPathsFromTaxonomy = (taxonomy, articleId) => {
  const taxonomyObjects = Object.values(taxonomy || {});
  const flattenedObjects = [].concat.apply([], taxonomyObjects);
  const nestedTaxonomyPaths = flattenedObjects.map(rt => rt?.paths);
  const flattenedPaths = [].concat.apply([], nestedTaxonomyPaths);
  return flattenedPaths.concat(`/article/${articleId}`);
};

const HeaderWithLanguage = ({
  content,
  isSubmitting,
  noStatus,
  setTranslateOnContinue,
  t,
  translateToNN,
  type,
  values,
  ...rest
}) => {
  const { supportedLanguages, articleType } = values;
  const { id, title, status, language } = content;

  const isNewLanguage = id && !supportedLanguages.includes(language);
  const statusText = status?.current ? t(`form.status.${status.current.toLowerCase()}`) : '';
  const published = status?.current === 'PUBLISHED' || status?.other?.includes('PUBLISHED');
  const multiType = articleType ? articleType : type;
  const isArticle = multiType === 'standard' || multiType === 'topic-article';

  const taxonomyPaths = isArticle ? getTaxonomyPathsFromTaxonomy(content?.taxonomy, id) : [];

  return (
    <header>
      <HeaderInformation
        type={multiType}
        noStatus={noStatus}
        statusText={statusText}
        isNewLanguage={isNewLanguage}
        title={title}
        id={id}
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
          translateToNN={translateToNN}
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
    taxonomy: PropTypes.object,
  }),
  editUrl: PropTypes.func.isRequired,
  getEntity: PropTypes.func,
  isSubmitting: PropTypes.bool,
  noStatus: PropTypes.bool,
  setTranslateOnContinue: PropTypes.func,
  type: PropTypes.oneOf([
    'image',
    'audio',
    'iframe',
    'topic-article',
    'standard',
    'concept',
    'podcast',
    'podcast-series',
  ]),
  translateToNN: PropTypes.func,
  values: PropTypes.shape({
    articleType: PropTypes.string,
    supportedLanguages: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default injectT(HeaderWithLanguage);
