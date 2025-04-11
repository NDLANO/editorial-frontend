/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { useTranslation } from "react-i18next";
import { InformationLine } from "@ndla/icons";
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
import VisualElement from "../../VisualElement/VisualElement";
import { VisualElementType } from "../../VisualElement/VisualElementMenu";

const UploadVisualElementText = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
  },
});

interface Props {
  types: VisualElementType[];
  inDialog?: boolean;
}
const VisualElementField = ({ types, inDialog = false }: Props) => {
  const { t } = useTranslation();
  const [languageField] = useField<string>("language");
  const [, visualElementCaptionMeta] = useField("visualElementCaption");
  const [, visualElementAltMeta] = useField("visualElementAlt");

  return (
    <div>
      {!inDialog && (
        <UploadVisualElementText>
          <Text textStyle="label.medium" fontWeight="bold">
            {t("form.visualElement.title")}
          </Text>
          <DialogRoot>
            <DialogTrigger asChild>
              <IconButton
                size="small"
                variant="tertiary"
                aria-label={t("form.visualElement.helpLabel")}
                title={t("form.visualElement.helpLabel")}
              >
                <InformationLine />
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
      )}
      <FormField name="visualElement">
        {({ field, meta, helpers }) => (
          <FieldRoot invalid={!!meta.error || !!visualElementCaptionMeta.error || !!visualElementAltMeta.error}>
            <VisualElement
              language={languageField.value}
              types={types}
              selectedResource={field.value}
              resetSelectedResource={() => helpers.setValue([])}
              {...field}
            />
            <FieldErrorMessage asChild consumeCss>
              <div>
                <p>{meta.error}</p>
                <p>{visualElementCaptionMeta.error}</p>
                <p>{visualElementAltMeta.error}</p>
              </div>
            </FieldErrorMessage>
          </FieldRoot>
        )}
      </FormField>
    </div>
  );
};

export default VisualElementField;
