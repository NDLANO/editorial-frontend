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
  const { id, language, supportedLanguages, status } = values;

  const isNewLanguage = id && !supportedLanguages.includes(language);

  const statusText =
    status && status.current
      ? t(`form.status.${status.current.toLowerCase()}`)
      : '';

  return (
    <header>
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
    content: PropTypes.string,
    language: PropTypes.string,
    supportedLanguages: PropTypes.arrayOf(PropTypes.string),
    current: PropTypes.object,
  }),
  editUrl: PropTypes.func.isRequired,
};

export default injectT(HeaderWithLanguage);
