/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from 'formik';
import { ReactElement, useMemo, useState, ElementType } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import {
  ModalCloseButton,
  ModalHeader,
  ModalSizeType,
  Modal,
  ModalTrigger,
  ModalContent,
} from '@ndla/modal';
import { IConcept } from '@ndla/types-backend/concept-api';
import { IArticle } from '@ndla/types-backend/draft-api';
import { OneColumn } from '@ndla/ui';
import PreviewConceptComponent from './PreviewConcept';
import PreviewDraft from './PreviewDraft';
import { learningResourceFormTypeToDraftApiType } from '../../containers/ArticlePage/articleTransformers';
import { ConceptFormValues } from '../../containers/ConceptPage/conceptInterfaces';
import { conceptFormTypeToApiType } from '../../containers/ConceptPage/conceptTransformers';
import { LearningResourceFormType } from '../../containers/FormikForm/articleFormHooks';
import { useConcept } from '../../modules/concept/conceptQueries';
import { useDraft, useLicenses } from '../../modules/draft/draftQueries';

interface BaseProps {
  type: 'markup' | 'version' | 'compare' | 'conceptCompare' | 'concept';
  language: string;
  activateButton: ReactElement;
}

interface MarkupPreviewProps extends BaseProps {
  type: 'markup';
  article: IArticle;
}

interface VersionPreviewProps extends BaseProps {
  type: 'version';
  article: IArticle;
  customTitle?: string;
}

interface ComparePreviewProps extends BaseProps {
  type: 'compare';
  article: IArticle;
}

interface CompareConceptPreviewProps extends BaseProps {
  type: 'conceptCompare';
  concept: IConcept;
}

interface ConceptPreviewProps extends BaseProps {
  type: 'concept';
}

type Props =
  | MarkupPreviewProps
  | VersionPreviewProps
  | ComparePreviewProps
  | CompareConceptPreviewProps
  | ConceptPreviewProps;

const StyledPreviewWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  display: inline-flex;
  justify-content: center;
  & .c-article {
    padding: 0;
    margin-top: 20px;
    line-height: unset;
    font-family: unset;
    > section {
      width: unset !important;
      left: unset !important;
    }
    & .c-article__header {
      margin-bottom: unset;
    }
  }
`;

const PreviewMarkup = ({ article, language }: MarkupPreviewProps) => {
  const { t } = useTranslation();
  return (
    <StyledPreviewWrapper>
      <OneColumn>
        <PreviewDraft
          type="article"
          draft={article}
          language={language}
          label={t('form.previewProductionArticle.article')}
        />
      </OneColumn>
    </StyledPreviewWrapper>
  );
};

const TwoArticleWrapper = styled(StyledPreviewWrapper)`
  > div {
    margin: 0 2.5%;
    width: 40%;
    > h2 {
      margin: 0;
      margin-left: ${spacing.large};
    }
    > article {
      max-width: unset;
    }
  }
`;

const PreviewVersion = ({ article, language, customTitle }: VersionPreviewProps) => {
  const { t } = useTranslation();
  const { values, initialValues } = useFormikContext<LearningResourceFormType>();
  const { data: licenses = [] } = useLicenses();
  const formArticle = useMemo(() => {
    const apiType = learningResourceFormTypeToDraftApiType(values, initialValues, licenses);
    return {
      id: article.id,
      articleType: article.articleType,
      title: apiType.title ?? '',
      content: apiType.content ?? '',
      introduction: apiType.introduction ?? '',
      visualElement: apiType.visualElement,
      published: apiType.published,
      copyright: apiType.copyright,
    };
  }, [values, initialValues, licenses, article.id, article.articleType]);

  return (
    <TwoArticleWrapper>
      <div>
        <div className="u-4/6@desktop u-push-1/6@desktop">
          <h2>{t('form.previewProductionArticle.current')}</h2>
        </div>
        <PreviewDraft
          type="formArticle"
          draft={formArticle}
          language={language}
          label={article.articleType}
        />
      </div>
      <div>
        <div className="u-4/6@desktop u-push-1/6@desktop">
          <h2>
            {customTitle
              ? t(customTitle)
              : t('form.previewProductionArticle.version', { revision: article.revision })}
          </h2>
        </div>
        <PreviewDraft
          type="article"
          draft={article}
          language={language}
          label={article.articleType}
        />
      </div>
    </TwoArticleWrapper>
  );
};

const PreviewTitleWrapper = styled.div`
  height: 90px;
