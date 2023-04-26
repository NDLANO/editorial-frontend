/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Check } from '@ndla/icons/editor';
import { FileCompare } from '@ndla/icons/action';
import { useTranslation } from 'react-i18next';
import { IConcept } from '@ndla/types-backend/concept-api';
import { IArticle } from '@ndla/types-backend/draft-api';
import StyledFilledButton from '../StyledFilledButton';
import { StyledSplitter } from './HeaderInformation';
import HeaderLanguagePicker from './HeaderLanguagePicker';
import TranslateNbToNn from './TranslateNbToNn';
import DeleteLanguageVersion from './DeleteLanguageVersion';
import HeaderSupportedLanguages from './HeaderSupportedLanguages';
import HeaderLanguagePill from './HeaderLanguagePill';
import { useIsTranslatableToNN } from '../NynorskTranslateProvider';
import PreviewDraftLightboxV2 from '../PreviewDraft/PreviewDraftLightboxV2';

interface PreviewLightBoxProps {
  article?: IArticle;
  concept?: IConcept;
  type: string;
  supportedLanguages?: string[];
  currentLanguage: string;
}

const PreviewLightBox = ({
  type,
  supportedLanguages = [],
  currentLanguage,
  article,
  concept,
}: PreviewLightBoxProps) => {
  const { t } = useTranslation();
  if (type === 'concept' && concept && supportedLanguages.length > 1) {
    return (
      <PreviewDraftLightboxV2
        type="conceptCompare"
        concept={concept}
        language={currentLanguage}
        activateButton={
          <StyledFilledButton type="button">
            <FileCompare /> {t('form.previewLanguageArticle.button')}
          </StyledFilledButton>
        }
      />
    );
  } else if (
    (type === 'standard' || type === 'topic-article' || type === 'frontpage-article') &&
    article
  ) {
    return (
      <PreviewDraftLightboxV2
        type="compare"
        article={article}
        language={currentLanguage}
        activateButton={
          <StyledFilledButton type="button">
            <FileCompare /> {t('form.previewLanguageArticle.button')}
          </StyledFilledButton>
        }
      />
    );
  } else return null;
};

interface Props {
  editUrl?: (url: string) => string;
  isNewLanguage: boolean;
  article?: IArticle;
  concept?: IConcept;
  isSubmitting?: boolean;
  noStatus: boolean;
  disableDelete: boolean;
  type: string;
  values: {
    articleType?: string;
    id?: number;
    language: string;
    supportedLanguages: string[];
  };
}

const HeaderActions = ({
  editUrl,
  isNewLanguage,
  isSubmitting,
  noStatus,
  type,
  disableDelete,
  article,
  concept,
  values,
}: Props) => {
  const { t } = useTranslation();
  const showTranslate = useIsTranslatableToNN();
  const { id, language, supportedLanguages = [] } = values;

  const languages = [
    { key: 'nn', title: t('language.nn'), include: true },
    { key: 'en', title: t('language.en'), include: true },
    { key: 'nb', title: t('language.nb'), include: true },
    { key: 'sma', title: t('language.sma'), include: true },
    { key: 'se', title: t('language.se'), include: true },
    { key: 'und', title: t('language.und'), include: false },
    { key: 'de', title: t('language.de'), include: true },
    { key: 'es', title: t('language.es'), include: true },
    { key: 'ukr', title: t('language.ukr'), include: true },
  ];
  const emptyLanguages = languages.filter(
    (lang) => lang.key !== language && !supportedLanguages.includes(lang.key) && lang.include,
  );
  const translatableTypes = [
    'audio',
    'concept',
    'standard',
    'topic-article',
    'podcast',
    'image',
    'podcast-series',
    'frontpage-article',
  ];
  if (id && editUrl) {
    return (
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
        {!noStatus && (
          <>
            <PreviewLightBox
              article={article}
              concept={concept}
              type={type}
              supportedLanguages={supportedLanguages}
              currentLanguage={values.language}
            />
            <StyledSplitter />
          </>
        )}
        <HeaderLanguagePicker emptyLanguages={emptyLanguages} editUrl={editUrl} />
        {translatableTypes.includes(type) &&
          language === 'nb' &&
          showTranslate &&
          !supportedLanguages.includes('nn') && (
            <>
              <StyledSplitter />
              <TranslateNbToNn editUrl={editUrl} />
            </>
          )}
        {<DeleteLanguageVersion values={values} type={type} disabled={disableDelete} />}
      </>
    );
  }
  return (
    <HeaderLanguagePill current>
      <Check />
      {t(`language.${language}`)}
    </HeaderLanguagePill>
  );
};

export default HeaderActions;
