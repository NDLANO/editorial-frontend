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
import { Check, AlertCircle } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';
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

const StyledWarnIcon = styled(AlertCircle)`
  margin-top: 2px;
  height: 25px;
  width: 25px;
  fill: ${colors.support.yellow};
`;

const HeaderStatusInformation = ({
  noStatus,
  statusText,
  isNewLanguage,
  published,
  hasMultipleTaxonomyEntries,
  noHelp,
  indentLeft,
  fontSize,
  t,
}) => {
  const StyledStatus = styled.p`
    ${fonts.sizes(fontSize ? fontSize : 18, 1.1)};
    font-weight: ${fonts.weight.semibold};
    text-transform: uppercase;
    margin-top: 0;
    margin-bottom: 0;
    margin-right: ${spacing.small};
    margin-left: ${indentLeft ? 0 : spacing.small};
  `;

  const StyledSmallText = styled.small`
    color: ${colors.text.light};
    padding-right: ${spacing.xsmall};
    ${fonts.sizes(fontSize ? fontSize : 14, 1.1)};
    font-weight: ${fonts.weight.light};
    text-transform: uppercase;
  `;

  const StyledCheckIcon = styled(Check)`
    margin-top: 2px;
    height: ${fontSize ? fontSize : '25px'};
    width: ${fontSize ? fontSize : '25px'};
    fill: ${colors.support.green};
  `;

  const multipleTaxonomyIcon = hasMultipleTaxonomyEntries && (
    <Tooltip tooltip={t('form.workflow.multipleTaxonomy')}>
      <StyledWarnIcon title={t('form.taxonomySection')} />
    </Tooltip>
  );

  const publishedIcon = published && (
    <Tooltip tooltip={t('form.workflow.published')}>
      <StyledCheckIcon title={t('form.status.published')} />
    </Tooltip>
  );

  const helperIcon = !noHelp && (
    <HowToHelper
      pageId="status"
      tooltip={t('form.workflow.statusInfoTooltip')}
    />
  );

  const splitter = !indentLeft && <StyledSplitter />;

  if (noStatus && isNewLanguage) {
    return (
      <StyledStatusWrapper>
        {splitter}
        <StyledStatus>{t('form.status.new_language')}</StyledStatus>
        {publishedIcon}
        {multipleTaxonomyIcon}
      </StyledStatusWrapper>
    );
  } else if (!noStatus) {
    return (
      <StyledStatusWrapper>
        {splitter}
        <StyledStatus>
          <StyledSmallText>{t('form.workflow.statusLabel')}:</StyledSmallText>
          {isNewLanguage
            ? t('form.status.new_language')
            : statusText || t('form.status.new')}
        </StyledStatus>
        {publishedIcon}
        {multipleTaxonomyIcon}
        {helperIcon}
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
  hasMultipleTaxonomyEntries: PropTypes.bool,
  noHelp: PropTypes.bool,
  indentLeft: PropTypes.bool,
  fontSize: PropTypes.number,
};

export default injectT(HeaderStatusInformation);
