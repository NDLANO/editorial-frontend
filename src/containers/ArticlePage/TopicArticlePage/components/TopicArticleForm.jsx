/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import isEmpty from 'lodash/fp/isEmpty';
import { Formik, Form } from 'formik';
import {
  topicArticleContentToHTML,
  topicArticleContentToEditorValue,
  editorValueToPlainText,
  plainTextToEditorValue,
} from '../../../../util/articleContentConverter';
import { parseEmbedTag, createEmbedTag } from '../../../../util/embedTagHelpers';
import { LicensesArrayOf, ArticleShape } from '../../../../shapes';
import {
  DEFAULT_LICENSE,
  parseCopyrightContributors,
  isFormikFormDirty,
  topicArticleRules,
  parseImageUrl,
} from '../../../../util/formHelper';
import { AlertModalWrapper, formClasses } from '../../../FormikForm';
import { toEditArticle } from '../../../../util/routeHelpers';
import { nullOrUndefined } from '../../../../util/articleUtil';
import validateFormik from '../../../../components/formikValidationSchema';
import TopicArticleAccordionPanels from './TopicArticleAccordionPanels';
import HeaderWithLanguage from '../../../../components/HeaderWithLanguage';
import EditorFooter from '../../../../components/SlateEditor/EditorFooter';
import { useArticleFormHooks } from '../../../FormikForm/articleFormHooks';
import usePreventWindowUnload from '../../../FormikForm/preventWindowUnloadHook';
import Spinner from '../../../../components/Spinner';

export const getInitialValues = (article = {}) => {
  const visualElement = parseEmbedTag(article.visualElement);
  const metaImageId = parseImageUrl(article.metaImage);
  return {
    agreementId: article.copyright ? article.copyright.agreementId : undefined,
    articleType: 'topic-article',
    content: topicArticleContentToEditorValue(article.content),
    creators: parseCopyrightContributors(article, 'creators'),
    id: article.id,
    introduction: plainTextToEditorValue(article.introduction, true),
    language: article.language,
    license: article.copyright?.license?.license || DEFAULT_LICENSE.license,
    metaDescription: plainTextToEditorValue(article.metaDescription, true),
    metaImageAlt: article.metaImage?.alt || '',
    metaImageId,
    notes: [],
    processors: parseCopyrightContributors(article, 'processors'),
    published: article.published,
    revision: article.revision,
    rightsholders: parseCopyrightContributors(article, 'rightsholders'),
    status: article.status || {},
    supportedLanguages: article.supportedLanguages || [],
    tags: article.tags || [],
    slatetitle: plainTextToEditorValue(article.title, true),
    updated: article.updated,
    updatePublished: false,
    visualElementObject: visualElement || {},
    grepCodes: article.grepCodes || [],
    conceptIds: article.conceptIds || [],
    availability: article.availability || 'everyone',
    relatedContent: article.relatedContent || [],
  };
};

