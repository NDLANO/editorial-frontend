/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { spacing } from '@ndla/core';
import { IConcept } from '@ndla/types-backend/concept-api';
import { ModalCloseButton, ModalHeaderV2, ModalSizeType, ModalV2 } from '@ndla/modal';
import { IArticle } from '@ndla/types-backend/draft-api';
import { OneColumn } from '@ndla/ui';
import { ReactElement, useMemo, useState, ElementType } from 'react';
import PreviewDraft from './PreviewDraft';
import { useDraft, useLicenses } from '../../modules/draft/draftQueries';
import { learningResourceFormTypeToDraftApiType } from '../../containers/ArticlePage/articleTransformers';
import { LearningResourceFormType } from '../../containers/FormikForm/articleFormHooks';
import { useConcept } from '../../modules/concept/conceptQueries';
import { ConceptFormValues } from '../../containers/ConceptPage/conceptInterfaces';
import { conceptFormTypeToApiType } from '../../containers/ConceptPage/conceptTransformers';
import PreviewConceptComponent from './PreviewConcept';

interface BaseProps {
  type: 'markup' | 'version' | 'compare' | 'conceptCompare' | 'concept';
  language: string;
  activateButton: ReactElement;
  wrapperFunctionForButton?: (button: ReactElement) => ReactElement;
}

interface MarkupPreviewProps extends BaseProps {
  type: 'markup';
  article: IArticle;
}

interface VersionPreviewProps extends BaseProps {
  type: 'version';
  article: IArticle;
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
  & .c-article {
    padding-top: 0;
    margin-top: 20px;
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
    width: 50%;
    > h2 {
      margin: 0;
      margin-left: ${spacing.large};
    }
  }
`;

const PreviewVersion = ({ article, language }: VersionPreviewProps) => {
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
          <h2>{t('form.previewProductionArticle.version', { revision: article.revision })}</h2>
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
              language: t(`language.${language}`).toLowerCase(),
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
              language: t(`language.${previewLanguage}`).toLowerCase(),
            })}
          </h2>
          <select onChange={(evt) => setPreviewLanguage(evt.target.value)} value={previewLanguage}>
            {article.supportedLanguages.map((language) => (
              <option key={language} value={language}>
                {t(`language.${language}`)}
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
    () => conceptFormTypeToApiType(values, licenses!, concept.updatedBy),
    [values, licenses, concept.updatedBy],
  );
  return (
    <TwoArticleWrapper>
      <ConceptWrapper>
        <PreviewTitleWrapper>
          <PreviewHeading>
            {t('form.previewLanguageArticle.title', {
              language: t(`language.${language}`).toLowerCase(),
            })}
          </PreviewHeading>
        </PreviewTitleWrapper>
        <PreviewConceptComponent concept={formConcept} language={language} />
      </ConceptWrapper>
      <ConceptWrapper>
        <PreviewTitleWrapper>
          <PreviewHeading>
            {t('form.previewLanguageArticle.title', {
              language: t(`language.${previewLanguage}`).toLowerCase(),
            })}
          </PreviewHeading>
          <select onChange={(evt) => setPreviewLanguage(evt.target.value)} value={previewLanguage}>
            {concept.supportedLanguages.map((language) => (
              <option key={language} value={language}>
                {t(`language.${language}`)}
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
    () => conceptFormTypeToApiType(values, licenses!),
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
    <ModalV2
      size={size}
      activateButton={props.activateButton}
      wrapperFunctionForButton={props.wrapperFunctionForButton}
    >
      {(onClose) => (
        <>
          <ModalHeaderV2>
            <ModalCloseButton onClick={onClose} />
          </ModalHeaderV2>
          <Component {...props} />
        </>
      )}
    </ModalV2>
  );
};

export default PreviewDraftLightboxV2;
