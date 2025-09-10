/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Form, Formik } from "formik";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { isSectionElement } from "@ndla/editor";
import {
  Button,
  DialogBody,
  DialogFooter,
  FieldErrorMessage,
  FieldHelper,
  FieldLabel,
  FieldRoot,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupRoot,
} from "@ndla/primitives";
import {
  ILearningStepV2DTO,
  INewLearningStepV2DTO,
  IUpdatedLearningStepV2DTO,
} from "@ndla/types-backend/learningpath-api";
import { ExternalStepForm, externalStepRules } from "./ExternalStepForm";
import { ResourceStepForm, resourceStepRules } from "./ResourceStepForm";
import { FormField } from "../../../components/FormField";
import validateFormik, { RulesType } from "../../../components/formikValidationSchema";
import { blockContentToEditorValue, blockContentToHTML } from "../../../util/articleContentConverter";
import { unreachable } from "../../../util/guards";
import { getFormTypeFromStep } from "../learningpathUtils";
import { TextStepForm, textStepRules } from "./TextStepForm";
import { LearningpathStepFormValues } from "./types";
import {
  usePatchLearningStepMutation,
  usePostLearningStepMutation,
} from "../../../modules/learningpath/learningpathMutations";
import { AlertDialogWrapper } from "../../FormikForm";
import { PreventWindowUnload } from "../../FormikForm/PreventWindowUnload";
import PrivateRoute from "../../PrivateRoute/PrivateRoute";

const RADIO_GROUP_OPTIONS = ["text", "resource", "external"] as const;

const learningpathBlockContentToEditorValue = (html: string) => {
  const res = blockContentToEditorValue(html);
  // HACK: Workaround for plain-text content. If the first block is not a section element, it is not created by our RichTextEditor. It is probably plain text imported from stier.
  return isSectionElement(res[0]) ? res : blockContentToEditorValue(`<section>${html}</section>`);
};

const rules = {
  external: externalStepRules,
  text: textStepRules,
  resource: resourceStepRules,
} as const;

export const toFormValues = <T extends LearningpathStepFormValues["type"]>(
  type: T,
  step?: ILearningStepV2DTO,
): LearningpathStepFormValues => {
  switch (type) {
    case "text":
      return {
        type: "text",
        title: step?.title.title ?? "",
        introduction: step?.introduction?.introduction ?? "",
        description: learningpathBlockContentToEditorValue(step?.description?.description ?? ""),
        license: step?.license?.license,
      };
    case "external":
      return {
        type: type,
        title: step?.title.title ?? "",
        introduction: step?.introduction?.introduction ?? "",
        url: step?.embedUrl?.url ?? "",
        shareable: !!step?.embedUrl?.url,
        description: step?.description?.description
          ? learningpathBlockContentToEditorValue(step?.description?.description ?? "")
          : undefined,
        license: step?.license?.license,
      };
    case "resource":
      return {
        type: type,
        title: step?.title.title ?? "",
        embedUrl: step?.embedUrl?.url ?? "",
        description: step?.description?.description
          ? learningpathBlockContentToEditorValue(step.description.description)
          : undefined,
        license: step?.license?.license,
        articleId: step?.articleId,
      };
    default:
      return unreachable(type);
  }
};

interface Props {
  onlyPublishedResources?: boolean;
  step?: ILearningStepV2DTO;
}

const formValuesToStep = (
  values: LearningpathStepFormValues,
): Omit<INewLearningStepV2DTO | IUpdatedLearningStepV2DTO, "language" | "revision"> => {
  const htmlDescription = blockContentToHTML(values.description ?? []);
  const description = htmlDescription === "<section></section>" ? null : htmlDescription;
  if (values.type === "text") {
    return {
      type: "TEXT",
      title: values.title,
      introduction: values.introduction,
      description,
      license: values.license,
      embedUrl: null,
      articleId: null,
    };
  }

  if (values.type === "external") {
    return {
      type: "TEXT",
      title: values.title,
      introduction: values.introduction,
      description: description?.length ? description : null,
      license: values.license,
      articleId: null,
      embedUrl: {
        url: values.url,
        embedType: "external",
      },
    };
  }

  return {
    type: "TEXT",
    title: values.title,
    license: values.license,
    introduction: null,
    description: description?.length ? description : null,
    articleId: values.articleId,
    embedUrl: values.articleId
      ? null
      : {
          url: values.embedUrl,
          embedType: "iframe",
        },
  };
};

