/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useMemo, useCallback } from 'react';
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
import { Node } from '@ndla/types-taxonomy';
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
import { ConceptFormValues, ConceptType } from '../conceptInterfaces';
import ConceptFormFooter from './ConceptFormFooter';
import { MessageError, useMessages } from '../../Messages/MessagesProvider';
import { useLicenses } from '../../../modules/draft/draftQueries';
import FormWrapper from '../../../components/FormWrapper';
import { useSession } from '../../../containers/Session/SessionProvider';
import FormAccordion from '../../../components/Accordion/FormAccordion';
import FormAccordions from '../../../components/Accordion/FormAccordions';
import { isEmpty } from '../../../components/validators';

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
  subjects: Node[];
  initialTitle?: string;
  onUpserted?: (concept: IConceptSummary | IConcept) => void;
  supportedLanguages: string[];
  conceptType?: ConceptType;
}

const conceptFormBaseRules: RulesType<ConceptFormValues, IConcept> = {
  title: {
    required: true,
    warnings: {
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
  conceptContent: {
    required: true,
    warnings: {
      apiField: 'content',
      languageMatch: true,
    },
  },
  subjects: {
    minItems: 1,
  },
};

const glossRules: RulesType<ConceptFormValues, IConcept, IGlossExample> = {
  ...conceptFormBaseRules,
  conceptContent: {
    warnings: {
      apiField: 'content',
      languageMatch: true,
    },
  },
  gloss: {
    test: (values) => {
      if (!values.gloss?.gloss || !values.gloss?.wordClass || !values.gloss?.originalLanguage)
        return {
          translationKey: 'form.gloss.glossMissingFields',
        };
    },
  },
  examples: {
    nestedValidationRules: {
      example: {
        test: (values) => {
          const transcriptionMissingText =
            values?.transcriptions && Object.values(values.transcriptions).some((t) => !t);

          if (!values?.example || !values?.language || transcriptionMissingText)
            return { translationKey: 'form.gloss.exampleMissingFields' };
        },
      },
    },
  },
  transcriptions: {
    onlyValidateIf: (values) => {
      if (values.transcriptions) {
        return Object.keys(values.transcriptions).length !== 0;
      }
      return false;
    },
    test: (values) => {
      if (values.transcriptions && Object.values(values.transcriptions).includes('')) {
        return { translationKey: 'form.gloss.transcriptionMissingFields' };
      }
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

  const handleSubmit = async (
    values: ConceptFormValues,
    formikHelpers: FormikHelpers<ConceptFormValues>,
  ) => {
    if (
      ((!values.subjects.length || isEmpty(values.conceptContent)) &&
        values.conceptType === 'concept') ||
      isEmpty(values.title)
    )
      return;
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
    conceptType,
  );

  const isGloss = conceptType === 'gloss';
  const formRules = isGloss ? glossRules : conceptRules;

  const initialWarnings = useMemo(
    () => getWarnings(initialValues, formRules, t, concept),
    [concept, formRules, initialValues, t],
  );
  const initialErrors = useMemo(
    () => validateFormik(initialValues, formRules, t),
    [initialValues, t, formRules],
  );

  const validate = useCallback(
    (values: ConceptFormValues) => validateFormik(values, formRules, t),
    [t, formRules],
  );

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnMount
      validate={validate}
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
              type={conceptType}
              supportedLanguages={supportedLanguages}
            />
            <FormAccordions defaultOpen={['content']}>
              <FormAccordion
                id="content"
                className="u-4/6@desktop u-push-1/6@desktop"
                title={t('form.contentSection')}
                hasError={!!(errors.title || errors.conceptContent)}
              >
                <ConceptContent isGloss={isGloss} />
              </FormAccordion>
              {isGloss && (
                <FormAccordion
                  id="glossData"
                  title={t('form.gloss.gloss')}
                  hasError={
                    !!(
                      errors.gloss ||
                      Object.keys(errors).find((e) => e.includes('examples')) ||
                      errors.transcriptions
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
                  label={t(`form.${concept?.conceptType}.source`)}
                  description={t(`form.${concept?.conceptType}.markdown`)}
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
