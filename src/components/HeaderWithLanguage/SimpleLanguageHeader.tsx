/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { Check } from '@ndla/icons/editor';
import HeaderInformation from './HeaderInformation';
import HeaderSupportedLanguages from './HeaderSupportedLanguages';
import HeaderLanguagePill from './HeaderLanguagePill';
import { StyledSplitter } from './HeaderInformation';
import { StyledLanguageWrapper } from './HeaderWithLanguage';
import HeaderLanguagePicker from './HeaderLanguagePicker';

interface Props {
  articleType: string;
  editUrl: (lang: string) => string;
  id: number;
  isSubmitting: Boolean;
  language: string;
  supportedLanguages: string[];
  title: string;
}

const SimpleLanguageHeader: FC<Props & tType> = ({
  t,
  articleType,
  editUrl,
  id,
  isSubmitting,
  language,
  supportedLanguages,
  title,
}) => {
  const isNewLanguage = id && !supportedLanguages.includes(language);

  const languages = [
    { key: 'nn', title: t('language.nn'), include: true },
    { key: 'en', title: t('language.en'), include: true },
    { key: 'nb', title: t('language.nb'), include: true },
    { key: 'sma', title: t('language.sma'), include: false },
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

  return (
    <>
      <HeaderInformation
        type={articleType}
        noStatus
        title={title}
        isNewLanguage={isNewLanguage}
      />
      <StyledLanguageWrapper>
        {id ? (
          <>
            <HeaderSupportedLanguages
              id={id}
              editUrl={editUrl}
              language={language}
              supportedLanguages={supportedLanguages}
              isSubmitting={isSubmitting}
            />
            {isNewLanguage && (
              <HeaderLanguagePill current key={`types_${language}`}>
                <Check />
                {t(`language.${language}`)}
              </HeaderLanguagePill>
            )}
            <StyledSplitter />
            <HeaderLanguagePicker
              emptyLanguages={emptyLanguages}
              editUrl={editUrl}
            />
          </>
        ) : (
          <>
            <HeaderLanguagePill current>
              <Check />
              {t(`language.${language}`)}
            </HeaderLanguagePill>
          </>
        )}
      </StyledLanguageWrapper>
    </>
  );
};

export default injectT(SimpleLanguageHeader);
