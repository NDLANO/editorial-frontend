/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, FormikProps, FormikHelpers } from "formik";
import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { PageContent } from "@ndla/primitives";
import { IConceptDTO, INewConceptDTO, IUpdatedConceptDTO, IConceptSummaryDTO } from "@ndla/types-backend/concept-api";
import ConceptFormFooter from "./ConceptFormFooter";
import FormAccordion from "../../../components/Accordion/FormAccordion";
import FormAccordions from "../../../components/Accordion/FormAccordions";
import validateFormik, { getWarnings, RulesType } from "../../../components/formikValidationSchema";
import FormWrapper from "../../../components/FormWrapper";
import { isEmpty } from "../../../components/validators";
import { ARCHIVED, PUBLISHED, UNPUBLISHED } from "../../../constants";
import { useLicenses } from "../../../modules/draft/draftQueries";
import CopyrightFieldGroup from "../../FormikForm/CopyrightFieldGroup";
import SimpleVersionPanel from "../../FormikForm/SimpleVersionPanel";
import { MessageError, useMessages } from "../../Messages/MessagesProvider";
import { useSession } from "../../Session/SessionProvider";
import { ConceptContent, ConceptMetaData } from "../components";
import { ConceptFormValues } from "../conceptInterfaces";
import { conceptApiTypeToFormType, getNewConceptType, getUpdatedConceptType } from "../conceptTransformers";
import { ConceptFormHeader } from "./ConceptFormHeader";

const STATUSES_RESPONSIBLE_NOT_REQUIRED = [PUBLISHED, ARCHIVED, UNPUBLISHED];

interface UpdateProps {
  onUpdate: (updatedConcept: IUpdatedConceptDTO, revision?: number) => Promise<IConceptDTO>;
}

interface CreateProps {
  onCreate: (newConcept: INewConceptDTO) => Promise<IConceptDTO>;
  onUpdateStatus: (id: number, status: string) => Promise<IConceptDTO>;
}

interface Props {
  upsertProps: CreateProps | UpdateProps;
  concept?: IConceptDTO;
  conceptChanged?: boolean;
  inDialog: boolean;
  isNewlyCreated?: boolean;
  language: string;
  initialTitle?: string;
  onUpserted?: (concept: IConceptSummaryDTO | IConceptDTO) => void;
  translatedFieldsToNN: string[];
}

export const conceptFormBaseRules: RulesType<ConceptFormValues, IConceptDTO> = {
  title: {
    required: true,
    warnings: {
      languageMatch: true,
    },
  },
  creators: {
    allObjectFieldsRequired: true,
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
      if (!values.license || values.license === "N/A" || authors.length > 0) return undefined;
      return { translationKey: "validation.noLicenseWithoutCopyrightHolder" };
    },
  },
  responsibleId: {
    required: true,
    onlyValidateIf: (values: ConceptFormValues) =>
      STATUSES_RESPONSIBLE_NOT_REQUIRED.every((status) => values.status?.current !== status),
  },
};

const conceptRules: RulesType<ConceptFormValues, IConceptDTO> = {
  ...conceptFormBaseRules,
  conceptContent: {
    required: true,
    warnings: {
      apiField: "content",
      languageMatch: true,
    },
  },
};

const ConceptForm = ({
  concept,
  conceptChanged,
  inDialog,
  isNewlyCreated = false,
  language,
  upsertProps,
  initialTitle,
  onUpserted,
  translatedFieldsToNN,
}: Props) => {
  const [savedToServer, setSavedToServer] = useState(false);
  const { t } = useTranslation();
  const { applicationError } = useMessages();
  const { data: licenses = [] } = useLicenses({ placeholderData: [] });
  const { ndlaId } = useSession();

  const handleSubmit = async (values: ConceptFormValues, formikHelpers: FormikHelpers<ConceptFormValues>) => {
    if (isEmpty(values.conceptContent) || isEmpty(values.title)) return;
    formikHelpers.setSubmitting(true);
    const revision = concept?.revision;
    const status = concept?.status;
    const initialStatus = status?.current;
    const newStatus = values.status?.current;
    const statusChange = initialStatus !== newStatus;

    try {
      let savedConcept: IConceptDTO;
      if ("onCreate" in upsertProps) {
        savedConcept = await upsertProps.onCreate(getNewConceptType(values, licenses, "concept"));
        savedConcept = newStatus ? await upsertProps.onUpdateStatus(savedConcept.id, newStatus) : savedConcept;
      } else {
        const conceptWithStatus = {
          ...getUpdatedConceptType(values, licenses, "concept"),
          ...(statusChange ? { status: newStatus } : {}),
        };
        savedConcept = await upsertProps.onUpdate(conceptWithStatus, revision!);
      }
      formikHelpers.resetForm({
        values: conceptApiTypeToFormType(savedConcept, language, ndlaId),
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

  const initialValues = conceptApiTypeToFormType(concept, language, ndlaId, initialTitle, "concept");

  const initialWarnings = useMemo(
    () => getWarnings(initialValues, conceptRules, t, translatedFieldsToNN, concept),
    [concept, initialValues, t, translatedFieldsToNN],
  );
  const initialErrors = useMemo(() => validateFormik(initialValues, conceptRules, t), [initialValues, t]);

  const validate = useCallback((values: ConceptFormValues) => validateFormik(values, conceptRules, t), [t]);

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
          <FormWrapper inDialog={inDialog}>
            <ConceptFormHeader concept={concept} language={language} initialTitle={initialTitle} type="concept" />
            <FormAccordions defaultOpen={["content"]}>
              <FormAccordion
                id="content"
                title={t("form.contentSection")}
                hasError={!!(errors.title || errors.conceptContent)}
              >
                <PageContent variant="content">
                  <ConceptContent inDialog={inDialog} />
                </PageContent>
              </FormAccordion>
              <FormAccordion
                id="copyright"
                title={t("form.copyrightSection")}
                hasError={!!(errors.creators || errors.license)}
              >
                <CopyrightFieldGroup enableLicenseNA={true} />
              </FormAccordion>
              {!inDialog && (
                <FormAccordion id="metadata" title={t("form.metadataSection")} hasError={!!errors.tags}>
                  <ConceptMetaData />
                </FormAccordion>
              )}
              {!!concept?.id && (
                <FormAccordion id="versionNotes" title={t("form.workflowSection")} hasError={false}>
                  <SimpleVersionPanel editorNotes={concept?.editorNotes} />
                </FormAccordion>
              )}
            </FormAccordions>
            <ConceptFormFooter
              entityStatus={concept?.status}
              conceptChanged={!!conceptChanged}
              inDialog={inDialog}
              savedToServer={savedToServer}
              isNewlyCreated={isNewlyCreated}
              showSimpleFooter={!concept?.id}
            />
          </FormWrapper>
        );
      }}
    </Formik>
  );
};

export default ConceptForm;