export const Component = () => {
  return <PrivateRoute component={<LearningpathStepForm />} />;
};

interface Props {
  onClose?: (focusId?: number) => void;
}

export const LearningpathStepForm = ({ step, onClose, onlyPublishedResources = false }: Props) => {
  const wrapperRef = useRef<HTMLFormElement>(null);
  const { id, language } = useParams<"id" | "language">();
  const { t } = useTranslation();
  const initialValues = useMemo(() => toFormValues(step ? getFormTypeFromStep(step) : "resource", step), [step]);
  const postLearningStepMutation = usePostLearningStepMutation(language ?? "");
  const patchLearningStepMutation = usePatchLearningStepMutation(language ?? "");

  useEffect(() => {
    wrapperRef.current?.parentElement?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, []);

  useEffect(() => {
    if (!step) {
      setTimeout(() => wrapperRef.current?.querySelector("input")?.focus(), 0);
    }
  }, [step]);

  const handleSubmit = useCallback(
    async (values: LearningpathStepFormValues) => {
      const numericId = id ? parseInt(id) : undefined;
      if (!numericId || !language) return;
      let newStep: ILearningStepV2DTO | undefined = undefined;
      const input = formValuesToStep(values);
      if (step) {
        await patchLearningStepMutation.mutateAsync({
          learningpathId: numericId,
          stepId: step.id,
          step: {
            ...input,
            revision: step.revision,
            language,
          },
        });
      } else {
        newStep = await postLearningStepMutation.mutateAsync({
          learningpathId: numericId,
          //@ts-expect-error - Null should not occur when POSTing, but we can't really prove that to TS.
          step: {
            ...input,
            language,
            showTitle: false,
          },
        });
      }
      onClose?.(newStep?.id);
    },
    [id, language, onClose, patchLearningStepMutation, postLearningStepMutation, step],
  );

  if (!id || !language) return;
  return (
    <Formik
      initialValues={initialValues}
      validate={(values) =>
        validateFormik<LearningpathStepFormValues>(
          values,
          rules[values.type] as RulesType<LearningpathStepFormValues>,
          t,
        )
      }
      onSubmit={handleSubmit}
    >
      {(formikProps) => (
        <Form ref={wrapperRef} onSubmit={formikProps.handleSubmit}>
          <PreventWindowUnload preventUnload={formikProps.dirty} />
          <DialogBody>
            {!!step && getFormTypeFromStep(step) !== "resource" && (
              <FormField name="type">
                {({ field, meta }) => (
                  <FieldRoot required invalid={!!meta.error}>
                    <FieldLabel>{t("learningpathForm.steps.typeTitle")}</FieldLabel>
                    <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                    <FieldHelper>{t("learningpathForm.steps.typeDisabledExplanation")}</FieldHelper>
                    <RadioGroupRoot
                      onValueChange={(details) => {
                        formikProps.resetForm({
                          values: toFormValues(details.value as LearningpathStepFormValues["type"]),
                        });
                      }}
                      value={field.value}
                      onBlur={field.onBlur}
                      name={field.name}
                      orientation="vertical"
                    >
                      {RADIO_GROUP_OPTIONS.map((val) => (
                        <RadioGroupItem value={val} key={val} disabled={val !== "resource"}>
                          <RadioGroupItemControl />
                          <RadioGroupItemText>{t(`learningpathForm.steps.formTypes.${val}`)}</RadioGroupItemText>
                          <RadioGroupItemHiddenInput />
                        </RadioGroupItem>
                      ))}
                    </RadioGroupRoot>
                  </FieldRoot>
                )}
              </FormField>
            )}
            {formikProps.values.type === "text" ? (
              <TextStepForm step={step} language={language} />
            ) : formikProps.values.type === "resource" ? (
              <ResourceStepForm onlyPublishedResources={onlyPublishedResources} step={step} language={language} />
            ) : formikProps.values.type === "external" ? (
              <ExternalStepForm step={step} language={language} />
            ) : null}
          </DialogBody>
          <DialogFooter>
            <Button onClick={() => onClose?.()} variant="secondary">
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={!formikProps.dirty || formikProps.isSubmitting}>
              {step ? t("save") : t("taxonomy.add")}
            </Button>
          </DialogFooter>
          <AlertDialogWrapper
            isSubmitting={formikProps.isSubmitting}
            formIsDirty={formikProps.dirty}
            severity="danger"
            text={t("alertDialog.notSaved")}
          />
        </Form>
      )}
    </Formik>
  );
};
