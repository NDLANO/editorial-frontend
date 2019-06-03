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
import { Check } from '@ndla/icons/editor';
import { FileCompare } from '@ndla/icons/action';
import { injectT } from '@ndla/i18n';
import Tooltip from '@ndla/tooltip';
import { Link } from 'react-router-dom';
import StyledFilledButton from '../../components/StyledFilledButton';
import PreviewDraftLightbox from '../../components/PreviewDraft/PreviewDraftLightbox';
import { EditorHeader, StyledSplitter } from './EditorHeader';
import LanguagePicker from './LanguagePicker';
import FormikDeleteLanguageVersion from '../../containers/FormikForm/components/FormikDeleteLanguageVersion';

const StyledLanguageWrapper = styled.div`
  padding-left: ${spacing.small};
  margin: 0 0 ${spacing.normal};
  display: flex;
  align-items: center;
`;

const currentStyle = css`
  color: #${colors.brand.primary};
  background: transparent;
  &:focus,
  &:hover {
    color: #fff;
    background: ${colors.brand.primary};
    transform: translate(1px, 1px);
  }
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

  ${props => !props.current && currentStyle}
`;

const HeaderWithLanguage = ({
  t,
  values,
  type,
  editUrl,
  getArticle,
  noStatus,
}) => {
  const { id, language, supportedLanguages, status, articleType } = values;

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
      lang.key !== language &&
      !supportedLanguages.includes(lang.key) &&
      lang.include,
  );

  const newLanguage = id && !supportedLanguages.includes(language);

  const statusText =
    status && status.current
      ? t(`form.status.${status.current.toLowerCase()}`)
      : '';

  const StyledLanguagePillsLink = StyledLanguagePills.withComponent(Link);
  return (
    <header>
      <EditorHeader
        type={articleType || type}
        noStatus={noStatus}
        statusText={statusText}
        newLanguage={newLanguage}
      />
      <StyledLanguageWrapper>
        {id ? (
          <Fragment>
            {supportedLanguages.map(lang =>
              language === lang ? (
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
              <StyledLanguagePills current key={`types_${language}`}>
                <Check />
                {t(`language.${language}`)}
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
            <LanguagePicker emptyLanguages={emptyLanguages} editUrl={editUrl} />
            {!noStatus && <FormikDeleteLanguageVersion values={values} />}
          </Fragment>
        ) : (
          <>
            <div>
              <StyledLanguagePills current>
                <Check />
                {t(`language.${language}`)}
              </StyledLanguagePills>
            </div>
            <div />
          </>
        )}
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
  }),
  editUrl: PropTypes.func,
  getArticle: PropTypes.func,
  type: PropTypes.oneOf(['image', 'audio', 'iframe']),
};

export default injectT(HeaderWithLanguage);
