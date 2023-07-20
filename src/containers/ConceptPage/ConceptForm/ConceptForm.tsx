/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, useMemo } from 'react';
import {
  IConcept,
  INewConcept,
  IUpdatedConcept,
  ITagsSearchResult,
  IConceptSummary,
  IGlossExample,
} from '@ndla/types-backend/concept-api';
import { IArticle } from '@ndla/types-backend/draft-api';
import { Formik, FormikProps, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import { FormHeaderType } from '../../../components/HeaderWithLanguage/HeaderWithLanguage';
import GlossDataSection from '../../GlossPage/components/GlossDataSection';
import { ARCHIVED, PUBLISHED, UNPUBLISHED } from '../../../constants';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import validateFormik, { getWarnings, RulesType } from '../../../components/formikValidationSchema';
import {
  conceptApiTypeToFormType,
  getNewConceptType,
  getUpdatedConceptType,
} from '../conceptTransformers';
import { ConceptArticles, ConceptCopyright, ConceptContent, ConceptMetaData } from '../components';
import { ConceptFormValues } from '../conceptInterfaces';
import { SubjectType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import ConceptFormFooter from './ConceptFormFooter';
import { MessageError, useMessages } from '../../Messages/MessagesProvider';
import { useLicenses } from '../../../modules/draft/draftQueries';
import FormWrapper from '../../../components/FormWrapper';
import { useSession } from '../../../containers/Session/SessionProvider';
import FormAccordion from '../../../components/Accordion/FormAccordion';
import FormAccordions from '../../../components/Accordion/FormAccordions';

const STATUSES_RESPONSIBLE_NOT_REQUIRED = [PUBLISHED, ARCHIVED, UNPUBLISHED];

interface UpdateProps {
  onUpdate: (updatedConcept: IUpdatedConcept, revision?: number) => Promise<IConcept>;
}

interface CreateProps {
  onCreate: (newConcept: INewConcept) => Promise<IConcept>;
}

interface Props {
  upsertProps: CreateProps | UpdateProps;
  concept?: IConcept;
  conceptChanged?: boolean;
  fetchConceptTags: (input: string, language: string) => Promise<ITagsSearchResult>;
  inModal: boolean;
  isNewlyCreated?: boolean;
  conceptArticles: IArticle[];
  onClose?: () => void;
  language: string;
  subjects: SubjectType[];
  initialTitle?: string;
  onUpserted?: (concept: IConceptSummary | IConcept) => void;
  supportedLanguages: string[];
  conceptType?: string;
}

const conceptFormBaseRules: RulesType<ConceptFormValues, IConcept> = {
  title: {
    required: true,
    warnings: {
      languageMatch: true,
    },
  },
  conceptContent: {
    required: true,
    warnings: {
      apiField: 'content',
      languageMatch: true,
    },
  },
  creators: {
    allObjectFieldsRequired: true,
  },
  metaImageAlt: {
    required: true,
    onlyValidateIf: (values: ConceptFormValues) => !!values.metaImageId,
    warnings: {
      apiField: 'metaImage',
      languageMatch: true,
    },
  },

  visualElement: {
    warnings: {
      languageMatch: true,
    },
  },
  tags: {
    warnings: {
      languageMatch: true,
    },
  },
  license: {
    required: false,
    test: (values) => {
      const authors = values.creators.concat(values.rightsholders).concat(values.processors);
      if (!values.license || values.license === 'N/A' || authors.length > 0) return undefined;
      return { translationKey: 'validation.noLicenseWithoutCopyrightHolder' };
    },
  },
  responsibleId: {
    required: true,
    onlyValidateIf: (values: ConceptFormValues) =>
      STATUSES_RESPONSIBLE_NOT_REQUIRED.every((status) => values.status?.current !== status),
  },
};

const conceptRules: RulesType<ConceptFormValues, IConcept> = {
  ...conceptFormBaseRules,
  subjects: {
    minItems: 1,
  },
};

const glossRules: RulesType<ConceptFormValues, IConcept> = {
  ...conceptFormBaseRules,

  glossInfoErrors: {
    test: (values) => {
      if (values.glossData) {
        const { gloss, wordClass, originalLanguage } = values.glossData;
        if (!gloss || !wordClass || !originalLanguage)
          return { translationKey: 'form.concept.glossDataSection.glossMissingFields' };
      }
      return undefined;
    },
  },

  glossTranscriptionErrors: {
    onlyValidateIf: (values: ConceptFormValues) => {
      if (values.glossData && values.glossData.originalLanguage === 'zh') {
        return Object.keys(values.glossData.transcriptions).length !== 0;
      }
      return false;
    },
    test: (values) => {
      if (values.glossData) {
        const { transcriptions } = values.glossData;
        if (Object.keys(transcriptions).length !== 0) {
          const hasMissingField = Object.entries(transcriptions).flat().includes('');
          if (hasMissingField) {
            return { translationKey: 'form.concept.glossDataSection.transcriptionMissingFields' };
          }
        }
      }
      return undefined;
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
  language,
  upsertProps,
  conceptArticles,
  initialTitle,
  onUpserted,
  supportedLanguages,
  conceptType = 'concept',
}: Props) => {
  const [savedToServer, setSavedToServer] = useState(false);
  const { t } = useTranslation();
  const { applicationError } = useMessages();
  const { data: licenses = [] } = useLicenses({ placeholderData: [] });
  const { ndlaId } = useSession();

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
      let savedConcept: IConcept;
      if ('onCreate' in upsertProps) {
        savedConcept = await upsertProps.onCreate(getNewConceptType(values, licenses, conceptType));
      } else {
        const conceptWithStatus = {
          ...getUpdatedConceptType(values, licenses, conceptType),
          ...(statusChange ? { status: newStatus } : {}),
        };
        savedConcept = await upsertProps.onUpdate(conceptWithStatus, revision!);
      }
      formikHelpers.resetForm({
        values: conceptApiTypeToFormType(savedConcept, language, subjects, conceptArticles, ndlaId),
      });
      formikHelpers.setSubmitting(false);
      setSavedToServer(true);
      onUpserted?.(savedConcept);
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
    ndlaId,
    initialTitle,
  );

  const isGloss = conceptType === 'gloss';
  const formRules = isGloss ? glossRules : conceptRules;
  const initialWarnings = getWarnings(initialValues, formRules, t, concept);
  const initialErrors = useMemo(
    () => validateFormik(initialValues, formRules, t),
    [initialValues, t, formRules],
  );

  const validateConceptForm = (values: ConceptFormValues) => {
    const errors = validateFormik(values, formRules, t);
    if (isGloss) {
      let examplesHasError = false;
      values.glossData!.examples.forEach((languageVariant, example_index) => {
        let exampleHasError = false;
        languageVariant.forEach((e: IGlossExample, language_index) => {
          const name = `glossData.examples.${example_index}.${language_index}`;
          const { example, language, transcriptions } = e;
          if (!example || !language) {
            errors[name] = t('form.concept.glossDataSection.languageMissingFields');
            if (!exampleHasError) {
              exampleHasError = true;
            }
          }
          if (Object.keys(transcriptions).length !== 0) {
            const hasMissingField = Object.entries(transcriptions).flat().includes('');
            if (hasMissingField) {
              errors[`glossData.examples.${example_index}.${language_index}.transcriptions`] = t(
                'form.concept.glossDataSection.transcriptionMissingFields',
              );
              if (!exampleHasError) {
                exampleHasError = true;
              }
            }
          }

          if (exampleHasError) {
            errors[`glossData.examples.${example_index}`] = 'Error in example';
            if (!examplesHasError) {
              examplesHasError = true;
            }
          }
        });
      });
      if (examplesHasError) {
        errors.glossExampleErrors = 'Error in examples';
      }
    }
    return errors;
  };

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnMount
      validate={(values) => validateConceptForm(values)}
      initialStatus={{ warnings: initialWarnings }}
    >
      {(formikProps) => {
        const { errors }: FormikProps<ConceptFormValues> = formikProps;
        return (
          <FormWrapper inModal={inModal}>
            <HeaderWithLanguage
              id={concept?.id}
              language={language}
              concept={concept}
              status={concept?.status}
              title={concept?.title.title ?? initialTitle}
              type={conceptType as FormHeaderType}
              supportedLanguages={supportedLanguages}
            />
            <FormAccordions defaultOpen={['content']}>
              <FormAccordion
                id="content"
                className="u-4/6@desktop u-push-1/6@desktop"
                title={t('form.contentSection')}
                hasError={!!(errors.title || errors.conceptContent)}
              >
                <ConceptContent />
              </FormAccordion>
              {conceptType === 'gloss' && (
                <FormAccordion
                  id="glossData"
                  title={t('form.concept.glossDataSection.gloss')}
                  hasError={
                    !!(
                      errors.glossInfoErrors ||
                      errors.glossExampleErrors ||
                      errors.glossTranscriptionErrors
                    )
                  }
                >
                  <GlossDataSection />
                </FormAccordion>
              )}
              <FormAccordion
                id="copyright"
                title={t('form.copyrightSection')}
                hasError={!!(errors.creators || errors.license)}
              >
                <ConceptCopyright
                  label={t('form.concept.source')}
                  description={t('form.concept.markdown')}
                />
              </FormAccordion>
              <FormAccordion
                id="metadata"
                title={t('form.metadataSection')}
                hasError={!!(errors.tags || errors.metaImageAlt || errors.subjects)}
              >
                <ConceptMetaData
                  fetchTags={fetchConceptTags}
                  subjects={subjects}
                  inModal={inModal}
                  language={language}
                />
              </FormAccordion>
              <FormAccordion
                id="articles"
                title={t('form.articleSection')}
                hasError={!!errors.articles}
              >
                <ConceptArticles />
              </FormAccordion>
            </FormAccordions>
            <ConceptFormFooter
              entityStatus={concept?.status}
              conceptChanged={!!conceptChanged}
              inModal={inModal}
              savedToServer={savedToServer}
              isNewlyCreated={isNewlyCreated}
              showSimpleFooter={!concept?.id}
              onClose={onClose}
              responsibleId={concept?.responsible?.responsibleId}
            />
          </FormWrapper>
        );
      }}
    </Formik>
  );
};

export default ConceptForm;
