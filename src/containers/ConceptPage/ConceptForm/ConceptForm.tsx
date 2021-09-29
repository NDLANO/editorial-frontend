/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect, useMemo } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Accordions, AccordionSection } from '@ndla/accordion';
import { Formik, FormikProps, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import { isFormikFormDirty } from '../../../util/formHelper';
import { toEditConcept } from '../../../util/routeHelpers';
import * as articleStatuses from '../../../util/constants/ArticleStatus';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import validateFormik from '../../../components/formikValidationSchema';
import * as messageActions from '../../Messages/messagesActions';
import { formClasses } from '../../FormikForm';
import {
  getPatchApiConcept,
  conceptFormRules,
  conceptApiTypeToFormType,
  conceptFormTypeToApiType,
} from '../conceptUtil';
import { ConceptArticles, ConceptCopyright, ConceptContent, ConceptMetaData } from '../components';

import FormWrapper from './FormWrapper';
import {
  ConceptApiType,
  ConceptStatusType,
  ConceptTagsSearchResult,
  NewConceptType,
  PatchConceptType,
} from '../../../modules/concept/conceptApiInterfaces';
import { License } from '../../../interfaces';
import { ConceptFormValues } from '../conceptInterfaces';
import { SubjectType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { NewReduxMessage, ReduxMessageError } from '../../Messages/messagesSelectors';
import ConceptFormFooter from './ConceptFormFooter';
import { DraftApiType } from '../../../modules/draft/draftApiInterfaces';

interface Props {
  concept?: ConceptApiType;
  conceptChanged?: boolean;
  fetchConceptTags: (input: string, language: string) => Promise<ConceptTagsSearchResult>;
  inModal: boolean;
  isNewlyCreated?: boolean;
  licenses: License[];
  conceptArticles: DraftApiType[];
  onClose?: () => void;
  language: string;
  onUpdate: (updateConcept: NewConceptType | PatchConceptType, revision?: number) => Promise<void>;
  subjects: SubjectType[];
  translateToNN?: () => void;
  updateConceptAndStatus?: (
    updatedConcept: PatchConceptType,
    newStatus: ConceptStatusType,
    dirty: boolean,
  ) => Promise<void>;
}

const ConceptForm = ({
  concept,
  conceptChanged,
  fetchConceptTags,
  inModal,
  isNewlyCreated = false,
  licenses,
  onClose,
  subjects,
  translateToNN,
  language,
  updateConceptAndStatus,
  onUpdate,
  applicationError,
  createMessage,
  conceptArticles,
}: Props & PropsFromRedux) => {
  const [savedToServer, setSavedToServer] = useState(false);
  const [translateOnContinue, setTranslateOnContinue] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setSavedToServer(false);
  }, [concept]);

  const handleSubmit = async (
    values: ConceptFormValues,
    formikHelpers: FormikHelpers<ConceptFormValues>,
  ) => {
    formikHelpers.setSubmitting(true);
    const revision = concept?.revision;
    const status = concept?.status;
    const initialStatus = status?.current;
    const newStatus = values.status?.current;
    const statusChange = initialStatus !== newStatus;

    try {
      if (statusChange && updateConceptAndStatus) {
        // if editor is not dirty, OR we are unpublishing, we don't save before changing status
        const fDirty = isFormikFormDirty({ values, initialValues, dirty: true });
        const skipSaving = newStatus === articleStatuses.UNPUBLISHED || !fDirty;
        await updateConceptAndStatus(getPatchApiConcept(values, licenses), newStatus!, !skipSaving);
      } else {
        await onUpdate(getPatchApiConcept(values, licenses), revision!);
      }
      formikHelpers.resetForm();
      formikHelpers.setSubmitting(false);
      setSavedToServer(true);
    } catch (err) {
      applicationError(err as ReduxMessageError);
      formikHelpers.setSubmitting(false);
      setSavedToServer(false);
    }
  };

  const initialValues = conceptApiTypeToFormType(concept, language, subjects, conceptArticles);
  const initialErrors = useMemo(() => validateFormik(initialValues, conceptFormRules, t), [
    initialValues,
    t,
  ]);

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnMount
      validate={values => validateFormik(values, conceptFormRules, t)}>
      {formikProps => {
        const { values, errors }: FormikProps<ConceptFormValues> = formikProps;
        const editUrl = values.id ? (lang: string) => toEditConcept(values.id!, lang) : undefined;
        return (
          <FormWrapper inModal={inModal} {...formClasses()}>
            <HeaderWithLanguage
              content={{ ...concept, title: concept?.title.title }}
              editUrl={editUrl}
              getEntity={() => conceptFormTypeToApiType(values, licenses, concept?.updatedBy)}
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
            <ConceptFormFooter
              createMessage={createMessage}
              entityStatus={concept?.status}
              conceptChanged={!!conceptChanged}
              inModal={inModal}
              savedToServer={savedToServer}
              isNewlyCreated={isNewlyCreated}
              showSimpleFooter={!concept?.id}
              onClose={onClose}
              onContinue={translateOnContinue && translateToNN ? translateToNN : () => {}}
              getApiConcept={() => conceptFormTypeToApiType(values, licenses, concept?.updatedBy)}
            />
          </FormWrapper>
        );
      }}
    </Formik>
  );
};

const mapDispatchToProps = {
  applicationError: messageActions.applicationError,
  createMessage: (message: NewReduxMessage) => messageActions.addMessage(message),
};

const reduxConnector = connect(undefined, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof reduxConnector>;

export default reduxConnector(ConceptForm);
