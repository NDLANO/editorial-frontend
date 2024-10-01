/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, useFormikContext } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import { ArrowDownShortLine } from "@ndla/icons/common";
import { CheckLine } from "@ndla/icons/editor";
import { ModalBody, ModalHeader, ModalTitle } from "@ndla/modal";
import {
  Button,
  FieldErrorMessage,
  FieldRoot,
  SelectContent,
  SelectControl,
  SelectIndicator,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPositioner,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@ndla/primitives";
import { IAudioMetaInformation } from "@ndla/types-backend/audio-api";
import { AudioEmbedData } from "@ndla/types-embed";
import { AudioPlayer } from "@ndla/ui";
import { FormField } from "../../../FormField";
import { FormActionsContainer, FormikForm } from "../../../FormikForm";
import validateFormik, { RulesType } from "../../../formikValidationSchema";

interface Props {
  embed: AudioEmbedData;
  audio: IAudioMetaInformation;
  onCancel: () => void;
  onSave: (embed: AudioEmbedData) => void;
}

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

  const collection = useMemo(
    () =>
      createListCollection({
        items: [
          {
            value: "standard",
            label: t("form.audio.sound"),
          },
          {
            value: "minimal",
            label: t("form.audio.speech"),
          },
        ],
      }),
    [t],
  );

  return (
    <FormikForm>
      <FormField name="type">
        {({ field, meta, helpers }) => (
          <FieldRoot required invalid={!!meta.error}>
            <SelectRoot
              value={[field.value]}
              onValueChange={(details) => helpers.setValue(details.value[0])}
              collection={collection}
            >
              <SelectLabel>{t("form.audio.chooseAudioType")}</SelectLabel>
              <SelectControl>
                <SelectTrigger asChild>
                  <Button variant="secondary">
                    <SelectValueText />

                    <SelectIndicator asChild>
                      <ArrowDownShortLine />
                    </SelectIndicator>
                  </Button>
                </SelectTrigger>
              </SelectControl>
              <SelectPositioner>
                <SelectContent>
                  {collection.items.map((item) => (
                    <SelectItem item={item} key={item.value}>
                      <SelectItemText>{item.label}</SelectItemText>
                      <SelectItemIndicator asChild>
                        <CheckLine />
                      </SelectItemIndicator>
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectPositioner>
            </SelectRoot>
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </FieldRoot>
        )}
      </FormField>
      <AudioPlayer src={audio.audioFile.url} title={audio.title.title} speech={values.type === "minimal"} />
      <FormActionsContainer>
        <Button onClick={onCancel}>{t("form.abort")}</Button>
        <Button disabled={!isValid || !dirty} type="submit">
          {t("form.save")}
        </Button>
      </FormActionsContainer>
    </FormikForm>
  );
};

export default AudioEmbedForm;
