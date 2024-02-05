/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { FormEvent } from "react";

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { IconButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { UploadDropZone, FieldHeader } from "@ndla/forms";
import { DeleteForever } from "@ndla/icons/editor";
import Tooltip from "@ndla/tooltip";
import AudioCopyInfo from "./AudioCopyInfo";
import AudioFileInfoModal from "./AudioFileInfoModal";
import { AudioFormikType } from "./AudioForm";
import AudioPlayer from "./AudioPlayer";
import FormikField from "../../../components/FormikField";
import { PodcastFormValues } from "../../../modules/audio/audioApiInterfaces";
import { TitleField } from "../../FormikForm";
import { HandleSubmitFunc } from "../../FormikForm/articleFormHooks";

interface Props<T extends AudioFormikType | PodcastFormValues> {
  handleSubmit: HandleSubmitFunc<T>;
}

const PlayerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${spacing.small};
  margin-top: ${spacing.large};
`;

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

const AudioContent = <T extends AudioFormikType | PodcastFormValues>({ handleSubmit: _handleSubmit }: Props<T>) => {
  const { t } = useTranslation();
  const formikContext = useFormikContext<T>();
  const { values, setFieldValue } = formikContext;
  const playerObject = getPlayerObject(values);

  return (
    <>
      <TitleField hideToolbar />
      <FormikField noBorder name="audioFile" label={t("form.audio.file")}>
        {() => (
          <>
            <FieldHeader title={t("form.audio.sound")}>
              <AudioFileInfoModal />
            </FieldHeader>
            {playerObject ? (
              <PlayerWrapper>
                <AudioPlayer audio={playerObject} />
                <Tooltip tooltip={t("form.audio.remove")}>
                  <IconButtonV2
                    variant="ghost"
                    colorTheme="danger"
                    aria-label={t("form.audio.remove")}
                    onClick={() => setFieldValue("audioFile", {})}
                    tabIndex={-1}
                  >
                    <DeleteForever />
                  </IconButtonV2>
                </Tooltip>
              </PlayerWrapper>
            ) : (
              <UploadDropZone
                name="audioFile"
                allowedFiles={["audio/mp3", "audio/mpeg"]}
                onAddedFiles={(_, evt: FormEvent<HTMLInputElement>) => {
                  const file = evt.currentTarget.files?.[0];
                  const filepath = file ? URL.createObjectURL(file) : undefined;
                  const newFile = file && filepath ? { file, filepath } : undefined;
                  setFieldValue("audioFile", { newFile });
                }}
                ariaLabel={t("form.audio.dragdrop.ariaLabel")}
              >
                <strong>{t("form.audio.dragdrop.main")}</strong>
                {t("form.audio.dragdrop.sub")}
              </UploadDropZone>
            )}
          </>
        )}
      </FormikField>
      <AudioCopyInfo values={values} />
    </>
  );
};

export default AudioContent;
