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
import { useParams } from "react-router-dom";
import {
  Button,
  FieldErrorMessage,
  FieldLabel,
  FieldRoot,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupRoot,
} from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { ILearningStepV2DTO } from "@ndla/types-backend/learningpath-api";
import { ResourceStepForm } from "./ResourceStepForm";
import { FormField } from "../../../components/FormField";
import { FormActionsContainer } from "../../../components/FormikForm";
import { blockContentToEditorValue, blockContentToHTML } from "../../../util/articleContentConverter";
import { unreachable } from "../../../util/guards";
import { routes } from "../../../util/routeHelpers";
import { getFormTypeFromStep, learningpathStepEditButtonId } from "../learningpathUtils";
import { TextStepForm } from "./TextStepForm";
import { LearningpathStepFormValues } from "./types";
import {
  usePatchLearningStepMutation,
  usePostLearningStepMutation,
} from "../../../modules/learningpath/learningpathMutations";

const RADIO_GROUP_OPTIONS = ["text", "resource", "external", "folder"] as const;

const StyledForm = styled(
  Form,
  {
    base: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "medium",
      padding: "medium",
      border: "1px solid",
      borderColor: "stroke.discrete",
      background: "surface.subtle",
    },
  },
  { baseComponent: true },
);

// export const deserializeToRichText = (html: string) => {
//   const opts = {
//     blocks: [],
//     inlines: [LINK_ELEMENT_TYPE],
//   };
//   const res = deserializeFromHtml(html, cextendedRules, opts);
//   // TODO: Workaround for plain-text content. If the first block is not a section element, it is not created by our RichTextEditor. It is probably plain text imported from stier.
//   return isSectionElement(res[0]) ? res : deserializeFromHtml(`<section>${html}</section>`, serializers, opts);
// };

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
        description: blockContentToEditorValue(step?.description?.description ?? ""),
      };
    case "external":
      return {
        type: type,
        title: step?.title.title ?? "",
        introduction: step?.introduction?.introduction ?? "",
        url: step?.embedUrl?.url ?? "",
        shareable: !!step?.embedUrl?.url,
      };
    case "resource":
    case "folder":
      return {
        type: type,
        title: step?.title.title ?? "",
        embedUrl: step?.embedUrl?.url ?? "",
      };
    default:
      return unreachable(type);
  }
};

interface Props {
  step?: ILearningStepV2DTO;
}

const formValuesToStep = (values: LearningpathStepFormValues) => {
  if (values.type === "text") {
    return {
      type: "TEXT",
      title: values.title,
      introduction: values.introduction,
      description: blockContentToHTML(values.description),
    };
  }

  if (values.type === "external") {
    return {
      type: "TEXT",
      title: values.title,
      introduction: values.introduction,
      embedUrl: {
        url: values.url,
        embedType: "external",
      },
    };
  }

  return {
    type: "TEXT",
    title: values.title,
    embedUrl: {
      url: values.embedUrl,
      embedType: "iframe",
    },
  };
};

export const LearningpathStepForm = ({ step }: Props) => {
  const wrapperRef = useRef<HTMLFormElement>(null);
  const { id, language } = useParams<"id" | "language">();
  const { t } = useTranslation();
  const initialValues = useMemo(() => toFormValues(getFormTypeFromStep(step), step), [step]);
  const postLearningStepMutation = usePostLearningStepMutation();
  const patchLearningStepMutation = usePatchLearningStepMutation();

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
      if (step) {
        const input = formValuesToStep(values);
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
        const step = formValuesToStep(values);
        await postLearningStepMutation.mutateAsync({
          learningpathId: numericId,
          step: {
            ...step,
            language,
            showTitle: false,
          },
        });
      }
    },
    [id, language, patchLearningStepMutation, postLearningStepMutation, step],
  );

  if (!id || !language) return;
  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {(formikProps) => (
        <StyledForm ref={wrapperRef}>
          <FormField name="type">
            {({ field, meta, helpers }) => (
              <FieldRoot required invalid={!!meta.error}>
                <FieldLabel>{t("learningpathForm.steps.typeTitle")}</FieldLabel>
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                <RadioGroupRoot
                  onValueChange={(details) => {
                    formikProps.resetForm({
                      values: toFormValues(details.value as LearningpathStepFormValues["type"]),
                    });
                    helpers.setValue(details.value);
                  }}
                  value={field.value}
                  onBlur={field.onBlur}
                  name={field.name}
                  orientation="vertical"
                >
                  {RADIO_GROUP_OPTIONS.map((val) => (
                    <RadioGroupItem value={val} key={val}>
                      <RadioGroupItemControl />
                      <RadioGroupItemText>{t(`learningpathForm.steps.formTypes.${val}`)}</RadioGroupItemText>
                      <RadioGroupItemHiddenInput />
                    </RadioGroupItem>
                  ))}
                </RadioGroupRoot>
              </FieldRoot>
            )}
          </FormField>
          {formikProps.values.type === "text" ? (
            <TextStepForm language={language} />
          ) : formikProps.values.type === "resource" ? (
            <ResourceStepForm language={language} />
          ) : null}
          <FormActionsContainer>
            <SafeLinkButton
              to={routes.learningpath.edit(parseInt(id), language, "steps")}
              state={{ focusStepId: step ? learningpathStepEditButtonId(step.id) : undefined }}
              variant="secondary"
            >
              {t("cancel")}
            </SafeLinkButton>
            <Button type="submit" disabled={!formikProps.dirty || formikProps.isSubmitting}>
              {t("save")}
            </Button>
          </FormActionsContainer>
        </StyledForm>
      )}
    </Formik>
  );
};
