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
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import EditorFooter from '../../../components/SlateEditor/EditorFooter';
import { useArticleFormHooks } from '../../FormikForm/articleFormHooks';

export const getInitialValues = (article = {}) => {
  const metaImageId = parseImageUrl(article.metaImage);
  return {
    id: article.id,
    revision: article.revision,
    title: article.title || '',
    introduction: plainTextToEditorValue(article.introduction, true),
    content: learningResourceContentToEditorValue(article.content),
    tags: article.tags || [],
    creators: parseCopyrightContributors(article, 'creators'),
    processors: parseCopyrightContributors(article, 'processors'),
    rightsholders: parseCopyrightContributors(article, 'rightsholders'),
    updated: article.updated,
    published: article.published,
    updatePublished: false,
    origin:
      article.copyright && article.copyright.origin
        ? article.copyright.origin
        : '',
    license:
      article.copyright && article.copyright.license
        ? article.copyright.license.license
        : DEFAULT_LICENSE.license,
    metaDescription: plainTextToEditorValue(article.metaDescription, true),
    metaImageId,
    metaImageAlt: article.metaImage ? article.metaImage.alt : '',
    supportedLanguages: article.supportedLanguages || [],
    agreementId: article.copyright ? article.copyright.agreementId : undefined,
    language: article.language,
    articleType: 'standard',
    status: article.status || {},
    notes: [],
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
  const article = {
    id: values.id,
    title: values.title,
    introduction: editorValueToPlainText(values.introduction),
    tags: values.tags,
    content: content && content.length > 0 ? content : emptyContent,
    metaImage: {
      id: values.metaImageId,
      alt: values.metaImageAlt,
    },
    metaDescription: editorValueToPlainText(values.metaDescription),
    articleType: 'standard',
    copyright: {
      license: licenses.find(license => license.license === values.license),
      origin: values.origin,
      creators: values.creators,
      processors: values.processors,
      rightsholders: values.rightsholders,
    },
    notes: values.notes || [],
    language: values.language,
    published: getPublishedDate(values, initialValues, preview),
    supportedLanguages: values.supportedLanguages,
  };

  return article;
};

const LearningResourceForm = props => {
  const {
    savedToServer,
    formikRef,
    initialValues,
    handleSubmit,
  } = useArticleFormHooks({ getInitialValues, getArticleFromSlate, ...props });

  const { t, article, onUpdate, licenses, ...rest } = props;
  return (
    <Formik
      initialValues={initialValues}
      validateOnBlur={false}
      ref={formikRef}
      onSubmit={handleSubmit}
      validate={values => validateFormik(values, learningResourceRules, t)}>
      {({
        values,
        dirty,
        isSubmitting,
        setValues,
        errors,
        touched,
        ...formikProps
      }) => {
        const formIsDirty = isFormikFormDirty({
          values,
          initialValues,
          dirty,
          type: 'learningResource',
        });
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
              {...rest}
            />
            <LearningResourcePanels
              values={values}
              errors={errors}
              article={article}
              touched={touched}
              updateNotes={onUpdate}
              formIsDirty={formIsDirty}
              getInitialValues={getInitialValues}
              setValues={setValues}
              licenses={licenses}
              getArticle={getArticle}
              {...rest}
            />
            <EditorFooter
              showSimpleFooter={!article.id}
              isSubmitting={isSubmitting}
              formIsDirty={formIsDirty}
              savedToServer={savedToServer}
              getArticle={getArticle}
              errors={errors}
              values={values}
              {...formikProps}
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

LearningResourceForm.propTypes = {
  licenses: LicensesArrayOf,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  revision: PropTypes.number,
  onUpdate: PropTypes.func.isRequired,
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
};

export default injectT(LearningResourceForm);
