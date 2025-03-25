/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldHelperProps, useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { FileListLine } from "@ndla/icons";
import { Button, FieldLabel, FieldRoot, FieldErrorMessage, FieldTextArea } from "@ndla/primitives";
import { HStack } from "@ndla/styled-system/jsx";
import { ImageUploadFormElement } from "./ImageUploadFormElement";
import { FormField } from "../../../components/FormField";
import { FormContent } from "../../../components/FormikForm";
import { AI_ACCESS_SCOPE } from "../../../constants";
import { useSession } from "../../../containers/Session/SessionProvider";
import { useGenerateAltText } from "../../../modules/llm/llmMutations";
import { TitleField } from "../../FormikForm";
import { ImageFormikType } from "../imageTransformers";

interface Props {
  language: string;
}

const ImageContent = ({ language }: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const { values, setStatus } = useFormikContext<ImageFormikType>();
  const generateAlttextMutation = useGenerateAltText();

  const generateAltText = async (helpers: FieldHelperProps<string | undefined>) => {
    if (!values.imageFile) {
      helpers.setError(t("textGeneration.errorImage"));
      return null;
    }

    let image;
    try {
      if (typeof values.imageFile === "string") {
        // We use the timestamp to avoid caching of the `imageFile` url in the browser
        const timestamp = new Date().getTime();

        const result = await fetch(values.filepath || `${values.imageFile}?width=2000&ts=${timestamp}`);
        image = await result.blob();
      } else {
        image = values.imageFile;
      }
    } catch (e) {
      helpers.setError(t("textGeneration.errorImage"));
    }

    if (image) {
      const imageText = await image.text();
      const base64 = imageText.replace("data:image/jpeg;base64,", "") ?? "";
      const res = await generateAlttextMutation.mutateAsync({
        type: "alttext",
        image: {
          base64: base64,
          fileType: image.type,
        },
        max_tokens: 2000,
        language: language,
      });
      helpers.setValue(res, true);
      setStatus({ status: "alttext" });
    }
  };

  return (
    <FormContent>
      <TitleField hideToolbar />
      <ImageUploadFormElement language={language} />
      <FormField name="caption">
        {({ field, meta }) => (
          <FieldRoot invalid={!!meta.error}>
            <FieldLabel>{t("form.image.caption.label")}</FieldLabel>
            <FieldTextArea placeholder={t("form.image.caption.placeholder")} {...field} />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </FieldRoot>
        )}
      </FormField>
      <FormField name="alttext">
        {({ field, meta, helpers }) => (
          <FieldRoot invalid={!!meta.error}>
            <HStack justify="space-between">
              <FieldLabel>{t("form.image.alt.label")}</FieldLabel>
              {!!userPermissions?.includes(AI_ACCESS_SCOPE) && (
                <Button
                  onClick={() => generateAltText(helpers)}
                  size="small"
                  loading={generateAlttextMutation.isPending}
                  disabled={generateAlttextMutation.isPending || !values.imageFile}
                >
                  {t("textGeneration.generate.alttext")}
                  <FileListLine />
                </Button>
              )}
            </HStack>
            <FieldTextArea placeholder={t("form.image.alt.placeholder")} {...field} />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </FieldRoot>
        )}
      </FormField>
    </FormContent>
  );
};

export default ImageContent;
