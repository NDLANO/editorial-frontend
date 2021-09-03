/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useMemo, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash/fp/isEmpty';
import { Formik, Form, FormikProps } from 'formik';
import {
  learningResourceContentToHTML,
  learningResourceContentToEditorValue,
  editorValueToPlainText,
  plainTextToEditorValue,
} from '../../../../util/articleContentConverter';
import { AlertModalWrapper, formClasses } from '../../../FormikForm';
import validateFormik from '../../../../components/formikValidationSchema';
import LearningResourcePanels from './LearningResourcePanels';
import {
  DEFAULT_LICENSE,
  parseCopyrightContributors,
  isFormikFormDirty,
  parseImageUrl,
  learningResourceRules,
} from '../../../../util/formHelper';
import { toEditArticle } from '../../../../util/routeHelpers';
import { nullOrUndefined } from '../../../../util/articleUtil';
import HeaderWithLanguage from '../../../../components/HeaderWithLanguage';
import EditorFooter from '../../../../components/SlateEditor/EditorFooter';
import { ArticleFormikType, useArticleFormHooks } from '../../../FormikForm/articleFormHooks';
import usePreventWindowUnload from '../../../FormikForm/preventWindowUnloadHook';
import Spinner from '../../../../components/Spinner';
import {
  DraftApiType,
  DraftStatus,
  DraftStatusTypes,
  UpdatedDraftApiType,
} from '../../../../modules/draft/draftApiInterfaces';
import { ConvertedDraftType, License, LocaleType, RelatedContent } from '../../../../interfaces';
import { NewReduxMessage } from '../../../Messages/messagesSelectors';

