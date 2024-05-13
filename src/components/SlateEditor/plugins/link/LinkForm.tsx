/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, Form, FormikHelpers } from "formik";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors, spacing } from "@ndla/core";
import { CheckboxItem, FieldErrorMessage, FieldHelper, InputV3, Label } from "@ndla/forms";
import { isNDLAArticleUrl, isNDLAEdPathUrl, isNDLALearningPathUrl, isNDLATaxonomyUrl, isPlainId } from "./EditLink";
import { Model } from "./Link";
import config from "../../../../config";
import { CheckboxWrapper } from "../../../Form/styles";
import { FormControl, FormField } from "../../../FormField";
import validateFormik from "../../../formikValidationSchema";
import { isUrl } from "../../../validators";

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const StyledField = styled.div`
  gap: ${spacing.xsmall};
  display: flex;
  justify-content: flex-end;
`;

const linkValidationRules = {
  text: { required: true },
  href: { required: true, urlOrNumber: true },
};

const StyledInput = styled(InputV3)`
  &[data-type="external"] {
    background-color: ${colors.tasksAndActivities.background};
  }
  &[data-type="internal"] {
    background-color: ${colors.brand.light};
  }
`;

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
  } else return "";
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
      <StyledForm data-testid="link_form">
        <FormField name="text">
          {({ field, meta }) => (
            <FormControl isRequired isInvalid={!!meta.error}>
              <Label textStyle="label-small" margin="none">
                {t("form.content.link.text")}
              </Label>
              <InputV3
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                {...field}
              />
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            </FormControl>
          )}
        </FormField>
        <FormField name="href">
          {({ field, meta }) => (
            <FormControl isRequired isInvalid={!!meta.error}>
              <Label textStyle="label-small" margin="none">
                {t("form.content.link.href")}
              </Label>
              <FieldHelper margin="none">
                {t("form.content.link.description", {
                  url: config.ndlaFrontendDomain,
                  interpolation: { escapeValue: false },
                })}
              </FieldHelper>
              <StyledInput data-type={getLinkType(field.value)} {...field} />
              <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            </FormControl>
          )}
        </FormField>
        <FormField name="checkbox">
          {({ field, meta, helpers }) => (
            <FormControl isInvalid={!!meta.error}>
              <CheckboxWrapper>
                <CheckboxItem checked={field.value} onCheckedChange={helpers.setValue} />
                <Label margin="none" textStyle="label-small">
                  {t("form.content.link.newTab")}
                </Label>
              </CheckboxWrapper>
            </FormControl>
          )}
        </FormField>
        <StyledField>
          {isEdit ? <ButtonV2 onClick={onRemove}>{t("form.content.link.remove")}</ButtonV2> : ""}
          <ButtonV2 variant="outline" onClick={onClose}>
            {t("form.abort")}
          </ButtonV2>
          <ButtonV2 type="submit">{isEdit ? t("form.content.link.update") : t("form.content.link.insert")}</ButtonV2>
        </StyledField>
      </StyledForm>
    </Formik>
  );
};

export default LinkForm;
