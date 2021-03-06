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
  learningResourceContentToHTML,
  learningResourceContentToEditorValue,
  editorValueToPlainText,
  plainTextToEditorValue,
} from '../../../../util/articleContentConverter';
import { LicensesArrayOf, ArticleShape } from '../../../../shapes';
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
import { useArticleFormHooks } from '../../../FormikForm/articleFormHooks';
import usePreventWindowUnload from '../../../FormikForm/preventWindowUnloadHook';
import Spinner from '../../../../components/Spinner';

export const getInitialValues = (article = {}) => {
  const metaImageId = parseImageUrl(article.metaImage);
  return {
    agreementId: article.copyright ? article.copyright.agreementId : undefined,
    articleType: 'standard',
    content: learningResourceContentToEditorValue(article.content),
    creators: parseCopyrightContributors(article, 'creators'),
    id: article.id,
    introduction: plainTextToEditorValue(article.introduction, true),
    language: article.language,
    license: article.copyright?.license?.license || DEFAULT_LICENSE.license,
    metaDescription: plainTextToEditorValue(article.metaDescription, true),
    metaImageAlt: article.metaImage?.alt || '',
    metaImageId,
    notes: [],
    origin: article.copyright?.origin,
    processors: parseCopyrightContributors(article, 'processors'),
    published: article.published,
    revision: article.revision,
    rightsholders: parseCopyrightContributors(article, 'rightsholders'),
    status: article.status || {},
    supportedLanguages: article.supportedLanguages || [],
    tags: article.tags || [],
    slatetitle: plainTextToEditorValue(article.title, true),
    updatePublished: false,
    updated: article.updated,
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

  const hasPublishedDateChanged = initialValues.published !== values.published;
  if (hasPublishedDateChanged || values.updatePublished) {
    return values.published;
  }
  return undefined;
};

const getArticleFromSlate = ({ values, licenses, initialValues, preview = false }) => {
  const content = learningResourceContentToHTML(values.content);
  const emptyContent = values.id ? '' : undefined;

  const metaImage = values?.metaImageId
    ? {
        id: values.metaImageId,
        alt: values.metaImageAlt,
      }
    : nullOrUndefined(values?.metaImageId);

  const article = {
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
    published: getPublishedDate(values, initialValues, preview),
    supportedLanguages: values.supportedLanguages,
    tags: values.tags,
    title: editorValueToPlainText(values.slatetitle),
    grepCodes: values.grepCodes,
    conceptIds: values.conceptIds,
    availability: values.availability,
    relatedContent: values.relatedContent,
  };

  return article;
};

const LearningResourceForm = props => {
  const {
    savedToServer,
    formikRef,
    initialValues,
    setSaveAsNewVersion,
    handleSubmit,
    fetchStatusStateMachine,
    validateDraft,
    fetchSearchTags,
  } = useArticleFormHooks({ getInitialValues, getArticleFromSlate, ...props });
  const { articleChanged, userAccess, createMessage, history } = props;
  const [translateOnContinue, setTranslateOnContinue] = useState(false);

  const FormikChild = formik => {
    // eslint doesn't allow this to be inlined when using hooks (in usePreventWindowUnload)
    const { values, dirty, isSubmitting } = formik;
    const formIsDirty = isFormikFormDirty({
      values,
      initialValues,
      dirty,
      changed: articleChanged,
    });
    usePreventWindowUnload(formIsDirty);
    const getArticle = preview => getArticleFromSlate({ values, initialValues, licenses, preview });
    return (
      <Form {...formClasses()}>
        <HeaderWithLanguage
          values={values}
          content={article}
          editUrl={lang => toEditArticle(values.id, values.articleType, lang)}
          getEntity={getArticle}
          formIsDirty={formIsDirty}
          isSubmitting={isSubmitting}
          translateToNN={translateToNN}
          setTranslateOnContinue={setTranslateOnContinue}
          type="standard"
          history={history}
          {...rest}
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
            history={history}
            handleSubmit={() => {
              handleSubmit(values, formik);
            }}
          />
        )}
        <EditorFooter
          showSimpleFooter={!article.id}
          formIsDirty={formIsDirty}
          savedToServer={savedToServer}
          getEntity={getArticle}
          onSaveClick={saveAsNewVersion => {
            setSaveAsNewVersion(saveAsNewVersion);
            handleSubmit(values, formik);
          }}
          entityStatus={article.status}
          fetchStatusStateMachine={fetchStatusStateMachine}
          validateEntity={validateDraft}
          isArticle
          isNewlyCreated={isNewlyCreated}
          {...rest}
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

  const {
    t,
    article,
    updateArticle,
    translating,
    translateToNN,
    licenses,
    isNewlyCreated,
    ...rest
  } = props;
  return (
    <Formik
      enableReinitialize={translating}
      initialValues={initialValues}
      innerRef={formikRef}
      validateOnBlur={false}
      validateOnMount
      onSubmit={handleSubmit}
      validate={values => validateFormik(values, learningResourceRules, t)}>
      {FormikChild}
    </Formik>
  );
};

LearningResourceForm.propTypes = {
  licenses: LicensesArrayOf,
  revision: PropTypes.number,
  updateArticle: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired,
  articleStatus: PropTypes.shape({
    current: PropTypes.string,
    other: PropTypes.arrayOf(PropTypes.string),
  }),
  articleChanged: PropTypes.bool,
  updateArticleAndStatus: PropTypes.func,
  taxonomy: PropTypes.shape({
    resourceTypes: PropTypes.array,
    filter: PropTypes.array,
    topics: PropTypes.array,
    loading: PropTypes.bool,
  }),
  userAccess: PropTypes.string,
  article: ArticleShape,
  applicationError: PropTypes.func.isRequired,
  translating: PropTypes.bool,
  translateToNN: PropTypes.func,
  isNewlyCreated: PropTypes.bool,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default injectT(LearningResourceForm);
