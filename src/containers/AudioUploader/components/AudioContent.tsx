/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { Portal } from "@ark-ui/react";
import { DeleteBinLine, InformationLine, UploadCloudLine } from "@ndla/icons";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  FieldErrorMessage,
  FieldRoot,
  FileUploadDropzone,
  FileUploadHiddenInput,
  FileUploadLabel,
  FileUploadRoot,
  FileUploadTrigger,
  IconButton,
  UnOrderedList,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { AudioCopyInfo } from "./AudioCopyInfo";
import { AudioFormikType } from "./AudioForm";
import AudioPlayer from "./AudioPlayer";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { FormField } from "../../../components/FormField";
import { FormContent } from "../../../components/FormikForm";
import { PodcastFormValues } from "../../../modules/audio/audioTypes";
import { TitleField } from "../../FormikForm";

const ContentWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "3xsmall",
  },
});

const StyledIconButton = styled(IconButton, {
  variants: {
    hasSelectedAudio: {
      true: {
        alignSelf: "flex-start",
      },
    },
  },
});

const StyledFieldRoot = styled(FieldRoot, {
  base: {
    flexGrow: "1",
  },
});

const getPlayerObject = (values: AudioFormikType): { src: string; mimeType: string } | undefined => {
  const { newFile, storedFile } = values.audioFile;

  if (newFile) {
    return {
      src: newFile.filepath,
      mimeType: newFile.file.type,
    };
  } else if (storedFile) {
    return {
      src: storedFile.url,
      mimeType: storedFile.mimeType,
    };
  }
  return undefined;
};

type AudioType = AudioFormikType | PodcastFormValues;

const AudioContent = () => {
  const { t } = useTranslation();
  const formikContext = useFormikContext<AudioType>();
  const { values, setFieldValue } = formikContext;
  const playerObject = getPlayerObject(values);

  return (
    <FormContent>
      <TitleField hideToolbar />
      <FormField name="audioFile">
        {({ helpers, meta }) => (
          <ContentWrapper>
            {playerObject ? (
              <AudioPlayer audio={playerObject} />
            ) : (
              <StyledFieldRoot required invalid={!!meta.error}>
                <FileUploadRoot
                  accept={["audio/mp3", "audio/mpeg"]}
                  onFileAccept={(details) => {
                    const file = details.files?.[0];
                    if (!file) return;
                    const filepath = URL.createObjectURL(file);
                    const newFile = { file, filepath };
                    setFieldValue("audioFile", { newFile });
                  }}
                  onFileReject={(details) => {
                    const fileErrors = details.files?.[0]?.errors;
                    if (!fileErrors) return;
                    if (fileErrors.includes("FILE_INVALID_TYPE")) {
                      const errorMessage = `${t("form.audio.fileUpload.genericError")}: ${t(
                        "form.audio.fileUpload.fileTypeInvalidError",
                      )}`;
                      // Bug in formik's setError function requiring setTimeout to make it work,
                      // as discussed here: https://github.com/jaredpalmer/formik/discussions/3870
                      setTimeout(() => {
                        helpers.setError(errorMessage);
                      }, 0);
                      return;
                    }
                    setTimeout(() => {
                      helpers.setError(t("form.audio.fileUpload.genericError"));
                    }, 0);
                  }}
                >
                  <FileUploadDropzone>
                    <FileUploadLabel>{t("form.audio.fileUpload.description")}</FileUploadLabel>
                    <FileUploadTrigger asChild>
                      <Button>
                        <UploadCloudLine />
                        {t("form.audio.fileUpload.button")}
                      </Button>
                    </FileUploadTrigger>
                  </FileUploadDropzone>
                  <FileUploadHiddenInput />
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                </FileUploadRoot>
              </StyledFieldRoot>
            )}
            {!!playerObject && (
              <IconButton
                variant="danger"
                aria-label={t("form.audio.remove")}
                title={t("form.audio.remove")}
                onClick={() => setFieldValue("audioFile", {})}
                size="small"
              >
                <DeleteBinLine />
              </IconButton>
            )}
            <DialogRoot>
              <DialogTrigger asChild>
                <StyledIconButton
                  variant="secondary"
                  size="small"
                  aria-label={t("form.audio.dialog.label")}
                  title={t("form.audio.dialog.label")}
                  hasSelectedAudio={!playerObject}
                >
                  <InformationLine />
                </StyledIconButton>
              </DialogTrigger>
              <Portal>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("form.audio.dialog.header")}</DialogTitle>
                    <DialogCloseButton />
                  </DialogHeader>
                  <DialogBody>
                    <UnOrderedList>
                      <li>{t("form.audio.info.multipleFiles")}</li>
                      <li>{t("form.audio.info.changeFile")}</li>
                      <li>{t("form.audio.info.newLanguage")}</li>
                      <li>{t("form.audio.info.deleteFiles")}</li>
                    </UnOrderedList>
                  </DialogBody>
                </DialogContent>
              </Portal>
            </DialogRoot>
          </ContentWrapper>
        )}
      </FormField>
      <AudioCopyInfo values={values} />
    </FormContent>
  );
};

export default AudioContent;
