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
import { Check } from '@ndla/icons/editor';
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
  white-space: nowrap;
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

const StyledCheckIcon = styled(Check)`
  margin-top: 2px;
  height: 25px;
  width: 25px;
  fill: ${colors.support.green};
`;

const HeaderStatusInformation = ({
  noStatus,
  statusText,
  isNewLanguage,
  published,
  t,
}) => {
  if (noStatus && isNewLanguage) {
    return (
      <StyledStatusWrapper>
        <StyledSplitter />
        <StyledStatus>{t('form.status.new_language')}</StyledStatus>
        {published && <StyledCheckIcon title={t('form.status.published')} />}
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
        {published && <StyledCheckIcon title={t('form.status.published')} />}
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
  published: PropTypes.bool,
};

export default injectT(HeaderStatusInformation);
