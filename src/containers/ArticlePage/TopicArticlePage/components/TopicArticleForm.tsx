/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash/fp/isEmpty';
import { Formik, Form, FormikProps } from 'formik';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  topicArticleContentToHTML,
  topicArticleContentToEditorValue,
  editorValueToPlainText,
  plainTextToEditorValue,
  embedTagToEditorValue,
  editorValueToEmbedTag,
} from '../../../../util/articleContentConverter';
import {
  DEFAULT_LICENSE,
  parseCopyrightContributors,
  isFormikFormDirty,
  formikCommonArticleRules,
  parseImageUrl,
} from '../../../../util/formHelper';
import { AlertModalWrapper, formClasses } from '../../../FormikForm';
import { toEditArticle } from '../../../../util/routeHelpers';
import { nullOrUndefined } from '../../../../util/articleUtil';
import validateFormik from '../../../../components/formikValidationSchema';
import TopicArticleAccordionPanels from './TopicArticleAccordionPanels';
import HeaderWithLanguage from '../../../../components/HeaderWithLanguage';
import EditorFooter from '../../../../components/SlateEditor/EditorFooter';
import {
  ArticleFormikType,
  TopicArticleFormikType,
  useArticleFormHooks,
} from '../../../FormikForm/articleFormHooks';
import usePreventWindowUnload from '../../../FormikForm/preventWindowUnloadHook';
import Spinner from '../../../../components/Spinner';
import { ConvertedDraftType } from '../../../../interfaces';
import {
  DraftStatus,
  DraftStatusTypes,
  UpdatedDraftApiType,
} from '../../../../modules/draft/draftApiInterfaces';
import { convertDraftOrRelated } from '../../LearningResourcePage/components/LearningResourceForm';
import { useLicenses } from '../../../../modules/draft/draftQueries';

export const getInitialValues = (
  article: Partial<ConvertedDraftType> = {},
): TopicArticleFormikType => {
  const metaImageId: string = parseImageUrl(article.metaImage);

  return {
    agreementId: article.copyright ? article.copyright.agreementId : undefined,
    articleType: 'topic-article',
    content: topicArticleContentToEditorValue(article.content || ''),
    creators: parseCopyrightContributors(article, 'creators'),
    id: article.id,
    introduction: plainTextToEditorValue(article.introduction || ''),
    language: article.language,
    license: article.copyright?.license?.license || DEFAULT_LICENSE.license,
    metaDescription: plainTextToEditorValue(article.metaDescription || ''),
    metaImageAlt: article.metaImage?.alt || '',
    metaImageId,
    notes: [],
    processors: parseCopyrightContributors(article, 'processors'),
    published: article.published,
    revision: article.revision,
    rightsholders: parseCopyrightContributors(article, 'rightsholders'),
    status: article.status,
    supportedLanguages: article.supportedLanguages || [],
    tags: article.tags || [],
    title: plainTextToEditorValue(article.title || ''),
    updated: article.updated,
    updatePublished: false,
    visualElement: embedTagToEditorValue(article.visualElement || ''),
    grepCodes: article.grepCodes || [],
    conceptIds: article.conceptIds || [],
    availability: article.availability || 'everyone',
    relatedContent: article.relatedContent || [],
  };
};

const getPublishedDate = (
  values: ArticleFormikType,
  initialValues: ArticleFormikType,
  preview: boolean = false,
) => {
  if (isEmpty(values.published)) {
    return undefined;
  }
  if (preview) {
    return values.published;
  }

  const hasPublishedDateChaned = initialValues.published !== values.published;
  if (hasPublishedDateChaned || values.updatePublished) {
    return values.published;
  }
  return undefined;
};

// TODO preview parameter does not work for topic articles. Used from PreviewDraftLightbox

interface Props extends RouteComponentProps {
  article: Partial<ConvertedDraftType>;
  revision?: number;
  updateArticle: (art: UpdatedDraftApiType) => Promise<ConvertedDraftType>;
  articleStatus?: DraftStatus;
  articleChanged: boolean;
  updateArticleAndStatus?: (input: {
    updatedArticle: UpdatedDraftApiType;
    newStatus: DraftStatusTypes;
    dirty: boolean;
  }) => Promise<ConvertedDraftType>;
  translating: boolean;
  translateToNN?: () => void;
  isNewlyCreated: boolean;
}

