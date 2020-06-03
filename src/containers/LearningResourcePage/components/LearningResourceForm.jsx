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
} from '../../../util/articleContentConverter';
import { LicensesArrayOf, ArticleShape } from '../../../shapes';
import { FormikAlertModalWrapper, formClasses } from '../../FormikForm';
import validateFormik from '../../../components/formikValidationSchema';
import LearningResourcePanels from './LearningResourcePanels';
import {
  DEFAULT_LICENSE,
  parseCopyrightContributors,
  isFormikFormDirty,
  parseImageUrl,
  learningResourceRules,
} from '../../../util/formHelper';
import { toEditArticle } from '../../../util/routeHelpers';
import { nullOrUndefined } from '../../../util/articleUtil';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import EditorFooter from '../../../components/SlateEditor/EditorFooter';
import { useArticleFormHooks } from '../../FormikForm/articleFormHooks';
import usePreventWindowUnload from '../../FormikForm/preventWindowUnloadHook';
import Spinner from '../../../components/Spinner';

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
    origin: article.copyright?.origin || '',
    processors: parseCopyrightContributors(article, 'processors'),
    published: article.published,
    revision: article.revision,
    rightsholders: parseCopyrightContributors(article, 'rightsholders'),
    status: article.status || {},
    supportedLanguages: article.supportedLanguages || [],
    tags: article.tags || [],
    title: article.title || '',
    updatePublished: false,
    updated: article.updated,
    grepCodes: article.grepCodes || [],
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

const getArticleFromSlate = ({
  values,
  licenses,
  initialValues,
  preview = false,
}) => {
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
    title: values.title,
    grepCodes: values.grepCodes,
  };

  return article;
};

const LearningResourceForm = props => {
  const {
    savedToServer,
    formikRef,
    initialValues,
    handleSubmit,
    fetchStatusStateMachine,
    validateDraft,
    fetchSearchTags,
  } = useArticleFormHooks({ getInitialValues, getArticleFromSlate, ...props });
  const [translateOnContinue, setTranslateOnContinue] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  usePreventWindowUnload(unsaved);

  const {
    t,
    article,
    updateArticle,
    translating,
    translateArticle,
    licenses,
    isNewlyCreated,
    ...rest
  } = props;
  return (
    <Formik
      enableReinitialize={translating}
      initialValues={initialValues}
      ref={formikRef}
      validateOnBlur={false}
      onSubmit={() => ({})}
      validate={values => validateFormik(values, learningResourceRules, t)}>
      {formik => {
        const {
          values,
          dirty,
          isSubmitting,
          setValues,
          errors,
          touched,
          ...formikProps
        } = formik;
        const formIsDirty = isFormikFormDirty({
          values,
          initialValues,
          dirty,
        });
        setUnsaved(formIsDirty);
        const getArticle = preview =>
          getArticleFromSlate({ values, initialValues, licenses, preview });
        return (
          <Form {...formClasses()}>
            <HeaderWithLanguage
              values={values}
              content={article}
              editUrl={lang =>
                toEditArticle(values.id, values.articleType, lang)
              }
              getArticle={getArticle}
              formIsDirty={formIsDirty}
              isSubmitting={isSubmitting}
              translateArticle={translateArticle}
              setTranslateOnContinue={setTranslateOnContinue}
              {...rest}
            />
            {translating ? (
              <Spinner withWrapper />
            ) : (
              <LearningResourcePanels
                values={values}
                errors={errors}
                article={article}
                touched={touched}
                updateNotes={updateArticle}
                formIsDirty={formIsDirty}
                getInitialValues={getInitialValues}
                setValues={setValues}
                licenses={licenses}
                getArticle={getArticle}
                fetchSearchTags={fetchSearchTags}
                {...rest}
              />
            )}

            <EditorFooter
              showSimpleFooter={!article.id}
              isSubmitting={isSubmitting}
              formIsDirty={formIsDirty}
              savedToServer={savedToServer}
              getEntity={getArticle}
              errors={errors}
              values={values}
              onSaveClick={saveAsNewVersion => {
                handleSubmit(formik, saveAsNewVersion);
              }}
              entityStatus={article.status}
              getStateStatuses={fetchStatusStateMachine}
              validateEntity={validateDraft}
              isArticle
              isNewlyCreated={isNewlyCreated}
              {...formikProps}
              {...rest}
            />
            <FormikAlertModalWrapper
              isSubmitting={isSubmitting}
              formIsDirty={formIsDirty}
              onContinue={translateOnContinue ? translateArticle : () => {}}
              severity="danger"
              text={t('alertModal.notSaved')}
            />
          </Form>
        );
      }}
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
  translateArticle: PropTypes.func,
  isNewlyCreated: PropTypes.bool,
};

export default injectT(LearningResourceForm);
