/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Form, Formik, useFormikContext } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { FieldErrorMessage, Label, Select } from "@ndla/forms";
import { ModalBody, ModalHeader, ModalTitle } from "@ndla/modal";
import { Button } from "@ndla/primitives";
import { IAudioMetaInformation } from "@ndla/types-backend/audio-api";
import { AudioEmbedData } from "@ndla/types-embed";
import { AudioPlayer } from "@ndla/ui";
import { FormControl, FormField } from "../../../FormField";
import validateFormik, { RulesType } from "../../../formikValidationSchema";

interface Props {
  embed: AudioEmbedData;
  audio: IAudioMetaInformation;
  onCancel: () => void;
  onSave: (embed: AudioEmbedData) => void;
}

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
  padding: ${spacing.small} 0;
`;

interface FormValues {
  type: string;
}

export const toAudioEmbedFormValues = (embed: AudioEmbedData): FormValues => {
  return {
    type: embed.type,
  };
};

export const audioEmbedFormRules: RulesType<FormValues> = {
  type: {
    required: true,
  },
};

const AudioEmbedForm = ({ embed, onCancel, onSave, audio }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toAudioEmbedFormValues(embed), [embed]);

  const validate = useCallback((values: FormValues) => validateFormik(values, audioEmbedFormRules, t), [t]);

  const handleSubmit = useCallback(
    (values: FormValues) => {
      onSave({ ...embed, ...values });
    },
    [embed, onSave],
  );

  return (
    <>
      <ModalHeader>
        <ModalTitle>{t("form.editAudio")}</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <Formik
          initialValues={initialValues}
          validate={validate}
          enableReinitialize
          validateOnMount
          onSubmit={handleSubmit}
        >
          <EmbedForm audio={audio} onCancel={onCancel} />
        </Formik>
      </ModalBody>
    </>
  );
};

interface EmbedFormProps {
  onCancel: () => void;
  audio: IAudioMetaInformation;
}

const EmbedForm = ({ onCancel, audio }: EmbedFormProps) => {
  const { t } = useTranslation();
  const { isValid, dirty, values } = useFormikContext<FormValues>();
  return (
    <StyledForm>
      <FormField name="type">
        {({ field, meta }) => (
          <FormControl isRequired isInvalid={!!meta.error}>
            <Label textStyle="label-small" margin="none">
              {t("form.audio.chooseAudioType")}
            </Label>
            <Select {...field}>
              <option value="standard">{t("form.audio.sound")}</option>
              <option value="minimal">{t("form.audio.speech")}</option>
            </Select>
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </FormControl>
        )}
      </FormField>
      <div>
        <AudioPlayer src={audio.audioFile.url} title={audio.title.title} speech={values.type === "minimal"} />
      </div>
      <ButtonWrapper>
        <Button onClick={onCancel}>{t("form.abort")}</Button>
        <Button disabled={!isValid || !dirty} type="submit">
          {t("form.save")}
        </Button>
      </ButtonWrapper>
    </StyledForm>
  );
};

export default AudioEmbedForm;
