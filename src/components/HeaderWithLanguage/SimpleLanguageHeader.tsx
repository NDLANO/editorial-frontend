/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { Check } from '@ndla/icons/editor';
import HeaderInformation, { StyledSplitter } from './HeaderInformation';
import HeaderSupportedLanguages from './HeaderSupportedLanguages';
import HeaderLanguagePill from './HeaderLanguagePill';
import { StyledLanguageWrapper } from './HeaderWithLanguage';
import HeaderLanguagePicker from './HeaderLanguagePicker';

interface Props {
  articleType: string;
  editUrl: (lang: string) => string;
  id: number;
  isSubmitting: boolean;
  language: string;
  supportedLanguages: string[];
  title: string;
}

const SimpleLanguageHeader = ({
  articleType,
  editUrl,
  id,
  isSubmitting,
  language,
  supportedLanguages,
  title,
}: Props) => {
  const { t } = useTranslation();
  const isNewLanguage = !!id && !supportedLanguages.includes(language);

  const languages = [
    { key: 'nn', title: t('language.nn'), include: true },
    { key: 'en', title: t('language.en'), include: true },
    { key: 'nb', title: t('language.nb'), include: true },
    { key: 'sma', title: t('language.sma'), include: true },
    { key: 'se', title: t('language.se'), include: true },
    { key: 'und', title: t('language.und'), include: false },
    { key: 'de', title: t('language.de'), include: true },
    { key: 'es', title: t('language.es'), include: true },
    { key: 'ukr', title: t('language.ukr'), include: false },
  ];
  const emptyLanguages = languages.filter(
    lang => lang.key !== language && !supportedLanguages.includes(lang.key) && lang.include,
  );

  return (
    <>
      <HeaderInformation
        type={articleType}
        noStatus
        title={title}
        isNewLanguage={isNewLanguage}
        id={id}
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
            <HeaderLanguagePicker emptyLanguages={emptyLanguages} editUrl={editUrl} />
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

export default SimpleLanguageHeader;
