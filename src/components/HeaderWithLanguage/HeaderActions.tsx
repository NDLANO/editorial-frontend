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
import { IConcept } from '@ndla/types-concept-api';
import { IUpdatedArticle } from '@ndla/types-draft-api';
import StyledFilledButton from '../StyledFilledButton';
import PreviewDraftLightbox from '../PreviewDraft/PreviewDraftLightbox';
import { StyledSplitter } from './HeaderInformation';
import HeaderLanguagePicker from './HeaderLanguagePicker';
import TranslateNbToNn from './TranslateNbToNn';
import DeleteLanguageVersion from './DeleteLanguageVersion';
import HeaderSupportedLanguages from './HeaderSupportedLanguages';
import HeaderLanguagePill from './HeaderLanguagePill';
import PreviewConceptLightbox from '../PreviewConcept/PreviewConceptLightbox';
import { useIsTranslatableToNN } from '../NynorskTranslateProvider';

type PreviewTypes = IConcept | IUpdatedArticle;

interface PreviewLightBoxProps {
  articleId: number;
  type: string;
  getEntity: () => PreviewTypes;
  articleType?: string;
  supportedLanguages?: string[];
  currentLanguage: string;
}

const PreviewLightBox = ({
  type,
  getEntity,
  articleType,
  supportedLanguages = [],
  currentLanguage,
  articleId,
}: PreviewLightBoxProps) => {
  const { t } = useTranslation();
  if (type === 'concept' && supportedLanguages.length > 1) {
    return (
      <PreviewConceptLightbox
        typeOfPreview="previewLanguageArticle"
        getConcept={getEntity as () => IConcept}
      />
    );
  } else if (type === 'standard' || type === 'topic-article') {
    return (
      <PreviewDraftLightbox
        articleId={articleId}
        currentArticleLanguage={currentLanguage}
        label={t(`articleType.${articleType!}`)}
        typeOfPreview="previewLanguageArticle"
        supportedLanguages={supportedLanguages}
        getArticle={_ => getEntity() as IUpdatedArticle}>
        {(openPreview: () => void) => (
          <StyledFilledButton type="button" onClick={openPreview}>
            <FileCompare />
            {t(`form.previewLanguageArticle.button`)}
          </StyledFilledButton>
        )}
      </PreviewDraftLightbox>
    );
  } else return null;
};

interface Props {
  editUrl?: (url: string) => string;
  getEntity?: () => PreviewTypes;
  isNewLanguage: boolean;
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
  getEntity,
  isNewLanguage,
  isSubmitting,
  noStatus,
  type,
  disableDelete,
  values,
}: Props) => {
  const { t } = useTranslation();
  const showTranslate = useIsTranslatableToNN();
  const { articleType, id, language, supportedLanguages = [] } = values;

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
    lang => lang.key !== language && !supportedLanguages.includes(lang.key) && lang.include,
  );
  const translatableTypes = ['audio', 'concept', 'standard', 'topic-article', 'podcast'];
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
        {!noStatus && getEntity && values.id && (
          <>
            <PreviewLightBox
              articleId={values.id}
              type={type}
              getEntity={getEntity!}
              articleType={articleType}
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
