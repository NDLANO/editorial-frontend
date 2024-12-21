/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { connect, useField, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FileListLine } from "@ndla/icons";
import { Button, FieldErrorMessage, FieldRoot, Spinner } from "@ndla/primitives";
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
import { fetchAudioTranscription, postAudioTranscription } from "../../../modules/audio/audioApi";
import { useAudioTranscription } from "../../../modules/audio/audioQueries";
import { inlineContentToEditorValue } from "../../../util/articleContentConverter";
import { ArticleFormType } from "../../FormikForm/articleFormHooks";

interface AudioManuscriptProps {
  audioName?: string;
  audioId?: number;
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

const AudioManuscript = ({ audioId, audioLanguage, audioUrl, audioType }: AudioManuscriptProps) => {
  const { t } = useTranslation();
  const { setStatus } = useFormikContext<ArticleFormType>();
  const { isSubmitting } = useFormikContext();
  const [isLoading, setIsLoading] = useState(false);
  const getLanguage = (audioLanguage: string) => {
    const languageMap: { [key: string]: string } = {
      nb: "no-NO",
      nn: "no-NO",
      de: "de-DE",
    };

    return languageMap[audioLanguage] || "en-US";
  };

  const language = getLanguage(audioLanguage!);
  const { data: transcribeData } = useAudioTranscription(
    {
      audioId: audioId!,
      language: language,
    },
    {
      enabled: isLoading,
    },
  );

  const [_field, _meta, helpers] = useField("manuscript");

  const checkJobStatus = async (): Promise<boolean> => {
    const response = await fetchAudioTranscription(audioId!, language);
    return response.status !== "COMPLETE";
  };

  const startJob = async () => {
    if (!audioUrl || !audioLanguage || !audioType || !audioId) {
      return null;
    }
    const shouldPost = await checkJobStatus();
    if (shouldPost) {
      postAudioTranscription(audioUrl?.split("audio/files/")[1], audioId, language).then((_) => {
        setIsLoading(true);
      });
    }
  };

  const getTranscriptText = (text: string) => {
    const json = JSON.parse(text);
    return json.results.transcripts[0].transcript;
  };

  useEffect(() => {
    if (transcribeData?.status === "COMPLETED" && isLoading) {
      setIsLoading(false);
      const transcriptText = getTranscriptText(transcribeData?.transcription ?? "");
      const editorContent = inlineContentToEditorValue(transcriptText, true);
      helpers.setValue(editorContent, true);
      setStatus({ status: "acceptGenerated" });
    } else if (transcribeData?.status === "FAILED" && isLoading) {
      setIsLoading(false);
    }
  }, [setStatus, helpers, isLoading, transcribeData]);

  return (
    <FormField name="manuscript">
      {({ meta, helpers, field }) => {
        return (
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
              onChange={(value) => {
                helpers.setValue(value);
              }}
              toolbarOptions={toolbarOptions}
              toolbarAreaFilters={toolbarAreaFilters}
            />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            <FieldWarning name={field.name} />
            {!!audioUrl && (
              <Button onClick={() => startJob()} size="small">
                {t("textGeneration.transcription.button")}
                {isLoading ? <Spinner size="small" /> : <FileListLine />}
              </Button>
            )}
          </FieldRoot>
        );
      }}
    </FormField>
  );
};

export default connect<AudioManuscriptProps, AudioFormikType>(AudioManuscript);
