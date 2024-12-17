/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { connect } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { fonts } from "@ndla/core";
import { BlogPost } from "@ndla/icons/editor";
import { Button, Spinner } from "@ndla/primitives";
import { AudioFormikType } from "./AudioForm";
import FormikField from "../../../components/FormikField";
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

const StyledFormikField = styled(FormikField)`
  label {
    font-weight: ${fonts.weight.semibold};
    ${fonts.sizes("30px", "38px")};
  }
`;

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

const StyledRichTextEditor = styled(RichTextEditor)`
  white-space: pre-wrap;
  ${fonts.sizes("16px", "30px")};
  font-family: ${fonts.sans};
`;

const AudioManuscript = ({ audioLanguage, audioUrl, audioType }: AudioManuscriptProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const generateText = async () => {
    setIsLoading(true);
    if (!audioUrl || !audioLanguage || !audioType) {
      setIsLoading(false);
      return;
    }

    let language;

    if (audioLanguage === "nb" || audioLanguage === "nn") {
      language = "no-NO";
    } else if (audioLanguage === "de") {
      language = "de-DE";
    } else {
      language = "en-US";
    }

    const jobName = await transcribe({
      fileUrl: config.s3AudioRoot + audioUrl.split("audio/files/")[1],
      languageCode: language,
      mediaFormat: audioType,
      outputFileName: "transcription",
    });
    // while (isLoading) {
    //   console.log("waiting for transcription");
    //   setTimeout(async () => {
    //     const response = await getTranscription(jobName);
    //     if (response.status === "COMPLETED") {
    //       setIsLoading(false);
    //       return response.transcriptUrl;
    //     } else if (response.status === "FAILED") {
    //       setIsLoading(false);
    //       return "Could not transcribe audio";
    //     }
    //   }, 10000);
    // }
    setIsLoading(false);
  };

  return (
    <StyledFormikField label={t("podcastForm.fields.manuscript")} name="manuscript">
      {({ field, form: { isSubmitting }, helpers }) => (
        <>
          <StyledRichTextEditor
            {...field}
            hideBlockPicker
            placeholder={t("podcastForm.fields.manuscript")}
            submitted={isSubmitting}
            plugins={plugins}
            onChange={(val) => field.onChange({ target: { value: val, name: field.name } })}
            toolbarOptions={toolbarOptions}
            toolbarAreaFilters={toolbarAreaFilters}
          />
          {audioUrl && (
            <Button
              onClick={async () => {
                const text = await generateText();
              }}
              size="small"
            >
              Test
              {isLoading ? <Spinner size="small" /> : <BlogPost />}
            </Button>
          )}
        </>
      )}
    </StyledFormikField>
  );
};

export default connect<AudioManuscriptProps, AudioFormikType>(AudioManuscript);
