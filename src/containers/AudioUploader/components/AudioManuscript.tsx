/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { connect, useFormikContext } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, FieldErrorMessage, FieldRoot, Spinner } from "@ndla/primitives";
import { FileListLine } from "@ndla/icons";
import { AudioFormikType } from "./AudioForm";
import { ContentEditableFieldLabel } from "../../../components/Form/ContentEditableFieldLabel";
import { FieldWarning } from "../../../components/Form/FieldWarning";
import { FormField } from "../../../components/FormField";
import { SlatePlugin } from "../../../components/SlateEditor/interfaces";
import { breakPlugin } from "../../../components/SlateEditor/plugins/break";
import { breakRenderer } from "../../../components/SlateEditor/plugins/break/render";
import { markPlugin } from "../../../components/SlateEditor/plugins/mark";
import { markRenderer } from "../../../components/SlateEditor/plugins/mark/render";
import { noopPlugin } from "../../../components/SlateEditor/plugins/noop";
import { noopRenderer } from "../../../components/SlateEditor/plugins/noop/render";
import { paragraphPlugin } from "../../../components/SlateEditor/plugins/paragraph";
import { paragraphRenderer } from "../../../components/SlateEditor/plugins/paragraph/render";
import saveHotkeyPlugin from "../../../components/SlateEditor/plugins/saveHotkey";
import { spanPlugin } from "../../../components/SlateEditor/plugins/span";
import { spanRenderer } from "../../../components/SlateEditor/plugins/span/render";
import { textTransformPlugin } from "../../../components/SlateEditor/plugins/textTransform";
import { toolbarPlugin } from "../../../components/SlateEditor/plugins/toolbar";
import {
  createToolbarAreaOptions,
  createToolbarDefaultValues,
} from "../../../components/SlateEditor/plugins/toolbar/toolbarState";
import RichTextEditor from "../../../components/SlateEditor/RichTextEditor";
import { getTranscription, transcribe } from "../../../components/Transcribe/helpers";
import config from "../../../config";

interface AudioManuscriptProps {
  audioLanguage?: string;
  audioUrl?: string;
  audioType?: string;
}

const toolbarOptions = createToolbarDefaultValues({
  text: {
    hidden: true,
  },
  mark: {
    code: {
      hidden: true,
    },
  },
  block: { hidden: true },
  inline: {
    hidden: true,
  },
});

const toolbarAreaFilters = createToolbarAreaOptions();

const manuscriptPlugins: SlatePlugin[] = [
  spanPlugin,
  paragraphPlugin,
  toolbarPlugin(toolbarOptions, toolbarAreaFilters),
  textTransformPlugin,
  breakPlugin,
  saveHotkeyPlugin,
  markPlugin,
  noopPlugin,
];

const manuscriptRenderers: SlatePlugin[] = [noopRenderer, paragraphRenderer, markRenderer, breakRenderer, spanRenderer];

const plugins = manuscriptPlugins.concat(manuscriptRenderers);

const AudioManuscript = ({ audioLanguage, audioUrl, audioType }: AudioManuscriptProps) => {
  const { t } = useTranslation();
  const { isSubmitting } = useFormikContext();
  const [isLoading, setIsLoading] = useState(false);

  const generateText = async () => {
    setIsLoading(true);
    if (!audioUrl || !audioLanguage || !audioType) {
      setIsLoading(false);
      return null;
    }

    let language;

    if (audioLanguage === "nb" || audioLanguage === "nn") {
      language = "no-NO";
    } else if (audioLanguage === "de") {
      language = "de-DE";
    } else {
      language = "en-US";
    }

    const transcriptionResult = await transcribe({
      fileUrl: config.s3AudioRoot + audioUrl.split("audio/files/")[1],
      languageCode: language,
      mediaFormat: audioType,
      outputFileName: "transcription",
    });
    const pollingInterval = setInterval(async () => {
      const response = await getTranscription(transcriptionResult.TranscriptionJob.TranscriptionJobName);
      if (response.status === "COMPLETED") {
        clearInterval(pollingInterval);
        return response.transcription;
      } else if (response.status === "FAILED") {
        clearInterval(pollingInterval);
        return null;
      }
    }, 10000);
    setIsLoading(false);
  };

  return (
    <FormField name="manuscript">
      {({ field, meta, helpers }) => (
        <FieldRoot invalid={!!meta.error}>
          <ContentEditableFieldLabel textStyle="title.medium">
            {t("podcastForm.fields.manuscript")}
          </ContentEditableFieldLabel>
          <RichTextEditor
            {...field}
            hideBlockPicker
            placeholder={t("podcastForm.fields.manuscript")}
            submitted={isSubmitting}
            plugins={plugins}
            onChange={helpers.setValue}
            toolbarOptions={toolbarOptions}
            toolbarAreaFilters={toolbarAreaFilters}
          />
          <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          <FieldWarning name={field.name} />
          {audioUrl && (
            <Button
              onClick={async () => {
                const text = await generateText();
                text && helpers.setValue(text);
              }}
              size="small"
            >
              {t("textGeneration.transcription.button")}
              {isLoading ? <Spinner size="small" /> : <FileListLine />}
            </Button>
          )}
        </FieldRoot>
      )}
    </FormField>
  );
};

export default connect<AudioManuscriptProps, AudioFormikType>(AudioManuscript);
