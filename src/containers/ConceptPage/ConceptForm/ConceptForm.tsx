/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Accordions, AccordionSection } from '@ndla/accordion';
import { Formik, FormikProps, FormikHelpers } from 'formik';
import { injectT, tType } from '@ndla/i18n';
import { isFormikFormDirty } from '../../../util/formHelper';
import { toEditConcept } from '../../../util/routeHelpers';
import * as articleStatuses from '../../../util/constants/ArticleStatus';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import validateFormik from '../../../components/formikValidationSchema';
import * as messageActions from '../../Messages/messagesActions';
import { formClasses } from '../../FormikForm';
import {
  transformApiConceptToFormValues,
  getPatchApiConcept,
  getConcept,
  conceptFormRules,
} from '../conceptUtil';
import { ConceptArticles, ConceptCopyright, ConceptContent, ConceptMetaData } from '../components';

import FormWrapper from './FormWrapper';
import FormFooter from './FormFooter';
import { NewConceptType, PatchConceptType } from '../../../modules/concept/conceptApiInterfaces';
import { License, SubjectType, SearchResult, ConceptStatusType } from '../../../interfaces';
import { ConceptFormType, ConceptFormValues } from '../conceptInterfaces';

interface Props {
  applicationError: (err: string) => void;
  concept: ConceptFormType;
  conceptChanged: boolean;
  fetchConceptTags: (input: string, language: string) => Promise<SearchResult>;
  inModal: boolean;
  isNewlyCreated: boolean;
  licenses: License[];
  onClose: () => void;
  onUpdate: (updateConcept: NewConceptType | PatchConceptType, revision?: string) => void;
  subjects: SubjectType[];
  translateToNN: () => void;
  updateConceptAndStatus: (
    updatedConcept: PatchConceptType,
    newStatus: ConceptStatusType,
    dirty: boolean,
  ) => void;
}

const ConceptForm = ({
  concept,
  conceptChanged,
  fetchConceptTags,
  inModal,
  isNewlyCreated,
  licenses,
  onClose,
  subjects,
  translateToNN,
  updateConceptAndStatus,
  onUpdate,
  applicationError,
  t,
}: Props & tType) => {
  const [savedToServer, setSavedToServer] = useState(false);
  const [translateOnContinue, setTranslateOnContinue] = useState(false);

  useEffect(() => {
    setSavedToServer(false);
  }, [concept]);
  const initialValues = transformApiConceptToFormValues(concept, subjects);

  const handleSubmit = async (
    values: ConceptFormValues,
    formikHelpers: FormikHelpers<ConceptFormValues>,
  ) => {
    formikHelpers.setSubmitting(true);
    const { revision, status } = concept;
    const initialStatus = status?.current;
    const newStatus = values.status?.current;
    const statusChange = initialStatus !== newStatus;

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
        await updateConceptAndStatus(getPatchApiConcept(values, licenses), newStatus, !skipSaving);
      } else {
        await onUpdate(getPatchApiConcept(values, licenses), revision);
      }
      formikHelpers.resetForm();
      formikHelpers.setSubmitting(false);
      setSavedToServer(true);
    } catch (err) {
      applicationError(err);
      formikHelpers.setSubmitting(false);
      setSavedToServer(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnMount
      validate={values => validateFormik(values, conceptFormRules, t)}>
      {formikProps => {
        const { values, errors }: FormikProps<ConceptFormValues> = formikProps;
        return (
          <FormWrapper inModal={inModal} {...formClasses()}>
            <HeaderWithLanguage
              content={concept}
              editUrl={(lang: string) => toEditConcept(values.id, lang)}
              getEntity={() => getConcept(values, licenses, concept.updatedBy)}
              translateToNN={translateToNN}
              type="concept"
              setTranslateOnContinue={setTranslateOnContinue}
              values={values}
            />
            <Accordions>
              <AccordionSection
                id="concept-content"
                title={t('form.contentSection')}
                className="u-4/6@desktop u-push-1/6@desktop"
                hasError={!!(errors.slatetitle || errors.conceptContent)}
                startOpen>
                <ConceptContent />
              </AccordionSection>
              <AccordionSection
                id="concept-copyright"
                title={t('form.copyrightSection')}
                className="u-6/6"
                hasError={!!(errors.creators || errors.license)}>
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
                hasError={!!(errors.tags || errors.metaImageAlt || errors.subjects)}>
                <ConceptMetaData
                  fetchTags={fetchConceptTags}
                  subjects={subjects}
                  inModal={inModal}
                />
              </AccordionSection>
              <AccordionSection
                id="concept-articles"
                title={t('form.articleSection')}
                className="u-6/6"
                hasError={!!errors.articles}>
                <ConceptArticles />
              </AccordionSection>
            </Accordions>
            <FormFooter
              entityStatus={concept.status}
              conceptChanged={conceptChanged}
              inModal={inModal}
              savedToServer={savedToServer}
              isNewlyCreated={isNewlyCreated}
              showSimpleFooter={!concept.id}
              onClose={onClose}
              onContinue={translateOnContinue ? translateToNN : () => {}}
              getApiConcept={() => getConcept(values, licenses, concept.updatedBy)}
            />
          </FormWrapper>
        );
      }}
    </Formik>
  );
};

const mapDispatchToProps = {
  applicationError: messageActions.applicationError,
};

export default compose(injectT, withRouter, connect(undefined, mapDispatchToProps))(ConceptForm);
