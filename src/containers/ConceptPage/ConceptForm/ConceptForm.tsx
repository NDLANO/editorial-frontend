/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, useMemo } from 'react';
import { Accordions, AccordionSection } from '@ndla/accordion';
import { Formik, FormikProps, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import { isFormikFormDirty } from '../../../util/formHelper';
import { toEditConcept } from '../../../util/routeHelpers';
import * as articleStatuses from '../../../util/constants/ArticleStatus';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import validateFormik, { RulesType } from '../../../components/formikValidationSchema';
import { formClasses } from '../../FormikForm';
import {
  conceptApiTypeToFormType,
  conceptFormTypeToApiType,
  getConceptPatchType,
} from '../conceptTransformers';
import { ConceptArticles, ConceptCopyright, ConceptContent, ConceptMetaData } from '../components';

import FormWrapper from './FormWrapper';
import {
  ConceptApiType,
  ConceptStatusType,
  ConceptTagsSearchResult,
  ConceptPostType,
  ConceptPatchType,
} from '../../../modules/concept/conceptApiInterfaces';
import { ConceptFormValues } from '../conceptInterfaces';
import { SubjectType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import ConceptFormFooter from './ConceptFormFooter';
import { DraftApiType } from '../../../modules/draft/draftApiInterfaces';
import { MessageError, useMessages } from '../../Messages/MessagesProvider';
import { useLicenses } from '../../../modules/draft/draftQueries';
import { getFieldsWithWrongLanguage } from '../../../util/articleUtil';
import { generateLanguageWarnings } from '../../FormikForm/utils';
import { WarningsProvider } from '../../FormikForm/WarningsProvider';

interface Props {
  concept?: ConceptApiType;
  conceptChanged?: boolean;
  fetchConceptTags: (input: string, language: string) => Promise<ConceptTagsSearchResult>;
  inModal: boolean;
  isNewlyCreated?: boolean;
  conceptArticles: DraftApiType[];
  onClose?: () => void;
  language: string;
  onUpdate: (
    updateConcept: ConceptPostType | ConceptPatchType,
    revision?: number,
  ) => Promise<ConceptApiType>;
  subjects: SubjectType[];
  initialTitle?: string;
  translateToNN?: () => void;
  updateConceptAndStatus?: (
    updatedConcept: ConceptPatchType,
    newStatus: ConceptStatusType,
    dirty: boolean,
  ) => Promise<ConceptApiType>;
}

const conceptFormRules: RulesType<ConceptFormValues> = {
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
    onlyValidateIf: (values: ConceptFormValues) => !!values.metaImageId,
  },
  subjects: {
    minItems: 1,
  },

  license: {
    required: false,
    test: values => {
      const authors = values.creators.concat(values.rightsholders).concat(values.processors);
      if (!values.license || values.license === 'N/A' || authors.length > 0) return undefined;
      return { translationKey: 'validation.noLicenseWithoutCopyrightHolder' };
    },
  },
};

const ConceptForm = ({
  concept,
  conceptChanged,
  fetchConceptTags,
  inModal,
  isNewlyCreated = false,
  onClose,
  subjects,
  translateToNN,
  language,
  updateConceptAndStatus,
  onUpdate,
  conceptArticles,
  initialTitle,
}: Props) => {
  const [savedToServer, setSavedToServer] = useState(false);
  const [translateOnContinue, setTranslateOnContinue] = useState(false);
  const { t } = useTranslation();
  const { applicationError } = useMessages();
  const { data: licenses } = useLicenses({ placeholderData: [] });

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

    let savedArticle;

    try {
      if (statusChange && updateConceptAndStatus) {
        // if editor is not dirty, OR we are unpublishing, we don't save before changing status
        const formikDirty = isFormikFormDirty({ values, initialValues, dirty: true });
        const skipSaving = newStatus === articleStatuses.UNPUBLISHED || !formikDirty;
        savedArticle = await updateConceptAndStatus(
          getConceptPatchType(values, licenses!),
          newStatus!,
          !skipSaving,
        );
      } else {
        savedArticle = await onUpdate(getConceptPatchType(values, licenses!), revision!);
      }
      formikHelpers.resetForm({
        values: conceptApiTypeToFormType(savedArticle, language, subjects, conceptArticles),
      });
      formikHelpers.setSubmitting(false);
      setSavedToServer(true);
    } catch (err) {
      applicationError(err as MessageError);
      formikHelpers.setSubmitting(false);
      setSavedToServer(false);
    }
  };

  const initialValues = conceptApiTypeToFormType(
    concept,
    language,
    subjects,
    conceptArticles,
    initialTitle,
  );
  const initialErrors = useMemo(() => validateFormik(initialValues, conceptFormRules, t), [
    initialValues,
    t,
  ]);
  const fieldsWithWrongLanguage = getFieldsWithWrongLanguage(concept, language);
  const warnings = generateLanguageWarnings(fieldsWithWrongLanguage, t);

  return (
    <WarningsProvider initialValues={warnings}>
      <Formik
        initialValues={initialValues}
        initialErrors={initialErrors}
        onSubmit={handleSubmit}
        enableReinitialize
        validateOnMount
        validate={values => validateFormik(values, conceptFormRules, t)}>
        {formikProps => {
          const { values, errors }: FormikProps<ConceptFormValues> = formikProps;
          const { id, revision, status, created, updated } = values;
          const requirements = id && revision && status && created && updated;
          const getEntity = requirements
            ? () => conceptFormTypeToApiType(values, licenses!, concept?.updatedBy)
            : undefined;
          const editUrl = values.id ? (lang: string) => toEditConcept(values.id!, lang) : undefined;
          return (
            <FormWrapper inModal={inModal} {...formClasses()}>
              <HeaderWithLanguage
                content={{ ...concept, title: concept?.title.title, language }}
                editUrl={editUrl}
                getEntity={getEntity}
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
                  hasError={!!(errors.title || errors.conceptContent)}
                  startOpen>
                  <ConceptContent />
                </AccordionSection>
                <AccordionSection
                  id="concept-copyright"
                  title={t('form.copyrightSection')}
                  className="u-6/6"
                  hasError={!!(errors.creators || errors.license)}>
                  <ConceptCopyright disableAgreements label={t('form.concept.source')} />
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
                entityStatus={concept?.status}
                conceptChanged={!!conceptChanged}
                inModal={inModal}
                savedToServer={savedToServer}
                isNewlyCreated={isNewlyCreated}
                showSimpleFooter={!concept?.id}
                onClose={onClose}
                onContinue={translateOnContinue && translateToNN ? translateToNN : () => {}}
                getApiConcept={getEntity}
              />
            </FormWrapper>
          );
        }}
      </Formik>
    </WarningsProvider>
  );
};

export default ConceptForm;
