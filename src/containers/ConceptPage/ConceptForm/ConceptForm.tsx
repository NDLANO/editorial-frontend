/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, useMemo } from 'react';
import { Accordions, AccordionSection } from '@ndla/accordion';
import {
  IConcept,
  INewConcept,
  IUpdatedConcept,
  ITagsSearchResult,
  IConceptSummary,
} from '@ndla/types-concept-api';
import { IArticle } from '@ndla/types-draft-api';
import { Formik, FormikProps, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import { toEditConcept } from '../../../util/routeHelpers';
import { ARCHIVED, PUBLISHED, UNPUBLISHED } from '../../../constants';
import HeaderWithLanguage from '../../../components/HeaderWithLanguage';
import validateFormik, { getWarnings, RulesType } from '../../../components/formikValidationSchema';
import {
  conceptApiTypeToFormType,
  conceptFormTypeToApiType,
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
    test: values => {
      const authors = values.creators.concat(values.rightsholders).concat(values.processors);
      if (!values.license || values.license === 'N/A' || authors.length > 0) return undefined;
      return { translationKey: 'validation.noLicenseWithoutCopyrightHolder' };
    },
  },
  responsibleId: {
    required: true,
    onlyValidateIf: (values: ConceptFormValues) =>
      STATUSES_RESPONSIBLE_NOT_REQUIRED.every(status => values.status?.current !== status),
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
        savedConcept = await upsertProps.onCreate(getNewConceptType(values, licenses));
      } else {
        const conceptWithStatus = {
          ...getUpdatedConceptType(values, licenses),
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
      validate={values => validateFormik(values, conceptFormRules, t)}
      initialStatus={{ warnings: initialWarnings }}>
      {formikProps => {
        const { values, errors }: FormikProps<ConceptFormValues> = formikProps;
        const { id, revision, status, created, updated } = values;
        const requirements = id && revision && status && created && updated;
        const getEntity = requirements
          ? () => conceptFormTypeToApiType(values, licenses, concept?.updatedBy)
          : undefined;
        const editUrl = values.id ? (lang: string) => toEditConcept(values.id!, lang) : undefined;
        return (
          <FormWrapper inModal={inModal}>
            <HeaderWithLanguage
              concept={concept}
              content={{ ...concept, title: concept?.title?.title, language }}
              editUrl={editUrl}
              getEntity={getEntity}
              type="concept"
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
                <ConceptCopyright
                  disableAgreements
                  label={t('form.concept.source')}
                  description={t('form.concept.markdown')}
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
                  language={language}
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
              getApiConcept={getEntity}
              responsibleId={concept?.responsible?.responsibleId}
            />
          </FormWrapper>
        );
      }}
    </Formik>
  );
};

export default ConceptForm;
