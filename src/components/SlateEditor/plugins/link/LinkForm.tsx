/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, FormikHelpers } from "formik";
import { useTranslation } from "react-i18next";
import { CheckLine } from "@ndla/icons/editor";
import {
  Button,
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  FieldErrorMessage,
  FieldHelper,
  FieldInput,
  FieldLabel,
  FieldRoot,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { isNDLAArticleUrl, isNDLAEdPathUrl, isNDLALearningPathUrl, isNDLATaxonomyUrl, isPlainId } from "./EditLink";
import { Model } from "./Link";
import config from "../../../../config";
import { FormField } from "../../../FormField";
import { FormActionsContainer, FormikForm } from "../../../FormikForm";
import validateFormik from "../../../formikValidationSchema";
import { isUrl } from "../../../validators";

const linkValidationRules = {
  text: { required: true },
  href: { required: true, urlOrNumber: true },
};

const StyledInput = styled(FieldInput, {
  variants: {
    variant: {
      external: {
        background: "surface.brand.2.subtle",
      },
      internal: {
        background: "surface.brand.1.subtle",
      },
    },
  },
});

const StyledCheckboxRoot = styled(CheckboxRoot, {
  base: {
    width: "fit-content",
  },
});

export const getInitialValues = (link: Partial<Model> = {}): Model => ({
  text: link.text || "",
  href: link.href || "",
  checkbox: link.checkbox || false,
});

interface Props {
  onSave: (model: Model) => void;
  link: Partial<Model>;
  isEdit: boolean;
  onRemove: () => void;
  onClose: () => void;
}

const getLinkType = (href: string) => {
  if (
    isNDLAArticleUrl(href) ||
    isNDLAEdPathUrl(href) ||
    isNDLALearningPathUrl(href) ||
    isNDLATaxonomyUrl(href) ||
    isPlainId(href)
  ) {
    return "internal";
  } else if (isUrl(href)) {
    return "external";
  } else return undefined;
};

const LinkForm = ({ onSave, link, isEdit, onRemove, onClose }: Props) => {
  const { t } = useTranslation();

  const handleSave = async (values: Model, actions: FormikHelpers<Model>) => {
    actions.setSubmitting(true);
    onSave(values);
    actions.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={getInitialValues(link)}
      onSubmit={handleSave}
      validate={(values) => validateFormik(values, linkValidationRules, t, "linkForm")}
    >
      <FormikForm data-testid="link_form">
        <FormField name="text">
          {({ field, meta }) => (
            <FieldRoot required invalid={!!meta.error}>
              <FieldLabel>{t("form.content.link.text")}</FieldLabel>
              <FieldInput
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                {...field}
              />
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            </FieldRoot>
          )}
        </FormField>
        <FormField name="href">
          {({ field, meta }) => (
            <FieldRoot required invalid={!!meta.error}>
              <FieldLabel>{t("form.content.link.href")}</FieldLabel>
              <FieldHelper>
                {t("form.content.link.description", {
                  url: config.ndlaFrontendDomain,
                  interpolation: { escapeValue: false },
                })}
              </FieldHelper>
              <StyledInput variant={getLinkType(field.value)} {...field} />
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            </FieldRoot>
          )}
        </FormField>
        <FormField name="checkbox">
          {({ field, meta, helpers }) => (
            <FieldRoot invalid={!!meta.error}>
              <StyledCheckboxRoot
                checked={field.value}
                onCheckedChange={(details) => helpers.setValue(details.checked)}
              >
                <CheckboxControl>
                  <CheckboxIndicator asChild>
                    <CheckLine />
                  </CheckboxIndicator>
                </CheckboxControl>
                <CheckboxLabel>{t("form.content.link.newTab")}</CheckboxLabel>
                <CheckboxHiddenInput />
              </StyledCheckboxRoot>
            </FieldRoot>
          )}
        </FormField>
        <FormActionsContainer>
          {isEdit ? (
            <Button variant="danger" onClick={onRemove}>
              {t("form.content.link.remove")}
            </Button>
          ) : (
            ""
          )}
          <Button variant="secondary" onClick={onClose}>
            {t("form.abort")}
          </Button>
          <Button type="submit">{isEdit ? t("form.content.link.update") : t("form.content.link.insert")}</Button>
        </FormActionsContainer>
      </FormikForm>
    </Formik>
  );
};

export default LinkForm;