const TopicArticleForm = (props: Props) => {
  const {
    article,
    updateArticle,
    updateArticleAndStatus,
    articleChanged,
    translating,
    translateToNN,
    isNewlyCreated,
    articleStatus,
  } = props;
  const { data: licenses } = useLicenses({ placeholderData: [] });

  const { t } = useTranslation();

  // TODO preview parameter does not work for topic articles. Used from PreviewDraftLightbox
  const getArticleFromSlate = useCallback(
    ({
      values,
      initialValues,
      preview = false,
    }: {
      values: TopicArticleFormikType;
      initialValues: TopicArticleFormikType;
      preview: boolean;
    }): UpdatedDraftApiType => {
      const emptyField = values.id ? '' : undefined;

      const content = topicArticleContentToHTML(values.content);
      const metaImage = values?.metaImageId
        ? {
            id: values.metaImageId,
            alt: values.metaImageAlt ?? '',
          }
        : nullOrUndefined(values?.metaImageId);

      return {
        revision: 0,
        articleType: 'topic-article',
        content: content || emptyField,
        copyright: {
          license: licenses!.find(license => license.license === values.license),
          creators: values.creators,
          processors: values.processors,
          rightsholders: values.rightsholders,
          agreementId: values.agreementId,
        },
        supportedLanguages: values.supportedLanguages,
        id: values.id,
        introduction: editorValueToPlainText(values.introduction),
        metaDescription: editorValueToPlainText(values.metaDescription),
        language: values.language,
        metaImage,
        notes: values.notes || [],
        published: getPublishedDate(values, initialValues, preview),
        tags: values.tags,
        title: editorValueToPlainText(values.title),
        visualElement: editorValueToEmbedTag(values.visualElement),
        grepCodes: values.grepCodes ?? [],
        conceptIds: values.conceptIds?.map(c => c.id) ?? [],
        availability: values.availability,
        relatedContent: convertDraftOrRelated(values.relatedContent),
      };
    },
    [licenses],
  );

  const {
    savedToServer,
    formikRef,
    initialValues,
    setSaveAsNewVersion,
    handleSubmit,
    fetchStatusStateMachine,
    validateDraft,
    fetchSearchTags,
  } = useArticleFormHooks({
    getInitialValues,
    article,
    t,
    articleStatus,
    updateArticle,
    updateArticleAndStatus,
    licenses,
    getArticleFromSlate,
    isNewlyCreated,
  });

  const [translateOnContinue, setTranslateOnContinue] = useState(false);

  const FormikChild = (formik: FormikProps<TopicArticleFormikType>) => {
    // eslint doesn't allow this to be inlined when using hooks (in usePreventWindowUnload)
    const { values, dirty, isSubmitting } = formik;

    const formIsDirty = isFormikFormDirty({
      values,
      initialValues,
      dirty,
      changed: articleChanged,
    });
    usePreventWindowUnload(formIsDirty);
    const getArticle = () => getArticleFromSlate({ values, initialValues, preview: false });
    const editUrl = values.id
      ? (lang: string) => toEditArticle(values.id!, values.articleType, lang)
      : undefined;
    return (
      <Form {...formClasses()}>
        <HeaderWithLanguage
          values={values}
          content={article}
          getEntity={getArticle}
          editUrl={editUrl}
          formIsDirty={formIsDirty}
          isSubmitting={isSubmitting}
          translateToNN={translateToNN}
          setTranslateOnContinue={setTranslateOnContinue}
          type="topic-article"
        />
        {translating ? (
          <Spinner withWrapper />
        ) : (
          <TopicArticleAccordionPanels
            updateNotes={updateArticle}
            article={article}
            formIsDirty={formIsDirty}
            getInitialValues={getInitialValues}
            getArticle={getArticle}
            fetchSearchTags={fetchSearchTags}
            handleSubmit={async () => handleSubmit(values, formik)}
          />
        )}
        <EditorFooter
          showSimpleFooter={!article.id}
          formIsDirty={formIsDirty}
          savedToServer={savedToServer}
          getEntity={getArticle}
          onSaveClick={saveAsNewVersion => {
            setSaveAsNewVersion(saveAsNewVersion ?? false);
            handleSubmit(values, formik);
          }}
          entityStatus={article.status}
          fetchStatusStateMachine={fetchStatusStateMachine}
          validateEntity={validateDraft}
          isArticle
          isNewlyCreated={isNewlyCreated}
          isConcept={false}
          hideSecondaryButton={false}
        />
        <AlertModalWrapper
          isSubmitting={isSubmitting}
          formIsDirty={formIsDirty}
          onContinue={translateOnContinue ? translateToNN : () => {}}
          severity="danger"
          text={t('alertModal.notSaved')}
        />
      </Form>
    );
  };

  const initialErrors = useMemo(() => validateFormik(initialValues, formikCommonArticleRules, t), [
    initialValues,
    t,
  ]);

  return (
    <Formik
      enableReinitialize={translating}
      validateOnMount
      initialValues={initialValues}
      initialErrors={initialErrors}
      validateOnBlur={false}
      innerRef={formikRef}
      onSubmit={handleSubmit}
      validate={values => validateFormik(values, formikCommonArticleRules, t)}>
      {FormikChild}
    </Formik>
  );
};

export default withRouter(TopicArticleForm);
