/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import styled from '@emotion/styled';
import { colors, fonts, spacing } from '@ndla/core';
import HowToHelper from '../HowTo/HowToHelper';

export const StyledSplitter = styled.div`
  width: 1px;
  background: ${colors.brand.lighter};
  height: ${spacing.normal};
  margin: 0 ${spacing.xsmall};
`;

const StyledStatusWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const StyledStatus = styled.p`
  ${fonts.sizes(18, 1.1)};
  font-weight: ${fonts.weight.semibold};
  text-transform: uppercase;
  margin: 0 ${spacing.small};
`;

const StyledSmallText = styled.small`
  color: ${colors.text.light};
  padding-right: ${spacing.xsmall};
  ${fonts.sizes(14, 1.1)};
  font-weight: ${fonts.weight.light};
  text-transform: uppercase;
`;

const HeaderStatusInformation = ({
  noStatus,
  statusText,
  isNewLanguage,
  t,
}) => {
  if (noStatus && isNewLanguage) {
    return (
      <StyledStatusWrapper>
        <StyledSplitter />
        <StyledStatus>{t('form.status.new_language')}</StyledStatus>
      </StyledStatusWrapper>
    );
  } else if (!noStatus) {
    return (
      <StyledStatusWrapper>
        <StyledSplitter />
        <StyledStatus>
          <StyledSmallText>{t('form.workflow.statusLabel')}:</StyledSmallText>
          {isNewLanguage
            ? t('form.status.new_language')
            : statusText || t('form.status.new')}
        </StyledStatus>
        <HowToHelper
          pageId="status"
          tooltip={t('form.workflow.statusInfoTooltip')}
        />
      </StyledStatusWrapper>
    );
  }
  return null;
};

HeaderStatusInformation.propTypes = {
  noStatus: PropTypes.bool,
  statusText: PropTypes.string,
  isNewLanguage: PropTypes.bool,
};

export default injectT(HeaderStatusInformation);
