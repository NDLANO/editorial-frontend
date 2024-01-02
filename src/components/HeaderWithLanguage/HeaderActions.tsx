/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from 'formik';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { FileCompare } from '@ndla/icons/action';
import { Check, Eye } from '@ndla/icons/editor';
import { IConcept } from '@ndla/types-backend/concept-api';
import { IArticle } from '@ndla/types-backend/draft-api';
import DeleteLanguageVersion from './DeleteLanguageVersion';
import { StyledSplitter } from './HeaderInformation';
import HeaderLanguagePicker from './HeaderLanguagePicker';
import HeaderLanguagePill from './HeaderLanguagePill';
import HeaderSupportedLanguages from './HeaderSupportedLanguages';
import TranslateNbToNn from './TranslateNbToNn';
import { PUBLISHED } from '../../constants';
import { fetchDraftHistory } from '../../modules/draft/draftApi';
import {
  toEditAudio,
  toEditConcept,
  toEditFrontPageArticle,
  toEditGloss,
  toEditImage,
  toEditLearningResource,
  toEditPodcast,
  toEditPodcastSeries,
  toEditTopicArticle,
} from '../../util/routeHelpers';
import { useIsTranslatableToNN } from '../NynorskTranslateProvider';
import PreviewDraftLightboxV2 from '../PreviewDraft/PreviewDraftLightboxV2';
import StyledFilledButton from '../StyledFilledButton';

interface PreviewLightBoxProps {
  article?: IArticle;
  concept?: IConcept;
  type: string;
  currentLanguage: string;
}

const PreviewLightBox = memo(
  ({ type, currentLanguage, article, concept }: PreviewLightBoxProps) => {
    const { t } = useTranslation();
    if ((type === 'concept' || type === 'gloss') && concept) {
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
  },
);

const StyledWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const StyledGroup = styled.div`
  display: flex;
  align-items: center;
`;

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
  gloss: toEditGloss,
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
  'gloss',
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
  const [lastPublishedVersion, setLastPublishedVersion] = useState<IArticle>();

  const { t } = useTranslation();
  const { isSubmitting } = useFormikContext();
  const showTranslate = useIsTranslatableToNN();

  const editUrl = useCallback(
    (id: number, locale: string) => {
      return toMapping[type](id, locale);
    },
    [type],
  );

  useEffect(() => {
    const getVersions = async (article: IArticle) => {
      const versions = await fetchDraftHistory(article.id, article.title?.language);
      const publishedVersion = versions.find((v) => v.status.current === PUBLISHED);
      if (publishedVersion) setLastPublishedVersion(publishedVersion);
    };
    if (article) {
      getVersions(article);
    }
  }, [article]);

  const languages = useMemo(
    () => [
      { key: 'nn', title: t('languages.nn'), include: true },
      { key: 'en', title: t('languages.en'), include: true },
      { key: 'nb', title: t('languages.nb'), include: true },
      { key: 'sma', title: t('languages.sma'), include: true },
      { key: 'se', title: t('languages.se'), include: true },
      { key: 'und', title: t('languages.und'), include: false },
      { key: 'de', title: t('languages.de'), include: true },
      { key: 'es', title: t('languages.es'), include: true },
      { key: 'zh', title: t('languages.zh'), include: true },
      { key: 'ukr', title: t('languages.ukr'), include: true },
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
      <StyledWrapper>
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
            {t(`languages.${language}`)}
          </HeaderLanguagePill>
        )}
        <StyledSplitter />
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
        <StyledGroup>
          {!noStatus && (
            <>
              <StyledSplitter />
              <PreviewLightBox
                article={article}
                concept={concept}
                type={type}
                currentLanguage={language}
              />
            </>
          )}
          {lastPublishedVersion && (
            <>
              <StyledSplitter />
              <PreviewDraftLightboxV2
                type="version"
                article={lastPublishedVersion}
                language={language}
                customTitle={t('form.previewProductionArticle.published')}
                activateButton={
                  <StyledFilledButton type="button">
                    <Eye /> {t('form.previewVersion')}
                  </StyledFilledButton>
                }
              />
            </>
          )}
        </StyledGroup>
      </StyledWrapper>
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

export default memo(HeaderActions);
