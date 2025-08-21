/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, FormikHelpers } from "formik";
import { isEmpty } from "lodash-es";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { IConceptDTO, IConceptSummaryDTO, INewConceptDTO, IUpdatedConceptDTO } from "@ndla/types-backend/concept-api";
import GlossDataSection from "./GlossDataSection";
import FormAccordion from "../../../components/Accordion/FormAccordion";
import FormAccordions from "../../../components/Accordion/FormAccordions";
import validateFormik, { RulesType, getWarnings } from "../../../components/formikValidationSchema";
import FormWrapper from "../../../components/FormWrapper";
import { useLicenses } from "../../../modules/draft/draftQueries";
import { conceptFormBaseRules } from "../../ConceptPage/ConceptForm/ConceptForm";
import ConceptFormFooter from "../../ConceptPage/ConceptForm/ConceptFormFooter";
import { ConceptFormHeader } from "../../ConceptPage/ConceptForm/ConceptFormHeader";
import { ConceptFormValues } from "../../ConceptPage/conceptInterfaces";
import {
  conceptApiTypeToFormType,
  getNewConceptType,
  getUpdatedConceptType,
} from "../../ConceptPage/conceptTransformers";
import { TitleField } from "../../FormikForm";
import CopyrightFieldGroup from "../../FormikForm/CopyrightFieldGroup";
import { MessageError, useMessages } from "../../Messages/MessagesProvider";
import { useSession } from "../../Session/SessionProvider";

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
  language: string;
  initialTitle?: string;
  onUpserted?: (concept: IConceptSummaryDTO | IConceptDTO) => void;
  translatedFieldsToNN: string[];
}

const glossRules: RulesType<ConceptFormValues, IConceptDTO> = {
  ...conceptFormBaseRules,
  "gloss.gloss": {
    required: true,
    translationKey: "form.gloss.gloss",
  },
  "gloss.wordClass": {
    required: true,
    translationKey: "form.gloss.wordClass",
  },
  "gloss.originalLanguage": {
    required: true,
    translationKey: "form.gloss.originalLanguage",
  },
  examples: {
    rules: {
      language: {
        required: true,
        translationKey: "form.name.language",
      },
      example: {
        required: true,
        translationKey: "form.gloss.example",
      },
    },
  },
};

export const GlossForm = ({
  concept,
  conceptChanged,
  inDialog,
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
    if (isEmpty(values.title)) return;
    formikHelpers.setSubmitting(true);
    const revision = concept?.revision;
    const status = concept?.status;
    const initialStatus = status?.current;
    const newStatus = values.status?.current;
    const statusChange = initialStatus !== newStatus;

    try {
      let savedConcept: IConceptDTO;
      if ("onCreate" in upsertProps) {
        savedConcept = await upsertProps.onCreate(getNewConceptType(values, licenses, "gloss"));
        savedConcept = newStatus ? await upsertProps.onUpdateStatus(savedConcept.id, newStatus) : savedConcept;
      } else {
        const conceptWithStatus = {
          ...getUpdatedConceptType(values, licenses, "gloss"),
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

  const initialValues = conceptApiTypeToFormType(concept, language, ndlaId, initialTitle, "gloss");

  const initialWarnings = useMemo(
    () => getWarnings(initialValues, glossRules, t, translatedFieldsToNN, concept),
    [concept, initialValues, t, translatedFieldsToNN],
  );
  const initialErrors = useMemo(() => validateFormik(initialValues, glossRules, t), [initialValues, t]);

  const validate = useCallback((values: ConceptFormValues) => validateFormik(values, glossRules, t), [t]);

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
      {(formikProps) => (
        <FormWrapper inDialog={inDialog}>
          <ConceptFormHeader concept={concept} language={language} initialTitle={initialTitle} type="gloss" />
          <FormAccordions defaultOpen={["title", "content"]}>
            <FormAccordion id="title" title={t("form.gloss.titleSection")} hasError={!!formikProps.errors.title}>
              <TitleField />
            </FormAccordion>
            <FormAccordion
              id="content"
              title={t("form.name.content")}
              hasError={
                !!(formikProps.errors.gloss || Object.keys(formikProps.errors).find((e) => e.includes("examples")))
              }
            >
              <GlossDataSection glossLanguage={language} />
            </FormAccordion>
            <FormAccordion
              id="copyright"
              title={t("form.copyrightSection")}
              hasError={!!(formikProps.errors.creators || formikProps.errors.license)}
            >
              <CopyrightFieldGroup enableLicenseNA={true} />
            </FormAccordion>
          </FormAccordions>
          <ConceptFormFooter conceptChanged={!!conceptChanged} inDialog={inDialog} savedToServer={savedToServer} />
        </FormWrapper>
      )}
    </Formik>
  );
};