export const getInitialValues = (article: Partial<ConvertedDraftType> = {}): ArticleFormikType => {
  const metaImageId = parseImageUrl(article.metaImage);
  const slatetitle = plainTextToEditorValue(article.title, true);
  const introduction = plainTextToEditorValue(article.introduction, true);
  const content = learningResourceContentToEditorValue(article?.content ?? '');
  const creators = parseCopyrightContributors(article, 'creators');
  const processors = parseCopyrightContributors(article, 'processors');
  const rightsholders = parseCopyrightContributors(article, 'rightsholders');
  const license = article.copyright?.license?.license || DEFAULT_LICENSE.license;
  const metaDescription = plainTextToEditorValue(article.metaDescription, true);

  return {
    agreementId: article.copyright?.agreementId,
    articleType: 'standard',
    content,
    creators,
    id: article.id,
    introduction,
    language: article.language,
    license,
    metaDescription,
    metaImageAlt: article.metaImage?.alt || '',
    metaImageId,
    notes: [],
    origin: article.copyright?.origin,
    processors,
    published: article.published,
    revision: article.revision,
    rightsholders,
    status: article.status,
    supportedLanguages: article.supportedLanguages || [],
    tags: article.tags || [],
    slatetitle,
    updatePublished: false,
    updated: article.updated,
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

  const hasPublishedDateChanged = initialValues.published !== values.published;
  if (hasPublishedDateChanged || values.updatePublished) {
    return values.published;
  }
  return undefined;
};

const isRelatedContent = (object: DraftApiType | RelatedContent): object is RelatedContent => {
  return (object as DraftApiType).id === undefined;
};

export const convertDraftOrRelated = (
  relatedContents: (DraftApiType | RelatedContent)[],
): RelatedContent[] => {
  return relatedContents.map(r => {
    if (isRelatedContent(r)) return r;
    else return r.id;
  });
};

const getArticleFromSlate = ({
  values,
  licenses,
  initialValues,
  preview = false,
}: {
  values: ArticleFormikType;
  licenses: License[];
  initialValues: ArticleFormikType;
  preview?: boolean;
}): UpdatedDraftApiType => {
  const content = learningResourceContentToHTML(values.content);
  const emptyContent = values.id ? '' : undefined;

  const metaImage = values?.metaImageId
    ? {
        id: values.metaImageId,
        alt: values.metaImageAlt ?? '',
      }
    : nullOrUndefined(values?.metaImageId);

  return {
    revision: 0,
    articleType: 'standard',
    content: content && content.length > 0 ? content : emptyContent,
    copyright: {
      license: licenses.find(license => license.license === values.license),
      origin: values.origin,
      creators: values.creators,
      processors: values.processors,
      rightsholders: values.rightsholders,
    },
    id: values.id,
    introduction: editorValueToPlainText(values.introduction),
    language: values.language,
    metaImage,
    metaDescription: editorValueToPlainText(values.metaDescription),
    notes: values.notes || [],
    published: getPublishedDate(values, initialValues, preview) ?? '',
    tags: values.tags,
    title: editorValueToPlainText(values.slatetitle),
    grepCodes: values.grepCodes ?? [],
    conceptIds: values.conceptIds?.map(c => c.id) ?? [],
    availability: values.availability,
    relatedContent: convertDraftOrRelated(values.relatedContent),
  };
};

interface Props extends RouteComponentProps {
  userAccess: string | undefined;
  createMessage: (message: NewReduxMessage) => void;
  article: Partial<ConvertedDraftType>;
  translating: boolean;
  translateToNN: () => void;
  licenses: License[];
  articleStatus?: DraftStatus;
  isNewlyCreated: boolean;
  articleChanged: boolean;
  updateArticle: (updatedArticle: UpdatedDraftApiType) => Promise<ConvertedDraftType>;
  updateArticleAndStatus: (input: {
    updatedArticle: UpdatedDraftApiType;
    newStatus: DraftStatusTypes;
    dirty: boolean;
  }) => Promise<ConvertedDraftType>;
}

const LearningResourceForm = ({
  article,
  articleStatus,
  createMessage,
  isNewlyCreated = false,
  licenses,
  translateToNN,
  translating,
  updateArticle,
  updateArticleAndStatus,
  articleChanged,
  history,
  userAccess,
}: Props) => {
  const { t } = useTranslation();
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

  const FormikChild = (formik: FormikProps<ArticleFormikType>) => {
    // eslint doesn't allow this to be inlined when using hooks (in usePreventWindowUnload)
    const { values, dirty, isSubmitting } = formik;
    const formIsDirty = isFormikFormDirty({
      values,
      initialValues,
      dirty,
      changed: articleChanged,
    });
    usePreventWindowUnload(formIsDirty);
    const getArticle = () =>
      getArticleFromSlate({ values, initialValues, licenses, preview: false });
    return (
      <Form {...formClasses()}>
        <HeaderWithLanguage
          values={values}
          content={article}
          editUrl={(lang: LocaleType) =>
            values.id && toEditArticle(values.id, values.articleType, lang)
          }
          getEntity={getArticle}
          formIsDirty={formIsDirty}
          isSubmitting={isSubmitting}
          translateToNN={translateToNN}
          setTranslateOnContinue={setTranslateOnContinue}
          type="standard"
          history={history}
        />
        {translating ? (
          <Spinner withWrapper />
        ) : (
          <LearningResourcePanels
            article={article}
            updateNotes={updateArticle}
            formIsDirty={formIsDirty}
            getInitialValues={getInitialValues}
            licenses={licenses}
            getArticle={getArticle}
            fetchSearchTags={fetchSearchTags}
            userAccess={userAccess}
            createMessage={createMessage}
            handleSubmit={handleSubmit}
          />
        )}
        <EditorFooter
          showSimpleFooter={!article.id}
          formIsDirty={formIsDirty}
          savedToServer={savedToServer}
          getEntity={getArticle}
          onSaveClick={(saveAsNewVersion?: boolean) => {
            setSaveAsNewVersion(saveAsNewVersion ?? false);
            handleSubmit(values, formik);
          }}
          entityStatus={article.status}
          fetchStatusStateMachine={fetchStatusStateMachine}
          validateEntity={validateDraft}
          isArticle
          isNewlyCreated={isNewlyCreated}
          createMessage={createMessage}
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

  const initialErrors = useMemo(() => validateFormik(initialValues, learningResourceRules, t), [
    initialValues,
    t,
  ]);

  return (
    <Formik
      enableReinitialize={translating}
      initialValues={initialValues}
      initialErrors={initialErrors}
      innerRef={formikRef}
      validateOnBlur={false}
      validateOnMount
      onSubmit={handleSubmit}
      validate={values => validateFormik(values, learningResourceRules, t)}>
      {FormikChild}
    </Formik>
  );
};

export default withRouter(LearningResourceForm);
