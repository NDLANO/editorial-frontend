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
} from '@ndla/types-backend/concept-api';
import { IArticle } from '@ndla/types-backend/draft-api';
import { Formik, FormikProps, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
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
}

const conceptFormRules: RulesType<ConceptFormValues, IConcept> = {
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
  subjects: {
    minItems: 1,
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
        savedConcept = await upsertProps.onCreate(getNewConceptType(values, licenses, 'concept'));
      } else {
        const conceptWithStatus = {
          ...getUpdatedConceptType(values, licenses, 'concept'),
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
  const initialWarnings = getWarnings(initialValues, conceptFormRules, t, concept);
  const initialErrors = useMemo(
    () => validateFormik(initialValues, conceptFormRules, t),
    [initialValues, t],
  );

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnMount
      validate={(values) => validateFormik(values, conceptFormRules, t)}
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
              type="concept"
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
