/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AccordionWrapper } from '@ndla/accordion';
import { Formik } from 'formik';
import { injectT } from '@ndla/i18n';
import { editorValueToPlainText } from '../../../util/articleContentConverter';
import { createEmbedTag } from '../../../util/embedTagHelpers';
import { isFormikFormDirty } from '../../../util/formHelper';
import { toEditConcept } from '../../../util/routeHelpers.js';
import * as articleStatuses from '../../../util/constants/ArticleStatus';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import validateFormik from '../../../components/formikValidationSchema';
import * as messageActions from '../../Messages/messagesActions';
import { formClasses } from '../../FormikForm';
import ConceptArticles from '../components/ConceptArticles';
import ConceptCopyright from '../components/ConceptCopyright';
import ConceptContent from '../components/ConceptContent';
import ConceptMetaData from '../components/ConceptMetaData';
import { transformApiConceptToFormValues, getCreatedDate, getApiConcept } from '../conceptUtil';

import FormWrapper from './FormWrapper';
import AccordionSection from './AccordionSection';
import FormFooter from './FormFooter';
import { ConceptShape, LicensesArrayOf, SubjectShape } from '../../../shapes';

const rules = {
  title: {
    required: true,
  },
  conceptContent: {
    required: true,
  },
  creators: {
    allObjectFieldsRequired: true,
  },
  metaImageAlt: {
    required: true,
    onlyValidateIf: values => !!values.metaImageId,
  },
  subjects: {
    minItems: 1,
  },
};

class ConceptForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savedToServer: false,
      translateOnContinue: false,
    };
    this.formik = React.createRef();
  }

  componentDidUpdate({ concept: prevConcept }) {
    const { concept } = this.props;
    if (concept.language !== prevConcept.language || concept.id !== prevConcept.id) {
      this.setState({ savedToServer: false });
      if (this.formik.current) {
        this.formik.current.resetForm();
      }
    }
    this.formik = React.createRef();
  }

  setTranslateOnContinue = translateOnContinue => {
    this.setState({ translateOnContinue: translateOnContinue });
  };

  getApiConcept = (values, initialValues) => {
    const { licenses } = this.props;
    return {
      id: values.id,
      title: values.title,
      content: editorValueToPlainText(values.conceptContent),
      language: values.language,
      supportedLanguages: values.supportedLanguages,
      copyright: {
        license: licenses.find(license => license.license === values.license),
        creators: values.creators,
        processors: values.processors,
        rightsholders: values.rightsholders,
      },
      agreementId: values.agreementId,
      metaImageId: values.metaImageId,
      metaImage: values.metaImageId
        ? {
            id: values.metaImageId,
            alt: values.metaImageAlt,
          }
        : null,
      source: values.source,
      subjectIds: values.subjects.map(subject => subject.id),
      tags: values.tags,
      created: getCreatedDate(values, initialValues),
      articleIds: values.articles.map(a => a.id),
      articles: values.articles,
      parsedVisualElement: values.visualElementObject,
      visualElement: createEmbedTag(values.visualElementObject),
    };
  };

  handleSubmit = async formik => {
    formik.setSubmitting(true);
    const {
      onUpdate,
      concept,
      applicationError,
      updateConceptAndStatus,
      setConcept,
      licenses,
    } = this.props;
    const { revision } = concept;
    const values = formik.values;
    const initialValues = formik.initialValues;
    const initialStatus = concept.status?.current;
    const newStatus = formik.values.status?.current;
    const statusChange = initialStatus !== newStatus;
    if (
      formik.errors &&
      Object.keys(formik.errors).length > 0 &&
      formik.errors.constructor === Object
    ) {
      setConcept({ status: concept.status, ...getApiConcept(values, initialValues, licenses) });
      // if formik has errors, we stop submitting and show the error message(s)
      const e = Object.keys(formik.errors).map(key => `${key}: ${formik.errors[key]}`);
      this.props.createMessage({
        message: e.join(' '),
        severity: 'danger',
        timeToLive: 0,
      });
      formik.setSubmitting(false);
      this.setState({ savedToServer: false });
      return;
    }

    try {
      if (statusChange) {
        // if editor is not dirty, OR we are unpublishing, we don't save before changing status
        const skipSaving =
          newStatus === articleStatuses.UNPUBLISHED ||
          !isFormikFormDirty({
            values,
            initialValues,
            dirty: true,
          });
        await updateConceptAndStatus(
          getApiConcept(values, initialValues, licenses),
          newStatus,
          !skipSaving,
        );
      } else {
        await onUpdate({
          ...getApiConcept(values, initialValues, licenses),
          revision,
        });
      }
      formik.resetForm();
      formik.setSubmitting(false);
      this.setState({ savedToServer: true });
    } catch (err) {
      applicationError(err);
      formik.setSubmitting(false);
      this.setState({ savedToServer: false });
    }
  };

  render() {
    const {
      concept,
      createMessage,
      fetchConceptTags,
      fetchStateStatuses,
      inModal,
      isNewlyCreated,
      licenses,
      onClose,
      subjects,
      t,
      translateConcept,
    } = this.props;
    const { savedToServer, translateOnContinue } = this.state;

    const initialValues = transformApiConceptToFormValues(concept, subjects);
    return (
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          this.handleSubmit({ ...actions, values });
        }}
        innerRef={this.formik}
        enableReinitialize
        validateOnMount
        validate={values => validateFormik(values, rules, t)}>
        {formikProps => {
          const { values, errors } = formikProps;
          return (
            <FormWrapper inModal={inModal} {...formClasses()}>
              <HeaderWithLanguage
                content={concept}
                editUrl={lang => toEditConcept(values.id, lang)}
                getEntity={() => getApiConcept(values, initialValues, licenses)}
                translateArticle={translateConcept}
                type="concept"
                setTranslateOnContinue={this.setTranslateOnContinue}
                values={values}
              />
              <AccordionWrapper>
                <AccordionSection
                  id="concept-content"
                  title={t('form.contentSection')}
                  className="u-4/6@desktop u-push-1/6@desktop"
                  hasError={['title', 'conceptContent'].some(field => !!errors[field])}
                  startOpen>
                  <ConceptContent classes={formClasses} />
                </AccordionSection>
                <AccordionSection
                  id="concept-copyright"
                  title={t('form.copyrightSection')}
                  className="u-6/6"
                  hasError={['creators', 'license'].some(field => !!errors[field])}>
                  <ConceptCopyright
                    licenses={licenses}
                    disableAgreements
                    label={t('form.concept.source')}
                  />
                </AccordionSection>
                <AccordionSection
                  id="concept-metadataSection"
                  title={t('form.metadataSection')}
                  className="u-6/6"
                  hasError={['tags', 'metaImageAlt', 'subjects'].some(field => !!errors[field])}>
                  <ConceptMetaData fetchTags={fetchConceptTags} subjects={subjects} />
                </AccordionSection>
                <AccordionSection
                  id="concept-articles"
                  title={t('form.articleSection')}
                  className="u-6/6"
                  hasError={['articles'].some(field => !!errors[field])}>
                  <ConceptArticles />
                </AccordionSection>
              </AccordionWrapper>
              <FormFooter
                entityStatus={concept.status}
                inModal={inModal}
                savedToServer={savedToServer}
                isNewlyCreated={isNewlyCreated}
                showSimpleFooter={!concept.id}
                onClose={onClose}
                onContinue={translateOnContinue ? translateConcept : () => {}}
                handleSubmit={this.handleSubmit}
                createMessage={createMessage}
                getStateStatuses={fetchStateStatuses}
                getApiConcept={() => getApiConcept(values, initialValues, licenses)}
              />
            </FormWrapper>
          );
        }}
      </Formik>
    );
  }
}

ConceptForm.propTypes = {
  applicationError: PropTypes.func.isRequired,
  concept: ConceptShape,
  createMessage: PropTypes.func.isRequired,
  fetchConceptTags: PropTypes.func.isRequired,
  fetchStateStatuses: PropTypes.func,
  history: PropTypes.shape({
    goBack: PropTypes.func,
    push: PropTypes.func.isRequired,
  }).isRequired,
  inModal: PropTypes.bool,
  isNewlyCreated: PropTypes.bool,
  licenses: LicensesArrayOf,
  locale: PropTypes.string,
  onClose: PropTypes.func,
  onUpdate: PropTypes.func.isRequired,
  subjects: PropTypes.arrayOf(SubjectShape),
  translateConcept: PropTypes.func,
  updateConceptAndStatus: PropTypes.func,
  setConcept: PropTypes.func,
};

const mapDispatchToProps = {
  applicationError: messageActions.applicationError,
};

export default compose(injectT, withRouter, connect(undefined, mapDispatchToProps))(ConceptForm);