`;

const PreviewCompare = ({ article, language }: ComparePreviewProps) => {
  const [previewLanguage, setPreviewLanguage] = useState<string>(
    article.supportedLanguages.find((l) => l !== language) ?? article.supportedLanguages[0]!,
  );
  const draft = useDraft({ id: article.id, language: previewLanguage });
  const { t } = useTranslation();
  const { values, initialValues } = useFormikContext<LearningResourceFormType>();
  const { data: licenses = [] } = useLicenses();
  const formArticle = useMemo(() => {
    const apiType = learningResourceFormTypeToDraftApiType(values, initialValues, licenses);
    return {
      id: article.id,
      title: apiType.title ?? '',
      content: apiType.content ?? '',
      introduction: apiType.introduction ?? '',
      visualElement: apiType.visualElement,
      published: apiType.published,
      copyright: apiType.copyright,
    };
  }, [values, initialValues, licenses, article.id]);

  return (
    <TwoArticleWrapper>
      <div>
        <PreviewTitleWrapper className="u-4/6@desktop u-push-1/6@desktop">
          <h2>
            {t(`form.previewLanguageArticle.title`, {
              language: t(`languages.${language}`).toLowerCase(),
            })}
          </h2>
        </PreviewTitleWrapper>
        <PreviewDraft
          type="formArticle"
          draft={formArticle}
          language={language}
          label={t(`articleType.${article.articleType}`)}
        />
      </div>
      <div>
        <PreviewTitleWrapper className="u-4/6@desktop u-push-1/6@desktop">
          <h2>
            {t('form.previewLanguageArticle.title', {
              language: t(`languages.${previewLanguage}`).toLowerCase(),
            })}
          </h2>
          <select onChange={(evt) => setPreviewLanguage(evt.target.value)} value={previewLanguage}>
            {article.supportedLanguages.map((language) => (
              <option key={language} value={language}>
                {t(`languages.${language}`)}
              </option>
            ))}
          </select>
        </PreviewTitleWrapper>
        {draft.data && (
          <PreviewDraft
            type="article"
            draft={draft.data}
            language={language}
            label={t(`articleType.${draft.data.articleType}`)}
          />
        )}
      </div>
    </TwoArticleWrapper>
  );
};

const ConceptWrapper = styled.div`
  padding: 0 ${spacing.normal} ${spacing.normal} ${spacing.normal};
`;

const PreviewHeading = styled.h2`
  margin: 0;
`;

const PreviewConceptCompare = ({ concept, language }: CompareConceptPreviewProps) => {
  const [previewLanguage, setPreviewLanguage] = useState<string>(
    concept.supportedLanguages.find((l) => l !== language) ?? concept.supportedLanguages[0]!,
  );
  const apiConcept = useConcept({ id: concept.id, language: previewLanguage });
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const { t } = useTranslation();
  const { values } = useFormikContext<ConceptFormValues>();
  const formConcept = useMemo(
    () => conceptFormTypeToApiType(values, licenses!, values.conceptType, concept.updatedBy),
    [values, licenses, concept.updatedBy],
  );
  return (
    <TwoArticleWrapper>
      <ConceptWrapper>
        <PreviewTitleWrapper>
          <PreviewHeading>
            {t('form.previewLanguageArticle.title', {
              language: t(`languages.${language}`).toLowerCase(),
            })}
          </PreviewHeading>
        </PreviewTitleWrapper>
        <PreviewConceptComponent concept={formConcept} language={language} />
      </ConceptWrapper>
      <ConceptWrapper>
        <PreviewTitleWrapper>
          <PreviewHeading>
            {t('form.previewLanguageArticle.title', {
              language: t(`languages.${previewLanguage}`).toLowerCase(),
            })}
          </PreviewHeading>
          <select onChange={(evt) => setPreviewLanguage(evt.target.value)} value={previewLanguage}>
            {concept.supportedLanguages.map((language) => (
              <option key={language} value={language}>
                {t(`languages.${language}`)}
              </option>
            ))}
          </select>
        </PreviewTitleWrapper>
        {apiConcept.data && (
          <PreviewConceptComponent concept={apiConcept.data} language={previewLanguage} />
        )}
      </ConceptWrapper>
    </TwoArticleWrapper>
  );
};

const PreviewConcept = ({ language }: ConceptPreviewProps) => {
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const { values } = useFormikContext<ConceptFormValues>();

  const formConcept = useMemo(
    () => conceptFormTypeToApiType(values, licenses!, values.conceptType),
    [values, licenses],
  );

  return (
    <ConceptWrapper>
      <PreviewConceptComponent concept={formConcept} language={language} />
    </ConceptWrapper>
  );
};

const components: Record<Props['type'], ElementType> = {
  markup: PreviewMarkup,
  compare: PreviewCompare,
  version: PreviewVersion,
  conceptCompare: PreviewConceptCompare,
  concept: PreviewConcept,
};

const PreviewDraftLightboxV2 = (props: Props) => {
  const Component = components[props.type];
  const size: ModalSizeType =
    props.type === 'compare' || props.type === 'version'
      ? 'full'
      : { width: 'large', height: 'full' };
  return (
    <Modal>
      <ModalTrigger>{props.activateButton}</ModalTrigger>
      <ModalContent size={size}>
        <ModalHeader>
          <ModalCloseButton />
        </ModalHeader>
        <Component {...props} />
      </ModalContent>
    </Modal>
  );
};

export default PreviewDraftLightboxV2;
