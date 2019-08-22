/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import styled from '@emotion/styled';
import { ContentTypeBadge, constants } from '@ndla/ui';
import { colors, fonts, spacing } from '@ndla/core';
import { Camera, SquareAudio, Concept } from '@ndla/icons/editor';
import HeaderStatusInformation from './HeaderStatusInformation';

export const StyledSplitter = styled.div`
  width: 1px;
  background: ${colors.brand.lighter};
  height: ${spacing.normal};
  margin: 0 ${spacing.xsmall};
`;

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${spacing.small} 0 ${spacing.xsmall};
  margin: ${spacing.normal} 0 ${spacing.small};
  border-bottom: 2px solid ${colors.brand.light};
`;

const StyledTitleHeaderWrapper = styled.div`
  padding-left: ${spacing.small};
  display: flex;
  align-items: center;
  h1 {
    ${fonts.sizes(26, 1.1)};
    font-weight: ${fonts.weight.semibold};
    margin: ${spacing.small} ${spacing.normal} ${spacing.small} ${spacing.small};
    color: ${colors.text.primary};
  }
`;

const { contentTypes } = constants;

export const types = {
  standard: {
    form: 'learningResourceForm',
    cssModifier: 'article',
    icon: (
      <ContentTypeBadge
        type={contentTypes.SUBJECT_MATERIAL}
        background
        size="small"
      />
    ),
  },
  'topic-article': {
    form: 'topicArticleForm',
    cssModifier: 'article',
    icon: (
      <ContentTypeBadge type={contentTypes.SUBJECT} background size="small" />
    ),
  },
  image: { form: 'imageForm', cssModifier: 'multimedia', icon: <Camera /> },
  audio: {
    form: 'audioForm',
    cssModifier: 'multimedia',
    icon: <SquareAudio />,
  },
  concept: {
    form: 'conceptform',
    cssModifier: 'concept',
    icon: <Concept />,
  },
};

const HeaderInformation = ({
  type,
  noStatus,
  statusText,
  isNewLanguage,
  title,
  t,
}) => (
  <StyledHeader>
    <StyledTitleHeaderWrapper>
      {types[type].icon}
      <h1>{t(`${types[type].form}.title`) + ': ' + title}</h1>
    </StyledTitleHeaderWrapper>
    <HeaderStatusInformation
      noStatus={noStatus}
      statusText={statusText}
      isNewLanguage={isNewLanguage}
    />
  </StyledHeader>
);

HeaderInformation.propTypes = {
  noStatus: PropTypes.bool,
  statusText: PropTypes.string,
  type: PropTypes.string.isRequired,
  editUrl: PropTypes.func.isRequired,
  getArticle: PropTypes.func,
  isNewLanguage: PropTypes.bool,
  title: PropTypes.string,
};

export default injectT(HeaderInformation);