const getPublishedDate = (values, initialValues, preview = false) => {
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
const getArticleFromSlate = ({ values, initialValues, licenses, preview = false }) => {
  const emptyField = values.id ? '' : undefined;
  const visualElement = createEmbedTag(
    isEmpty(values.visualElementObject) ? {} : values.visualElementObject,
  );
  const content = topicArticleContentToHTML(values.content);
  const metaImage = values?.metaImageId
    ? {
        id: values.metaImageId,
        alt: values.metaImageAlt,
      }
    : nullOrUndefined(values?.metaImageId);

  const article = {
    articleType: 'topic-article',
    content: content || emptyField,
    copyright: {
      license: licenses.find(license => license.license === values.license),
      creators: values.creators,
      processors: values.processors,
      rightsholders: values.rightsholders,
      agreementId: values.agreementId,
    },
    id: values.id,
    introduction: editorValueToPlainText(values.introduction),
    metaDescription: editorValueToPlainText(values.metaDescription),
    language: values.language,
    metaImage,
    notes: values.notes || [],
    published: getPublishedDate(values, initialValues, preview),
    supportedLanguages: values.supportedLanguages,
    tags: values.tags,
    title: editorValueToPlainText(values.slatetitle),
    visualElement: visualElement,
    grepCodes: values.grepCodes,
    conceptIds: values.conceptIds,
    availability: values.availability,
    relatedContent: values.relatedContent,
  };

  return article;
};

const TopicArticleForm = props => {
  const {
    savedToServer,
    formikRef,
    initialValues,
    setResetModal,
    setSaveAsNewVersion,
    handleSubmit,
    fetchStatusStateMachine,
    validateDraft,
    fetchSearchTags,
  } = useArticleFormHooks({ getInitialValues, getArticleFromSlate, ...props });
  const [translateOnContinue, setTranslateOnContinue] = useState(false);

  const {
    t,
    article,
    updateArticle,
    articleChanged,
    translating,
    translateFunc,
    licenses,
    isNewlyCreated,
    createMessage,
    history,
    userAccess,
    ...rest
  } = props;

  const FormikChild = formik => {
    // eslint doesn't allow this to be inlined when using hooks (in usePreventWindowUnload)
    const { values, dirty, isSubmitting, setValues } = formik;

    const formIsDirty = isFormikFormDirty({
      values,
      initialValues,
      dirty,
      changed: articleChanged,
    });
    usePreventWindowUnload(formIsDirty);
    const getArticle = () => getArticleFromSlate({ values, initialValues, licenses });
    return (
      <Form {...formClasses()}>
        <HeaderWithLanguage
          values={values}
          content={article}
          getEntity={getArticle}
          editUrl={lang => toEditArticle(values.id, values.articleType, lang)}
          formIsDirty={formIsDirty}
          getInitialValues={getInitialValues}
          setValues={setValues}
          isSubmitting={isSubmitting}
          translateFunc={translateFunc}
          setTranslateOnContinue={setTranslateOnContinue}
          type="topic-article"
          history={history}
          {...rest}
        />
        {translating ? (
          <Spinner withWrapper />
        ) : (
          <TopicArticleAccordionPanels
            updateNotes={updateArticle}
            article={article}
            formIsDirty={formIsDirty}
            getInitialValues={getInitialValues}
            licenses={licenses}
            getArticle={getArticle}
            fetchSearchTags={fetchSearchTags}
            handleSubmit={() => {
              handleSubmit(values, formik);
            }}
            history={history}
            userAccess={userAccess}
            createMessage={createMessage}
          />
        )}
        <EditorFooter
          showSimpleFooter={!article.id}
          formIsDirty={formIsDirty}
          savedToServer={savedToServer}
          getEntity={getArticle}
          showReset={() => setResetModal(true)}
          onSaveClick={saveAsNewVersion => {
            setSaveAsNewVersion(saveAsNewVersion);
            handleSubmit(values, formik);
          }}
          entityStatus={article.status}
          fetchStatusStateMachine={fetchStatusStateMachine}
          validateEntity={validateDraft}
          isArticle
          isNewlyCreated={isNewlyCreated}
          createMessage={createMessage}
          {...rest}
        />
        <AlertModalWrapper
          isSubmitting={isSubmitting}
          formIsDirty={formIsDirty}
          onContinue={translateOnContinue ? translateFunc : () => {}}
          severity="danger"
          text={t('alertModal.notSaved')}
        />
      </Form>
    );
  };

  return (
    <Formik
      enableReinitialize={translating}
      validateOnMount
      initialValues={initialValues}
      validateOnChange={false}
      innerRef={formikRef}
      onSubmit={handleSubmit}
      validate={values => validateFormik(values, topicArticleRules, t)}>
      {FormikChild}
    </Formik>
  );
};

TopicArticleForm.propTypes = {
  revision: PropTypes.number,
  updateArticle: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired,
  applicationError: PropTypes.func.isRequired,
  articleStatus: PropTypes.shape({
    current: PropTypes.string,
    other: PropTypes.arrayOf(PropTypes.string),
  }),
  articleChanged: PropTypes.bool,
  updateArticleAndStatus: PropTypes.func,
  userAccess: PropTypes.string,
  licenses: LicensesArrayOf,
  article: ArticleShape,
  translating: PropTypes.bool,
  translateFunc: PropTypes.func,
  isNewlyCreated: PropTypes.bool,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default injectT(TopicArticleForm);
