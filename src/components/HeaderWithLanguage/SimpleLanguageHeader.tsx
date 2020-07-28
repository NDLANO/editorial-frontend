import React, { FC } from 'react';
import { injectT } from '@ndla/i18n';
import { Check } from '@ndla/icons/editor';
import { TranslateType } from '../../interfaces';
import HeaderInformation from './HeaderInformation';
import HeaderSupportedLanguages from './HeaderSupportedLanguages';
import HeaderLanguagePill from './HeaderLanguagePill';
import { StyledSplitter } from './HeaderInformation';
import { StyledLanguageWrapper } from './HeaderWithLanguage';
import HeaderLanguagePicker from './HeaderLanguagePicker';
import { Values } from '../SlateEditor/editorTypes';

interface Props {
  t: TranslateType;
  values: Values;
  editUrl: Function;
  isSubmitting: Boolean;
}

const SimpleLanguageHeader: FC<Props> = ({
  t,
  values,
  editUrl,
  isSubmitting,
}) => {
  const { id, title, supportedLanguages, language, articleType } = values;

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
            />{' '}
          </>
        ) : (
          <>
            <div>
              <HeaderLanguagePill current>
                <Check />
                {t(`language.${language}`)}
              </HeaderLanguagePill>
            </div>
            <div />
          </>
        )}
      </StyledLanguageWrapper>
    </>
  );
};

export default injectT(SimpleLanguageHeader);
