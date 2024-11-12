/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, FormikHelpers } from "formik";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Descendant } from "slate";
import { Button, PageContent } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import {
  IAudio,
  IAuthor,
  IAudioMetaInformation,
  INewAudioMetaInformation,
  IUpdatedAudioMetaInformation,
} from "@ndla/types-backend/audio-api";
import AudioContent from "./AudioContent";
import AudioCopyright from "./AudioCopyright";
import AudioManuscript from "./AudioManuscript";
import AudioMetaData from "./AudioMetaData";
import FormAccordion from "../../../components/Accordion/FormAccordion";
import FormAccordions from "../../../components/Accordion/FormAccordions";
import { FormActionsContainer } from "../../../components/FormikForm";
import validateFormik, { getWarnings, RulesType } from "../../../components/formikValidationSchema";
import FormWrapper from "../../../components/FormWrapper";
import HeaderWithLanguage from "../../../components/HeaderWithLanguage";
import SaveButton from "../../../components/SaveButton";
import { SAVE_BUTTON_ID } from "../../../constants";
import { useLicenses } from "../../../modules/draft/draftQueries";
import { editorValueToPlainText, inlineContentToHTML } from "../../../util/articleContentConverter";
import { audioApiTypeToFormType } from "../../../util/audioHelpers";
import { DEFAULT_LICENSE, isFormikFormDirty } from "../../../util/formHelper";
import { AlertDialogWrapper } from "../../FormikForm";
import { MessageError, useMessages } from "../../Messages/MessagesProvider";

export interface AudioFormikType {
  id?: number;
  revision?: number;
  language: string;
  supportedLanguages: string[];
  title: Descendant[];
  manuscript: Descendant[];
  audioFile: {
    storedFile?: IAudio;
    newFile?: {
      filepath: string;
      file: File;
    };
  };
  tags: string[];
  creators: IAuthor[];
  processors: IAuthor[];
  rightsholders: IAuthor[];
  processed: boolean;
  origin: string;
  license: string;
}

const StyledFormActionsContainer = styled(FormActionsContainer, {
  base: {
    marginBlockStart: "xsmall",
  },
});

const rules: RulesType<AudioFormikType, IAudioMetaInformation> = {
  title: {
    required: true,
    warnings: {
      languageMatch: true,
    },
  },
  manuscript: {
    required: false,
    warnings: {
      languageMatch: true,
    },
  },
  tags: {
    minItems: 3,
    warnings: {
      languageMatch: true,
    },
  },
  creators: {
    allObjectFieldsRequired: true,
  },
  processors: {
    allObjectFieldsRequired: true,
  },
  rightsholders: {
    allObjectFieldsRequired: true,
  },
  audioFile: {
    required: true,
  },
  license: {
    required: true,
    test: (values) => {
      const authors = values.creators.concat(values.rightsholders).concat(values.processors);
      if (authors.length > 0) return undefined;
      return { translationKey: "validation.noLicenseWithoutCopyrightHolder" };
    },
  },
};

interface Props {
  onCreateAudio?: (audio: INewAudioMetaInformation, file?: string | Blob) => Promise<void>;
  onUpdateAudio?: (audio: IUpdatedAudioMetaInformation, file?: string | Blob) => Promise<void>;
  audio?: IAudioMetaInformation;
  audioLanguage: string;
  supportedLanguages: string[];
  isNewlyCreated?: boolean;
  isNewLanguage?: boolean;
}

