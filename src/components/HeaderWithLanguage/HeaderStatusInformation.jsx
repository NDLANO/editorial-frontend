/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { injectT } from '@ndla/i18n';
import SafeLink from '@ndla/safelink';
import { colors, fonts, spacing } from '@ndla/core';
import { Check, AlertCircle } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';
import HowToHelper from '../HowTo/HowToHelper';
import config from '../../config';
import LearningpathConnection from './LearningpathConnection';

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
  taxonomyPaths,
  noHelp,
  indentLeft,
  fontSize,
  t,
  type,
  id,
}) => {
  const StyledStatus = styled.p`
    ${fonts.sizes(fontSize || 18, 1.1)};
    font-weight: ${fonts.weight.semibold};
    text-transform: uppercase;
    margin-top: 0;
    margin-bottom: 0;
    margin-right: ${fontSize <= 12 ? spacing.xsmall : spacing.small};
    margin-left: ${indentLeft ? 0 : spacing.small};
  `;

  const StyledSmallText = styled.small`
    color: ${fontSize <= 12 ? '#000' : colors.text.light};
    padding-right: ${spacing.xsmall};
    ${fonts.sizes(fontSize - 1 || 14, 1.1)};
    font-weight: ${fonts.weight.light};
    text-transform: uppercase;
  `;

  const StyledCheckIcon = styled(Check)`
    margin-top: -3px;
    height: ${fontSize || '25px'};
    width: ${fontSize || '25px'};
    fill: ${colors.support.green};
  `;

  const StyledLink = styled(SafeLink)`
    box-shadow: inset 0 0px;
  `;

  const multipleTaxonomyIcon = taxonomyPaths?.length > 2 && (
    <Tooltip tooltip={t('form.workflow.multipleTaxonomy')}>
      <StyledWarnIcon title={t('form.taxonomySection')} />
    </Tooltip>
  );

  const publishedIcon = (
    <Tooltip tooltip={t('form.workflow.published')}>
      <StyledCheckIcon title={t('form.status.published')} />
    </Tooltip>
  );

  const publishedIconLink = (
    <StyledLink target="_blank" to={`${config.ndlaFrontendDomain}${taxonomyPaths?.[0]}`}>
      {publishedIcon}
    </StyledLink>
  );

  const helperIcon = !noHelp && (
    <HowToHelper pageId="status" tooltip={t('form.workflow.statusInfoTooltip')} />
  );

  const learningpathConnections = (type === 'standard' || type === 'topic-article') && (
    <LearningpathConnection id={id} />
  );

  const splitter = !indentLeft && <StyledSplitter />;

  if (noStatus && isNewLanguage) {
    return (
      <StyledStatusWrapper>
        {splitter}
        <StyledStatus>{t('form.status.new_language')}</StyledStatus>
        {published && (taxonomyPaths?.length > 0 ? publishedIconLink : publishedIcon)}
        {multipleTaxonomyIcon}
        {learningpathConnections}
      </StyledStatusWrapper>
    );
  } else if (!noStatus) {
    return (
      <StyledStatusWrapper>
        {splitter}
        <StyledStatus>
          <StyledSmallText>{t('form.workflow.statusLabel')}:</StyledSmallText>
          {isNewLanguage ? t('form.status.new_language') : statusText || t('form.status.new')}
        </StyledStatus>
        {published && (taxonomyPaths?.length > 0 ? publishedIconLink : publishedIcon)}
        {multipleTaxonomyIcon}
        {helperIcon}
        {learningpathConnections}
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
  taxonomyPaths: PropTypes.arrayOf(PropTypes.string),
  noHelp: PropTypes.bool,
  indentLeft: PropTypes.bool,
  fontSize: PropTypes.number,
  type: PropTypes.string,
  id: PropTypes.number,
};

export default injectT(HeaderStatusInformation);
