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
} from '../../../util/articleContentConverter';
import { parseEmbedTag, createEmbedTag } from '../../../util/embedTagHelpers';
import { LicensesArrayOf, ArticleShape } from '../../../shapes';
import {
  DEFAULT_LICENSE,
  parseCopyrightContributors,
  isFormikFormDirty,
  topicArticleRules,
  parseImageUrl,
} from '../../../util/formHelper';
import { FormikAlertModalWrapper, formClasses } from '../../FormikForm';
import { toEditArticle } from '../../../util/routeHelpers';
import { nullOrUndefined } from '../../../util/articleUtil';
import validateFormik from '../../../components/formikValidationSchema';
import TopicArticleAccordionPanels from './TopicArticleAccordionPanels';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import EditorFooter from '../../../components/SlateEditor/EditorFooter';
import { useArticleFormHooks } from '../../FormikForm/articleFormHooks';
import usePreventWindowUnload from '../../FormikForm/preventWindowUnloadHook';
import Spinner from '../../../components/Spinner';

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
    title: article.title || '',
    updated: article.updated,
    updatePublished: false,
    visualElementAlt: visualElement?.alt || '',
    visualElementCaption: visualElement?.caption || '',
    visualElement: visualElement || {},
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

  const hasPublishedDateChaned = initialValues.published !== values.published;
  if (hasPublishedDateChaned || values.updatePublished) {
    return values.published;
  }
  return undefined;
};

// TODO preview parameter does not work for topic articles. Used from PreviewDraftLightbox
const getArticleFromSlate = ({
  values,
  initialValues,
  licenses,
  preview = false,
}) => {
  const emptyField = values.id ? '' : undefined;
  const visualElement = createEmbedTag(
    isEmpty(values.visualElement)
      ? {}
      : {
          ...values.visualElement,
          caption:
            values.visualElementCaption &&
            values.visualElementCaption.length > 0
              ? values.visualElementCaption
              : undefined,
          alt:
            values.visualElementAlt && values.visualElementAlt.length > 0
              ? values.visualElementAlt
              : undefined,
        },
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
    title: values.title,
    visualElement: visualElement,
    grepCodes: values.grepCodes,
  };

  return article;
};

const TopicArticleForm = props => {
  const {
    savedToServer,
    formikRef,
    initialValues,
    setResetModal,
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
      validateOnMount
      initialValues={initialValues}
      validateOnChange={false}
      ref={formikRef}
      onSubmit={() => ({})}
      validate={values => validateFormik(values, topicArticleRules, t)}>
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
        const getArticle = () =>
          getArticleFromSlate({ values, initialValues, licenses });
        return (
          <Form {...formClasses()}>
            <HeaderWithLanguage
              values={values}
              content={article}
              getArticle={getArticle}
              editUrl={lang =>
                toEditArticle(values.id, values.articleType, lang)
              }
              formIsDirty={formIsDirty}
              getInitialValues={getInitialValues}
              setValues={setValues}
              isSubmitting={isSubmitting}
              translateArticle={translateArticle}
              setTranslateOnContinue={setTranslateOnContinue}
              {...rest}
            />
            {translating ? (
              <Spinner withWrapper />
            ) : (
              <TopicArticleAccordionPanels
                values={values}
                errors={errors}
                updateNotes={updateArticle}
                article={article}
                touched={touched}
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
              showReset={() => setResetModal(true)}
              errors={errors}
              values={values}
              onSaveClick={saveAsNewVersion =>
                handleSubmit(formik, saveAsNewVersion)
              }
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

TopicArticleForm.propTypes = {
  revision: PropTypes.number,
  updateArticle: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired,
  applicationError: PropTypes.func.isRequired,
  articleStatus: PropTypes.shape({
    current: PropTypes.string,
    other: PropTypes.arrayOf(PropTypes.string),
  }),
  updateArticleAndStatus: PropTypes.func,
  licenses: LicensesArrayOf,
  article: ArticleShape,
  translating: PropTypes.bool,
  translateArticle: PropTypes.func,
  isNewlyCreated: PropTypes.bool,
};

export default injectT(TopicArticleForm);
