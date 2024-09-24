/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Form, Formik } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { CheckboxItem, FieldErrorMessage, InputV3, Label } from "@ndla/forms";
import { Button } from "@ndla/primitives";
import { KeyFigureEmbedData } from "@ndla/types-embed";
import { Text } from "@ndla/typography";
import { TYPE_KEY_FIGURE } from "./types";
import InlineImageSearch from "../../../../containers/ConceptPage/components/InlineImageSearch";
import { InlineField } from "../../../../containers/FormikForm/InlineField";
import { inlineContentToEditorValue, inlineContentToHTML } from "../../../../util/articleContentConverter";
import { isFormikFormDirty } from "../../../../util/formHelper";
import { CheckboxWrapper } from "../../../Form/styles";
import { FormControl, FormField } from "../../../FormField";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import { RichTextIndicator } from "../../RichTextIndicator";

interface Props {
  onSave: (data: KeyFigureEmbedData) => void;
  initialData: KeyFigureEmbedData;
  onCancel: () => void;
}

interface KeyFigureFormValue {
  resource: "key-figure";
  metaImageId: string | undefined;
  title: Descendant[];
  subtitle: Descendant[];
  metaImageAlt?: string;
  isDecorative?: boolean;
}

const toInitialValues = (initialData: KeyFigureEmbedData): KeyFigureFormValue => ({
  resource: TYPE_KEY_FIGURE,
  metaImageId: initialData?.imageId,
  title: inlineContentToEditorValue(initialData?.title ?? "", true),
  subtitle: inlineContentToEditorValue(initialData?.subtitle, true),
  metaImageAlt: initialData?.alt ?? "",
  isDecorative: initialData ? initialData.alt === undefined : false,
});

const rules: RulesType<KeyFigureFormValue> = {
  title: {
    required: true,
  },
  subtitle: {
    required: true,
  },
  metaImageId: {
    required: false,
  },
  metaImageAlt: {
    required: true,
    onlyValidateIf: (value) => !!value.metaImageId && !value.isDecorative,
  },
};

const ButtonContainer = styled.div`
  margin-top: ${spacing.small};
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  margin-top: ${spacing.small};
`;

const KeyFigureForm = ({ onSave, initialData, onCancel }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(initialData), [initialData]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);

  const onSubmit = useCallback(
    (values: KeyFigureFormValue) => {
      const newData: KeyFigureEmbedData = {
        resource: TYPE_KEY_FIGURE,
        imageId: values.metaImageId,
        title: inlineContentToHTML(values.title),
        subtitle: inlineContentToHTML(values.subtitle),
        alt: values.isDecorative ? undefined : values.metaImageAlt,
      };
      onSave(newData);
    },
    [onSave],
  );
  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      onSubmit={onSubmit}
      validateOnMount
      validate={(values) => validateFormik(values, rules, t)}
    >
      {({ dirty, isValid, values, isSubmitting }) => (
        <StyledForm>
          <div>
            <Text textStyle="label-small" margin="none">
              {t("form.name.title")}
              <RichTextIndicator />
            </Text>
            <FormField name="title">
              {({ field, helpers, meta }) => (
                <FormControl isInvalid={!!meta.error}>
                  <InlineField
                    {...field}
                    placeholder={t("form.name.title")}
                    submitted={isSubmitting}
                    onChange={helpers.setValue}
                  />
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                </FormControl>
              )}
            </FormField>
          </div>
          <div>
            <Text textStyle="label-small" margin="none">
              {t("form.name.subtitle")}
              <RichTextIndicator />
            </Text>
            <FormField name="subtitle">
              {({ field, helpers, meta }) => (
                <FormControl isInvalid={!!meta.error}>
                  <InlineField
                    {...field}
                    placeholder={t("form.name.subtitle")}
                    submitted={isSubmitting}
                    onChange={helpers.setValue}
                  />
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                </FormControl>
              )}
            </FormField>
          </div>
          <InlineImageSearch name="metaImageId" disableAltEditing hideAltText />
          {!values.isDecorative && !!values.metaImageId && (
            <FormField name="metaImageAlt">
              {({ field, meta }) => (
                <FormControl isInvalid={!!meta.error}>
                  <Label margin="none" textStyle="label-small">
                    {t("form.name.metaImageAlt")}
                  </Label>
                  <InputV3 {...field} />
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                </FormControl>
              )}
            </FormField>
          )}
          {!!values.metaImageId && (
            <FormField name="isDecorative">
              {({ field, helpers, meta }) => (
                <FormControl isInvalid={!!meta.error}>
                  <CheckboxWrapper>
                    <CheckboxItem checked={field.value} onCheckedChange={helpers.setValue} />
                    <Label margin="none" textStyle="label-small">
                      {t("form.image.isDecorative")}
                    </Label>
                  </CheckboxWrapper>
                </FormControl>
              )}
            </FormField>
          )}
          <ButtonContainer>
            <Button variant="secondary" onClick={onCancel}>
              {t("cancel")}
            </Button>
            <Button disabled={!isFormikFormDirty({ values, initialValues, dirty }) || !isValid} type="submit">
              {t("save")}
            </Button>
          </ButtonContainer>
        </StyledForm>
      )}
    </Formik>
  );
};

export default KeyFigureForm;
