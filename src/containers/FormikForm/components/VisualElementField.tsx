/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ErrorMessage, useField } from "formik";
import { useTranslation } from "react-i18next";
import { InformationOutline } from "@ndla/icons/common";
import {
  DialogTrigger,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  IconButton,
  Text,
  FieldRoot,
  FieldErrorMessage,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { FormField } from "../../../components/FormField";
import { FormikFieldHelp } from "../../../components/FormikField";
import VisualElement from "../../VisualElement/VisualElement";
import { VisualElementType } from "../../VisualElement/VisualElementMenu";

const StyledErrorPreLine = styled("span", {
  base: {
    whiteSpace: "pre-line",
  },
});

const UploadVisualElementText = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
  },
});

const extraErrorFields = ["visualElementCaption", "visualElementAlt"];

interface Props {
  types: VisualElementType[];
}
const VisualElementField = ({ types }: Props) => {
  const { t } = useTranslation();
  const [languageField] = useField<string>("language");

  return (
    <>
      <UploadVisualElementText>
        <Text textStyle="title.medium">{t("form.visualElement.title")}</Text>
        <DialogRoot>
          <DialogTrigger asChild>
            <IconButton
              size="small"
              variant="tertiary"
              aria-label={t("form.visualElement.helpLabel")}
              title={t("form.visualElement.helpLabel")}
            >
              <InformationOutline />
            </IconButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("form.visualElement.title")}</DialogTitle>
              <DialogCloseButton />
            </DialogHeader>
            <DialogBody>
              <Text>{t("form.visualElement.description")}</Text>
            </DialogBody>
          </DialogContent>
        </DialogRoot>
      </UploadVisualElementText>
      <FormField name="visualElement">
        {({ field, meta, helpers }) => (
          <FieldRoot invalid={!!meta.error}>
            <VisualElement
              language={languageField.value}
              types={types}
              selectedResource={field.value}
              resetSelectedResource={() => helpers.setValue([])}
              {...field}
            />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </FieldRoot>
        )}
      </FormField>
      {extraErrorFields.map((extraErrorField) => (
        <ErrorMessage key={`topic_article_visualelement_${extraErrorField}`} name={extraErrorField}>
          {(error) => (
            <FormikFieldHelp error>
              <StyledErrorPreLine>{error}</StyledErrorPreLine>
            </FormikFieldHelp>
          )}
        </ErrorMessage>
      ))}
    </>
  );
};

export default VisualElementField;
