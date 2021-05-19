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
import config from '../../config';
import LearningpathConnection from './LearningpathConnection';
import EmbedConnection from './EmbedInformation/EmbedConnection';

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
    margin: 0 ${fontSize <= 12 ? spacing.xsmall : spacing.small} 0 ${indentLeft ? 0 : spacing.small};
  `;

  const StyledSmallText = styled.small`
    color: ${fontSize <= 12 ? '#000' : colors.text.light};
    padding-right: ${spacing.xsmall};
    ${fonts.sizes(fontSize - 1 || 14, 1.1)};
    font-weight: ${fonts.weight.light};
    text-transform: uppercase;
  `;

  const StyledCheckIcon = styled(Check)`
    height: ${spacing.normal};
    width: ${spacing.normal};
    fill: ${colors.support.green};
  `;

  const StyledWarnIcon = styled(AlertCircle)`
    height: ${spacing.normal};
    width: ${spacing.normal};
    fill: ${colors.support.yellow};
  `;

  const StyledLink = styled(SafeLink)`
    box-shadow: inset 0 0;
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

  const learningpathConnections = (type === 'standard' || type === 'topic-article') && (
    <LearningpathConnection id={id} />
  );

  const imageConnections = type === 'image' && <EmbedConnection id={id} />;

  const splitter = !indentLeft && <StyledSplitter />;

  if (noStatus && isNewLanguage) {
    return (
      <StyledStatusWrapper>
        {splitter}
        {published && (taxonomyPaths?.length > 0 ? publishedIconLink : publishedIcon)}
        {multipleTaxonomyIcon}
        {learningpathConnections}
        {imageConnections}
        <StyledStatus>{t('form.status.new_language')}</StyledStatus>
      </StyledStatusWrapper>
    );
  } else if (!noStatus) {
    return (
      <StyledStatusWrapper>
        {splitter}
        {published && (taxonomyPaths?.length > 0 ? publishedIconLink : publishedIcon)}
        {multipleTaxonomyIcon}
        {learningpathConnections}
        <StyledStatus>
          <StyledSmallText>{t('form.workflow.statusLabel')}:</StyledSmallText>
          {isNewLanguage ? t('form.status.new_language') : statusText || t('form.status.new')}
        </StyledStatus>
      </StyledStatusWrapper>
    );
  } else if (type === 'image') {
    return <StyledStatusWrapper>{imageConnections}</StyledStatusWrapper>;
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
