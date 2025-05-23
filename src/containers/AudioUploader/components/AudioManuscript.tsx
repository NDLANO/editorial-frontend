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
import { Button, FieldErrorMessage, FieldRoot } from "@ndla/primitives";
import { IAudioMetaInformationDTO } from "@ndla/types-backend/audio-api";
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
import { UnsupportedElement } from "../../../components/SlateEditor/plugins/unsupported/UnsupportedElement";
import { unsupportedElementRenderer } from "../../../components/SlateEditor/plugins/unsupported/unsupportedElementRenderer";
import { unsupportedPlugin } from "../../../components/SlateEditor/plugins/unsupported/unsupportedPlugin";
import RichTextEditor from "../../../components/SlateEditor/RichTextEditor";
import { AI_ACCESS_SCOPE } from "../../../constants";
import { useSession } from "../../../containers/Session/SessionProvider";
import { usePostAudioTranscriptionMutation } from "../../../modules/audio/audioMutations";
import { useAudioTranscription } from "../../../modules/audio/audioQueries";
import { inlineContentToEditorValue } from "../../../util/articleContentConverter";
import { useMessages } from "../../Messages/MessagesProvider";

interface AudioManuscriptProps {
  audio?: IAudioMetaInformationDTO;
  audioLanguage?: string;
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
  unsupportedPlugin,
];

const LANGUAGE_MAP: Record<string, string> = {
  nb: "no-NO",
  nn: "no-NO",
  de: "de-DE",
};

const manuscriptRenderers: SlatePlugin[] = [
  noopRenderer,
  paragraphRenderer,
  markRenderer,
  breakRenderer,
  spanRenderer,
  unsupportedElementRenderer,
];
const plugins = manuscriptPlugins.concat(manuscriptRenderers);

// TODO: remove when object is properly typed from the backend
const parseTranscript = (text: string) => {
  const json = JSON.parse(text);
  return json.results.transcripts[0].transcript;
};

const MANUSCRIPT_EDITOR = "editor-manuscript";

const AudioManuscript = ({ audio, audioLanguage = "no" }: AudioManuscriptProps) => {
  const { t } = useTranslation();
  const { setStatus, values, isSubmitting } = useFormikContext<AudioFormikType>();
  const { userPermissions } = useSession();
  const { createMessage } = useMessages();
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [_field, _meta, helpers] = useField("manuscript");

  const language = LANGUAGE_MAP[audioLanguage] ?? LANGUAGE_MAP.nb;
  const postAudioTranscriptionMutation = usePostAudioTranscriptionMutation();
  const fetchAudioTranscriptQuery = useAudioTranscription(
    {
      audioId: audio?.id ?? -1,
      language: language,
    },
    {
      // Settings to make this a lazyQuery
      enabled: false,
      retry: false,
    },
  );

  const { data: polledData } = useAudioTranscription(
    {
      audioId: audio?.id ?? -1,
      language: language,
    },
    {
      refetchInterval: 1000,
      enabled: isPolling && !!audio,
    },
  );

  const startTranscription = async () => {
    if (audio) {
      const transcript = await fetchAudioTranscriptQuery.refetch({ cancelRefetch: false });

      if (transcript?.data?.status === "COMPLETED") {
        // TODO: use object directly when type is properly typed from backend
        const transcriptText = parseTranscript(transcript?.data?.transcription ?? "");
        const editorContent = inlineContentToEditorValue(transcriptText, true);
        helpers.setValue(editorContent, true);
        setStatus({ status: MANUSCRIPT_EDITOR });
      } else if (transcript?.data?.status === "FAILED") {
        createMessage({ message: t("textGeneration.failedTranscription"), severity: "danger", timeToLive: 0 });
      } else {
        const name = audio.audioFile.url?.split("audio/files/")[1];
        await postAudioTranscriptionMutation
          .mutateAsync({ name, id: audio.id, language })
          .then(() => setIsPolling(true))
          .catch((err) => {
            if (err.status === 400 && err.json.code === "JOB_ALREADY_FOUND") {
              setIsPolling(true);
            }
          });
      }
    }
  };

  useEffect(() => {
    if (polledData?.status === "COMPLETED" && isPolling) {
      setIsPolling(false);
      const transcriptText = parseTranscript(polledData?.transcription ?? "");
      const editorContent = inlineContentToEditorValue(transcriptText, true);
      helpers.setValue(editorContent, true);
      setStatus({ status: MANUSCRIPT_EDITOR });
    } else if (polledData?.status === "FAILED" && isPolling) {
      setIsPolling(false);
      createMessage({ message: t("textGeneration.failedTranscription"), severity: "danger", timeToLive: 0 });
    }
  }, [createMessage, helpers, isPolling, polledData?.status, polledData?.transcription, setStatus, t]);

  return (
    <FormField name="manuscript">
      {({ meta, helpers, field }) => (
        <FieldRoot invalid={!!meta.error}>
          <ContentEditableFieldLabel textStyle="title.medium">
            {t("podcastForm.fields.manuscript")}
          </ContentEditableFieldLabel>
          <RichTextEditor
            {...field}
            editorId={MANUSCRIPT_EDITOR}
            hideBlockPicker
            placeholder={t("podcastForm.fields.manuscript")}
            submitted={isSubmitting}
            plugins={plugins}
            onChange={helpers.setValue}
            toolbarOptions={toolbarOptions}
            renderInvalidElement={(props) => <UnsupportedElement {...props} />}
            toolbarAreaFilters={toolbarAreaFilters}
          />
          <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          <FieldWarning name={field.name} />
          {!!audio?.audioFile.url && userPermissions?.includes(AI_ACCESS_SCOPE) ? (
            <Button
              onClick={startTranscription}
              size="small"
              disabled={!(values.audioFile.storedFile || values.audioFile.newFile)}
              loading={isPolling || fetchAudioTranscriptQuery.isLoading}
            >
              {t("textGeneration.generateTranscription")}
              <FileListLine />
            </Button>
          ) : undefined}
        </FieldRoot>
      )}
    </FormField>
  );
};

export default connect<AudioManuscriptProps, AudioFormikType>(AudioManuscript);