const AudioForm = ({
  audioLanguage,
  audio,
  isNewlyCreated,
  onCreateAudio,
  onUpdateAudio,
  isNewLanguage,
  supportedLanguages,
}: Props) => {
  const { t } = useTranslation();
  const [savedToServer, setSavedToServer] = useState(false);
  const prevAudioLanguage = useRef<string | null>(null);
  const { applicationError } = useMessages();
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!prevAudioLanguage.current) {
      prevAudioLanguage.current = audioLanguage;
      return;
    }
    if (audioLanguage !== prevAudioLanguage.current) {
      setSavedToServer(false);
    }
  });

  const handleSubmit = async (values: AudioFormikType, actions: FormikHelpers<AudioFormikType>) => {
    try {
      actions.setSubmitting(true);
      const audioMetaData: INewAudioMetaInformation = {
        title: editorValueToPlainText(values.title),
        manuscript: inlineContentToHTML(values.manuscript),
        language: values.language,
        tags: values.tags,
        audioType: "standard",
        copyright: {
          license: licenses?.find((license) => license.license === values.license) ?? DEFAULT_LICENSE,
          origin: values.origin,
          creators: values.creators,
          processors: values.processors,
          rightsholders: values.rightsholders,
          processed: values.processed,
        },
      };
      if (audio?.revision) {
        await onUpdateAudio?.({ ...audioMetaData, revision: audio.revision }, values.audioFile.newFile?.file);
      } else {
        await onCreateAudio?.(audioMetaData, values.audioFile.newFile?.file);
      }

      actions.setSubmitting(false);
      setSavedToServer(true);
    } catch (err) {
      applicationError(err as MessageError);
      actions.setSubmitting(false);
      setSavedToServer(false);
    }
  };

  const initialValues = audioApiTypeToFormType(audio, audioLanguage);
  const initialErrors = validateFormik(initialValues, rules, t);
  const initialWarnings = getWarnings(initialValues, rules, t, audio);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnMount
      initialErrors={initialErrors}
      validate={(values) => validateFormik(values, rules, t)}
      initialStatus={{ warnings: initialWarnings }}
    >
      {(formikProps) => {
        const { values, dirty, isSubmitting, submitForm, errors } = formikProps;
        const formIsDirty = isFormikFormDirty({
          values,
          initialValues,
          dirty,
          changed: isNewLanguage,
        });

        const hasError = (errFields: (keyof AudioFormikType)[]): boolean => {
          return errFields.some((field) => !!errors[field]);
        };
        return (
          <FormWrapper>
            <HeaderWithLanguage
              id={audio?.id}
              language={audioLanguage}
              noStatus
              supportedLanguages={supportedLanguages}
              type="audio"
              title={audio?.title.title}
            />
            <FormAccordions defaultOpen={["audio-upload-content"]}>
              <FormAccordion
                id="audio-upload-content"
                title={t("form.contentSection")}
                hasError={hasError(["title", "audioFile"])}
              >
                <PageContent variant="content">
                  <AudioContent handleSubmit={handleSubmit} />
                </PageContent>
              </FormAccordion>
              <FormAccordion
                id="podcast-upload-podcastmanus"
                title={t("podcastForm.fields.manuscript")}
                hasError={[].some((field) => field in errors)}
              >
                <AudioManuscript />
              </FormAccordion>
              <FormAccordion
                id="audio-upload-copyright"
                title={t("form.copyrightSection")}
                hasError={hasError(["rightsholders", "creators", "processors", "license"])}
              >
                <AudioCopyright />
              </FormAccordion>
              <FormAccordion
                id="audio-upload-metadataSection"
                title={t("form.metadataSection")}
                hasError={hasError(["tags"])}
              >
                <AudioMetaData />
              </FormAccordion>
            </FormAccordions>
            <StyledFormActionsContainer>
              <Button variant="secondary" disabled={isSubmitting} onClick={() => navigate(-1)}>
                {t("form.abort")}
              </Button>
              <SaveButton
                id={SAVE_BUTTON_ID}
                loading={isSubmitting}
                formIsDirty={formIsDirty}
                showSaved={!formIsDirty && (savedToServer || isNewlyCreated)}
                onClick={(evt) => {
                  evt.preventDefault();
                  submitForm();
                }}
              />
            </StyledFormActionsContainer>
            <AlertDialogWrapper
              {...formikProps}
              formIsDirty={formIsDirty}
              severity="danger"
              text={t("alertModal.notSaved")}
            />
          </FormWrapper>
        );
      }}
    </Formik>
  );
};

export default AudioForm;
