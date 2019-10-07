/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
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
import validateFormik from '../../../components/formikValidationSchema';
import TopicArticleAccordionPanels from './TopicArticleAccordionPanels';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import EditorFooter from '../../../components/SlateEditor/EditorFooter';
import { useArticleFormHooks } from '../../FormikForm/articleFormHooks';

export const getInitialValues = (article = {}) => {
  const visualElement = parseEmbedTag(article.visualElement);
  const metaImageId = parseImageUrl(article.metaImage);
  return {
    id: article.id,
    revision: article.revision,
    updated: article.updated,
    published: article.published,
    updatePublished: false,
    title: article.title || '',
    introduction: plainTextToEditorValue(article.introduction, true),
    content: topicArticleContentToEditorValue(article.content),
    tags: article.tags || [],
    creators: parseCopyrightContributors(article, 'creators'),
    processors: parseCopyrightContributors(article, 'processors'),
    rightsholders: parseCopyrightContributors(article, 'rightsholders'),
    agreementId: article.copyright ? article.copyright.agreementId : undefined,
    license:
      article.copyright && article.copyright.license
        ? article.copyright.license.license
        : DEFAULT_LICENSE.license,
    metaDescription: plainTextToEditorValue(article.metaDescription, true),
    metaImageId,
    metaImageAlt: article.metaImage ? article.metaImage.alt : '',
    notes: [],
    visualElementAlt:
      visualElement && visualElement.alt ? visualElement.alt : '',
    visualElementCaption:
      visualElement && visualElement.caption ? visualElement.caption : '',
    visualElement: visualElement || {},
    language: article.language,
    supportedLanguages: article.supportedLanguages || [],
    articleType: 'topic-article',
    status: article.status || {},
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
  const article = {
    id: values.id,
    title: values.title,
    introduction: editorValueToPlainText(values.introduction),
    tags: values.tags,
    content: content || emptyField,
    visualElement: visualElement,
    metaDescription: editorValueToPlainText(values.metaDescription),
    articleType: 'topic-article',
    copyright: {
      license: licenses.find(license => license.license === values.license),
      creators: values.creators,
      processors: values.processors,
      rightsholders: values.rightsholders,
      agreementId: values.agreementId,
    },
    notes: values.notes || [],
    metaImage: {
      id: values.metaImageId,
      alt: values.metaImageAlt,
    },
    language: values.language,
    published: getPublishedDate(values, initialValues, preview),
    supportedLanguages: values.supportedLanguages,
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
  } = useArticleFormHooks({ getInitialValues, getArticleFromSlate, ...props });

  const { t, article, onUpdate, licenses, ...rest } = props;
  return (
    <Formik
      initialValues={initialValues}
      validateOnBlur={false}
      ref={formikRef}
      onSubmit={handleSubmit}
      validate={values => validateFormik(values, topicArticleRules, t)}>
      {({ values, dirty, isSubmitting, setValues, errors, touched }) => {
        const formIsDirty = isFormikFormDirty({
          values,
          initialValues,
          dirty,
        });
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
              {...rest}
            />
            <TopicArticleAccordionPanels
              values={values}
              errors={errors}
              updateNotes={onUpdate}
              article={article}
              touched={touched}
              getArticle={getArticle}
              formIsDirty={formIsDirty}
              getInitialValues={getInitialValues}
              setValues={setValues}
              licenses={licenses}
              {...rest}
            />
            <EditorFooter
              showSimpleFooter={!article.id}
              isSubmitting={isSubmitting}
              formIsDirty={formIsDirty}
              savedToServer={savedToServer}
              getArticle={getArticle}
              showReset={() => setResetModal(true)}
              errors={errors}
              values={values}
              handleSubmit={status =>
                handleSubmit(values, formikRef && formikRef.current, status)
              }
              {...rest}
            />
            <FormikAlertModalWrapper
              isSubmitting={isSubmitting}
              formIsDirty={formIsDirty}
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
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  revision: PropTypes.number,
  onUpdate: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired,
  applicationError: PropTypes.func.isRequired,
  articleStatus: PropTypes.shape({
    current: PropTypes.string,
    other: PropTypes.arrayOf(PropTypes.string),
  }),
  updateArticleAndStatus: PropTypes.func,
  licenses: LicensesArrayOf,
  article: ArticleShape,
};

export default injectT(TopicArticleForm);
