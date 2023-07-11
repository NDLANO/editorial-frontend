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
import { useCallback, useMemo } from 'react';
import { useFormikContext } from 'formik';
import StyledFilledButton from '../StyledFilledButton';
import { StyledSplitter } from './HeaderInformation';
import HeaderLanguagePicker from './HeaderLanguagePicker';
import TranslateNbToNn from './TranslateNbToNn';
import DeleteLanguageVersion from './DeleteLanguageVersion';
import HeaderSupportedLanguages from './HeaderSupportedLanguages';
import HeaderLanguagePill from './HeaderLanguagePill';
import { useIsTranslatableToNN } from '../NynorskTranslateProvider';
import PreviewDraftLightboxV2 from '../PreviewDraft/PreviewDraftLightboxV2';
import {
  toEditAudio,
  toEditConcept,
  toEditFrontPageArticle,
  toEditImage,
  toEditLearningResource,
  toEditPodcast,
  toEditPodcastSeries,
  toEditTopicArticle,
} from '../../util/routeHelpers';

interface PreviewLightBoxProps {
  article?: IArticle;
  concept?: IConcept;
  type: string;
  currentLanguage: string;
}

const PreviewLightBox = ({ type, currentLanguage, article, concept }: PreviewLightBoxProps) => {
  const { t } = useTranslation();
  if (type === 'concept' && concept) {
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
  id: number;
  isNewLanguage: boolean;
  article?: IArticle;
  concept?: IConcept;
  noStatus: boolean;
  disableDelete: boolean;
  language: string;
  type: keyof typeof toMapping;
  supportedLanguages?: string[];
}

const toMapping = {
  concept: toEditConcept,
  audio: toEditAudio,
  'podcast-series': toEditPodcastSeries,
  podcast: toEditPodcast,
  image: toEditImage,
  'frontpage-article': toEditFrontPageArticle,
  standard: toEditLearningResource,
  'topic-article': toEditTopicArticle,
};

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

const HeaderActions = ({
  isNewLanguage,
  noStatus,
  type,
  id,
  language,
  disableDelete,
  article,
  concept,
  supportedLanguages = [],
}: Props) => {
  const { t } = useTranslation();
  const { isSubmitting } = useFormikContext();
  const showTranslate = useIsTranslatableToNN();

  const editUrl = useCallback(
    (id: number, locale: string) => {
      return toMapping[type](id, locale);
    },
    [type],
  );

  const languages = useMemo(
    () => [
      { key: 'nn', title: t('language.nn'), include: true },
      { key: 'en', title: t('language.en'), include: true },
      { key: 'nb', title: t('language.nb'), include: true },
      { key: 'sma', title: t('language.sma'), include: true },
      { key: 'se', title: t('language.se'), include: true },
      { key: 'und', title: t('language.und'), include: false },
      { key: 'de', title: t('language.de'), include: true },
      { key: 'es', title: t('language.es'), include: true },
      { key: 'ukr', title: t('language.ukr'), include: true },
    ],
    [t],
  );

  const emptyLanguages = useMemo(
    () =>
      languages.filter(
        (lang) => lang.key !== language && !supportedLanguages.includes(lang.key) && lang.include,
      ),
    [language, languages, supportedLanguages],
  );

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
            currentLanguage={language}
          />
          <StyledSplitter />
        </>
      )}
      <HeaderLanguagePicker id={id} emptyLanguages={emptyLanguages} editUrl={editUrl} />
      {translatableTypes.includes(type) &&
        language === 'nb' &&
        showTranslate &&
        !supportedLanguages.includes('nn') && (
          <>
            <StyledSplitter />
            <TranslateNbToNn id={id} editUrl={editUrl} />
          </>
        )}
      {
        <DeleteLanguageVersion
          id={id}
          language={language}
          supportedLanguages={supportedLanguages}
          type={type}
          disabled={disableDelete}
        />
      }
    </>
  );
};

export default HeaderActions;
