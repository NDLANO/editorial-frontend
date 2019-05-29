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
import { Camera, SquareAudio } from '@ndla/icons/editor';
import HowToHelper from '../../components/HowTo/HowToHelper';

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
};

export const EditorHeader = injectT(
  ({ type, noStatus, statusText, newLanguage, t }) => (
    <StyledHeader>
      <StyledTitleHeaderWrapper>
        {types[type].icon}
        <h1>{t(`${types[type].form}.title`)}</h1>
      </StyledTitleHeaderWrapper>
      {!noStatus ? (
        <StyledStatusWrapper>
          <StyledSplitter />
          <StyledStatus>
            <StyledSmallText>{t('form.workflow.statusLabel')}:</StyledSmallText>
            {newLanguage
              ? t('form.status.new_language')
              : statusText || t('form.status.new')}
          </StyledStatus>
          <HowToHelper
            pageId="status"
            tooltip={t('form.workflow.statusInfoTooltip')}
          />
        </StyledStatusWrapper>
      ) : (
        newLanguage && (
          <StyledStatusWrapper>
            <StyledSplitter />
            <StyledStatus>{t('form.status.new_language')}</StyledStatus>
          </StyledStatusWrapper>
        )
      )}
    </StyledHeader>
  ),
);
EditorHeader.propTypes = {
  noStatus: PropTypes.bool,
  statusText: PropTypes.string,
  type: PropTypes.string.isRequired,
  editUrl: PropTypes.func,
  getArticle: PropTypes.func,
  newLanguage: PropTypes.bool,
};
