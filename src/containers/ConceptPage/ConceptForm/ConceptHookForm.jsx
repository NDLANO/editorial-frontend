/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { AccordionWrapper } from '@ndla/accordion';
import { Formik } from 'formik';
import { injectT } from '@ndla/i18n';
import { isFormikFormDirty } from '../../../util/formHelper';
import { toEditConcept } from '../../../util/routeHelpers.js';
import * as articleStatuses from '../../../util/constants/ArticleStatus';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import validateFormik from '../../../components/formikValidationSchema';
import * as messageActions from '../../Messages/messagesActions';
import { formClasses } from '../../FormikForm';
import { transformApiConceptToFormValues, getApiConcept, conceptFormRules } from '../conceptUtil';
import { ConceptArticles, ConceptCopyright, ConceptContent, ConceptMetaData } from '../components';

import FormWrapper from './FormWrapper';
import AccordionSection from './AccordionSection';
import FormFooter from './FormFooter';
import { ConceptShape, LicensesArrayOf, SubjectShape } from '../../../shapes';

const ConceptForm = ({
  concept,
  setConcept,
  createMessage,
  fetchConceptTags,
  fetchStateStatuses,
  inModal,
  isNewlyCreated,
  licenses,
  onClose,
  subjects,
  translateConcept,
  updateConceptAndStatus,
  onUpdate,
  applicationError,
  t,
}) => {
  const [savedToServer, setSavedToServer] = useState(false);
  const [translateOnContinue, setTranslateOnContinue] = useState(false);

  useEffect(() => {
    setSavedToServer(false);
  }, [concept]);
  const initialValues = transformApiConceptToFormValues(concept, subjects);

  const handleSubmit = async formik => {
    formik.setSubmitting(true);
    const { revision, status } = concept;
    const { values, initialValues, errors } = formik;
    const initialStatus = status?.current;
    const newStatus = values.status?.current;
    const statusChange = initialStatus !== newStatus;

    if (errors && Object.keys(errors).length > 0 && errors.constructor === Object) {
      setConcept({ status: status, ...getApiConcept(values, initialValues, licenses) });
      // if formik has errors, we stop submitting and show the error message(s)
      const e = Object.keys(errors).map(key => `${key}: ${errors[key]}`);
      createMessage({
        message: e.join(' '),
        severity: 'danger',
        timeToLive: 0,
      });
      formik.setSubmitting(false);
      setSavedToServer(false);
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
      setSavedToServer(true);
    } catch (err) {
      applicationError(err);
      formik.setSubmitting(false);
      setSavedToServer(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values, actions) => {
        handleSubmit({ ...actions, values });
      }}
      enableReinitialize
      validateOnMount
      validate={values => validateFormik(values, conceptFormRules, t)}>
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
              setTranslateOnContinue={setTranslateOnContinue}
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
              handleSubmit={handleSubmit}
              createMessage={createMessage}
              getStateStatuses={fetchStateStatuses}
              getApiConcept={() => getApiConcept(values, initialValues, licenses)}
            />
          </FormWrapper>
        );
      }}
    </Formik>
  );
};

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
