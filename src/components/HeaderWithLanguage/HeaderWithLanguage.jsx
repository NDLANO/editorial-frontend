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

const StyledLanguageWrapper = styled.div`
  padding-left: ${spacing.small};
  margin: 0 0 ${spacing.normal};
  display: flex;
  align-items: center;
`;

const HeaderWithLanguage = ({
  t,
  values,
  noStatus,
  content,
  type,
  ...rest
}) => {
  const { supportedLanguages, articleType } = values;
  const { id, title, status, language } = content;

  const isNewLanguage = id && !supportedLanguages.includes(language);
  const statusText =
    status && status.current
      ? t(`form.status.${status.current.toLowerCase()}`)
      : '';
  return (
    <header>
      <HeaderInformation
        type={articleType ? articleType : type}
        noStatus={noStatus}
        statusText={statusText}
        isNewLanguage={isNewLanguage}
        title={title}
      />
      <StyledLanguageWrapper>
        <HeaderActions
          values={values}
          noStatus={noStatus}
          isNewLanguage={isNewLanguage}
          type={articleType}
          title={title}
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
    status: PropTypes.object,
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
};

export default injectT(HeaderWithLanguage);
