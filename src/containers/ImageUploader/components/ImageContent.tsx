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
import { AltTextVariables } from "../../../modules/llm/llmApiTypes";
import { useGenerateAIMutation } from "../../../modules/llm/llmMutations";
import { TitleField } from "../../FormikForm";
import { useMessages } from "../../Messages/MessagesProvider";
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
  const { createMessage } = useMessages();
  const generateAltTextMutation = useGenerateAIMutation<AltTextVariables>();

  const generateAltText = async (helpers: FieldHelperProps<string | undefined>) => {
    if (!values.imageFile) {
      helpers.setError(t("textGeneration.errorImage"));
      return;
    }

    let image;
    try {
      if (typeof values.imageFile === "string") {
        // We use the timestamp to avoid caching of the `imageFile` url in the browser
        const timestamp = new Date().getTime();
        const result = await fetch(values.filepath || `${values.imageFile}?width=1500&ts=${timestamp}`);
        image = await result.blob();
      } else {
        image = values.imageFile;
      }
    } catch (e) {
      helpers.setError(t("textGeneration.errorImage"));
      return;
    }

    if (image) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(image);
      fileReader.onloadend = async () => {
        const imageText = fileReader.result?.toString() ?? "";
        // All images from the filereader is appended with a data identifier string. https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
        const base64 = imageText.replace(IMAGE_IDENTIFIER_REGEX, "");
        await generateAltTextMutation
          .mutateAsync({
            type: "alttext",
            image: {
              base64: base64,
              fileType: image.type,
            },
            max_tokens: 2000,
            language: language,
          })
          .then((res) => helpers.setValue(res, true))
          .catch((err) =>
            createMessage({
              message: t("textGeneration.failed.alttext", { error: err.messages }),
              severity: "danger",
              timeToLive: 0,
            }),
          );
      };
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
              {userPermissions?.includes(AI_ACCESS_SCOPE) && !!values.contentType?.match(IMAGE_TYPE_REGEX) ? (
                <Button
                  onClick={() => generateAltText(helpers)}
                  size="small"
                  loading={generateAltTextMutation.isPending}
                  disabled={!values.imageFile}
                >
                  {t("textGeneration.generate.alttext")}
                  <FileListLine />
                </Button>
              ) : null}
            </HStack>
            {/*  TODO: FieldTextArea does not resize when setting generated alttext */}
            <FieldTextArea placeholder={t("form.image.alt.placeholder")} {...field} />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </FieldRoot>
        )}
      </FormField>
    </FormContent>
  );
};

export default ImageContent;
