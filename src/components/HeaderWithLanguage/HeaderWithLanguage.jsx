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

const HeaderWithLanguage = ({ t, values, type, noStatus, ...rest }) => {
  const { id, language, supportedLanguages, status, articleType } = values;

  const isNewLanguage = id && !supportedLanguages.includes(language);

  const statusText =
    status && status.current
      ? t(`form.status.${status.current.toLowerCase()}`)
      : '';

  return (
    <header>
      <HeaderInformation
        type={articleType || type}
        noStatus={noStatus}
        statusText={statusText}
        isNewLanguage={isNewLanguage}
        {...rest}
      />
      <StyledLanguageWrapper>
        <HeaderActions
          values={values}
          noStatus={noStatus}
          isNewLanguage={isNewLanguage}
          {...rest}
        />
      </StyledLanguageWrapper>
    </header>
  );
};

HeaderWithLanguage.propTypes = {
  noStatus: PropTypes.bool,
  values: PropTypes.shape({
    id: PropTypes.number,
    language: PropTypes.string,
    supportedLanguages: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.object,
    articleType: PropTypes.string,
    current: PropTypes.object,
  }),
  editUrl: PropTypes.func.isRequired,
  getArticle: PropTypes.func,
  type: PropTypes.oneOf([
    'image',
    'audio',
    'iframe',
    'topic-article',
    'standard',
  ]).isRequired,
};

export default injectT(HeaderWithLanguage);
