/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FileListLine } from "@ndla/icons";
import { Button, FieldLabel, FieldRoot, FieldErrorMessage, FieldTextArea, DialogTrigger } from "@ndla/primitives";
import { HStack } from "@ndla/styled-system/jsx";
import { ImageUploadFormElement } from "./ImageUploadFormElement";
import { AiPromptDialog } from "../../../components/AiPromptDialog";
import { FormField } from "../../../components/FormField";
import { FormContent } from "../../../components/FormikForm";
import { AI_ACCESS_SCOPE } from "../../../constants";
import { useSession } from "../../../containers/Session/SessionProvider";
import { AltTextVariables } from "../../../modules/llm/llmApiTypes";
import { TitleField } from "../../FormikForm";
import { ImageFormikType } from "../imageTransformers";

const ALLOWED_IMAGE_TYPES = "(jpe?g|png|gif)";
const IMAGE_TYPE_REGEX = new RegExp(ALLOWED_IMAGE_TYPES);
const IMAGE_IDENTIFIER_REGEX = new RegExp(`data:image/${ALLOWED_IMAGE_TYPES};base64,`);
interface Props {
  language: string;
}

const ImageContent = ({ language }: Props) => {
  const { t } = useTranslation();
  const { userPermissions } = useSession();
  const { values } = useFormikContext<ImageFormikType>();
  const [image, setImage] = useState<AltTextVariables["image"] | undefined>(undefined);
  const [altTextField, altTextMeta, altTextHelpers] = useField("alttext");

  useEffect(() => {
    const getImagePromptVariables = async () => {
      if (!values.imageFile) return;

      let imageBlob;
      try {
        if (typeof values.imageFile === "string") {
          // We use the timestamp to avoid caching of the `imageFile` url in the browser
          const timestamp = new Date().getTime();
          const result = await fetch(values.filepath || `${values.imageFile}?width=1500&ts=${timestamp}`);
          imageBlob = await result.blob();
        } else {
          imageBlob = values.imageFile;
        }
      } catch (e) {
        altTextHelpers.setError(t("textGeneration.errorImage"));
        return;
      }

      if (imageBlob) {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(imageBlob);
        fileReader.onloadend = () => {
          const imageText = fileReader.result?.toString() ?? "";
          // All images from the filereader is appended with a data identifier string. https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
          const base64 = imageText.replace(IMAGE_IDENTIFIER_REGEX, "");
          setImage({ base64, fileType: imageBlob.type });
        };
      }
    };
    getImagePromptVariables();
  }, [values.imageFile, values.filepath, altTextHelpers, t]);

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
      <FieldRoot invalid={!!altTextMeta.error}>
        <HStack justify="space-between">
          <FieldLabel>{t("form.image.alt.label")}</FieldLabel>
          {userPermissions?.includes(AI_ACCESS_SCOPE) && !!values.contentType?.match(IMAGE_TYPE_REGEX) && !!image ? (
            <AiPromptDialog
              promptVariables={{
                type: "altText",
                image,
              }}
              language={language}
              maxTokens={2000}
              onInsert={(text) => altTextHelpers.setValue(text)}
            >
              <DialogTrigger asChild>
                <Button size="small" disabled={!values.imageFile}>
                  {t("textGeneration.generateButton", { type: "altText" })}
                  <FileListLine />
                </Button>
              </DialogTrigger>
            </AiPromptDialog>
          ) : null}
        </HStack>
        {/*  TODO: FieldTextArea does not resize when setting generated alttext */}
        <FieldTextArea placeholder={t("form.image.alt.placeholder")} {...altTextField} />
        <FieldErrorMessage>{altTextMeta.error}</FieldErrorMessage>
      </FieldRoot>
    </FormContent>
  );
};

export default ImageContent;
