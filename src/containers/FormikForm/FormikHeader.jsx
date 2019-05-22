/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { colors, fonts, spacing } from '@ndla/core';
import { Camera, SquareAudio, Check } from '@ndla/icons/editor';
import { FileCompare } from '@ndla/icons/action';
import { injectT } from '@ndla/i18n';
import Tooltip from '@ndla/tooltip';
import { ContentTypeBadge, constants } from '@ndla/ui';
import { Link } from 'react-router-dom';
import FormikDeleteLanguageVersion from './components/FormikDeleteLanguageVersion';
import FormikLanguage from './FormikLanguage';
import HowToHelper from '../../components/HowTo/HowToHelper';
import StyledFilledButton from '../../components/StyledFilledButton';
import PreviewDraftLightbox from '../../components/PreviewDraft/PreviewDraftLightbox';

const StyledSplitter = styled.div`
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

const StyledLanguageWrapper = styled.div`
  padding-left: ${spacing.small};
  margin: 0 0 ${spacing.normal};
  display: flex;
  align-items: center;
`;

const StyledLanguagePills = styled.span`
  background: ${colors.brand.light};
  color: ${colors.brand.primary};
  box-shadow: none;
  border-radius: ${spacing.xsmall};
  padding: ${spacing.xsmall} ${spacing.small};
  ${fonts.sizes(16, 1.1)};
  font-weight: ${fonts.weight.semibold};
  margin-right: ${spacing.xsmall};
  transition: all 200ms ease;
  display: flex;
  align-items: center;
  .c-icon {
    margin-right: ${spacing.xsmall};
  }
  ${props =>
    !props.current &&
    css`
      &:focus,
      &:hover {
        color: #fff;
        background: ${colors.brand.primary};
        transform: translate(1px, 1px);
      }
    `}
  ${props =>
    !props.current &&
    css`
      color: #${colors.brand.primary};
      background: transparent;
    `}
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

const types = {
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

const HeaderPart = injectT(({ type, noStatus, statusText, newLanguage, t }) => (
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
));

HeaderPart.propTypes = {
  noStatus: PropTypes.bool,
  statusText: PropTypes.string,
  type: PropTypes.string.isRequired,
  editUrl: PropTypes.func,
  getArticle: PropTypes.func,
  newLanguage: PropTypes.bool,
};

const FormikHeader = ({
  t,
  values,
  type,
  editUrl,
  getArticle,
  statusText,
  noStatus,
}) => {
  const languages = [
    { key: 'nn', title: t('language.nn'), include: true },
    { key: 'en', title: t('language.en'), include: true },
    { key: 'nb', title: t('language.nb'), include: true },
    { key: 'sma', title: t('language.sma'), include: true },
    { key: 'se', title: t('language.se'), include: false },
    { key: 'unknown', title: t('language.unknown'), include: false },
    { key: 'de', title: t('language.de'), include: false },
  ];

  const emptyLanguages = languages.filter(
    lang =>
      lang.key !== values.language &&
      !values.supportedLanguages.includes(lang.key) &&
      lang.include,
  );

  const newLanguage =
    values.id && !values.supportedLanguages.includes(values.language);

  const StyledLanguagePillsLink = StyledLanguagePills.withComponent(Link);

  return (
    <header>
      <HeaderPart
        type={type}
        noStatus={noStatus}
        statusText={statusText}
        newLanguage={newLanguage}
      />
      <StyledLanguageWrapper>
        {values.id ? (
          <Fragment>
            {values.supportedLanguages.map(lang =>
              values.language === lang ? (
                <StyledLanguagePills current key={`types_${lang}`}>
                  <Check />
                  {t(`language.${lang}`)}
                </StyledLanguagePills>
              ) : (
                <Tooltip
                  key={`types_${lang}`}
                  tooltip={t('language.change', {
                    language: t(`language.${lang}`).toLowerCase(),
                  })}>
                  <StyledLanguagePillsLink to={editUrl(lang)}>
                    {t(`language.${lang}`)}
                  </StyledLanguagePillsLink>
                </Tooltip>
              ),
            )}
            {newLanguage && (
              <StyledLanguagePills current key={`types_${values.language}`}>
                <Check />
                {t(`language.${values.language}`)}
              </StyledLanguagePills>
            )}
            <StyledSplitter />
            {!noStatus && (
              <>
                <PreviewDraftLightbox
                  label={t('subNavigation.learningResource')}
                  typeOfPreview="previewLanguageArticle"
                  getArticle={getArticle}>
                  {openPreview => (
                    <StyledFilledButton type="button" onClick={openPreview}>
                      <FileCompare />
                      {t(`form.previewLanguageArticle.button`)}
                    </StyledFilledButton>
                  )}
                </PreviewDraftLightbox>
                <StyledSplitter />
              </>
            )}
            <FormikLanguage emptyLanguages={emptyLanguages} editUrl={editUrl} />
            {!noStatus && <FormikDeleteLanguageVersion values={values} />}
          </Fragment>
        ) : (
          <>
            <div>
              <StyledLanguagePills current>
                <Check />
                {t(`language.${values.language}`)}
              </StyledLanguagePills>
            </div>
            <div />
          </>
        )}
      </StyledLanguageWrapper>
    </header>
  );
};

FormikHeader.propTypes = {
  noStatus: PropTypes.bool,
  statusText: PropTypes.string,
  values: PropTypes.shape({
    id: PropTypes.number,
    language: PropTypes.string,
    supportedLanguages: PropTypes.arrayOf(PropTypes.string),
  }),
  type: PropTypes.string.isRequired,
  editUrl: PropTypes.func,
  getArticle: PropTypes.func,
};

export default injectT(FormikHeader);
