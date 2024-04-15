/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Form, Formik, FormikProps, useFormikContext } from "formik";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { FieldErrorMessage, InputV3, Label } from "@ndla/forms";
import { ModalBody, ModalCloseButton, ModalHeader, ModalTitle } from "@ndla/modal";
import { BrightcoveEmbedData } from "@ndla/types-embed";
import { Text } from "@ndla/typography";
import { VideoWrapper } from "./SlateVideo";
import config from "../../../../config";
import { InlineField } from "../../../../containers/FormikForm/InlineField";
import { inlineContentToEditorValue } from "../../../../util/articleContentConverter";
import { isFormikFormDirty } from "../../../../util/formHelper";
import { addBrightCoveTimeStampVideoid, getBrightCoveStartTime } from "../../../../util/videoUtil";
import { FormControl, FormField } from "../../../FormField";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import { RichTextIndicator } from "../../RichTextIndicator";

interface Props {
  embed: BrightcoveEmbedData;
  onSave: (values: FormValues) => void;
  onClose: () => void;
  setHasError: (hasError: boolean) => void;
}

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
  padding-top: ${spacing.small};
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const StyledVideo = styled.iframe`
  width: 100%;
  aspect-ratio: 16/9;
`;

export interface FormValues {
  alttext: string;
  caption: Descendant[];
  videoid: string;
  startTime: string;
  resource: BrightcoveEmbedData["resource"];
}

export const toVideoEmbedFormValues = (embed: BrightcoveEmbedData): FormValues => {
  return {
    alttext: embed.alt ?? "",
    caption: inlineContentToEditorValue(embed.caption ?? "", true),
    startTime: getBrightCoveStartTime(embed.videoid),
    resource: embed.resource,
    videoid: embed.videoid,
  };
};

export const brightcoveEmbedFormRules: RulesType<FormValues> = {
  alttext: {
    required: false,
  },
  caption: {
    required: true,
    translationKey: "form.video.caption.label",
  },
};

const activeSrc = ({ account, videoid }: BrightcoveEmbedData) => {
  const startTime = getBrightCoveStartTime(videoid);
  const id = addBrightCoveTimeStampVideoid(videoid, startTime);
  return `https://players.brightcove.net/${account}/${config.brightcoveEdPlayerId}_default/index.html?videoId=${id}`;
};

const EditVideo = ({ onSave, setHasError, embed, onClose }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toVideoEmbedFormValues(embed), [embed]);

  return (
    <>
      <ModalHeader>
        <ModalTitle>{t("form.video.editVideo")}</ModalTitle>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
        <VideoWrapper>
          <StyledVideo title={`Video: ${embed?.title}`} src={activeSrc(embed)} allowFullScreen />
        </VideoWrapper>
        <Formik
          initialValues={initialValues}
          validate={(values) => validateFormik(values, brightcoveEmbedFormRules, t)}
          validateOnBlur={false}
          validateOnMount
          onSubmit={onSave}
        >
          {(field) => <VideoEmbedForm {...field} setHasError={setHasError} close={onClose} />}
        </Formik>
      </ModalBody>
    </>
  );
};
interface VideoEmbedFormProps extends FormikProps<FormValues> {
  setHasError: (hasError: boolean) => void;
  close: () => void;
}

const StyledFormControl = styled(FormControl)`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${spacing.small};
  input {
    width: 120px;
  }
`;

const VideoEmbedForm = ({ setHasError, close, isValid, dirty, initialValues, values }: VideoEmbedFormProps) => {
  const { t } = useTranslation();
  const { isSubmitting } = useFormikContext();

  useEffect(() => {
    setHasError(!isValid);
  }, [isValid, setHasError]);

  const formIsDirty = isFormikFormDirty({
    values: values,
    initialValues: initialValues,
    dirty,
  });

  return (
    <StyledForm>
      <FormField name="caption">
        {({ field }) => (
          <>
            <Text textStyle="label-small" margin="none">
              {t("form.video.caption.label")}
              <RichTextIndicator />
            </Text>
            <InlineField
              {...field}
              placeholder={t("form.video.caption.placeholder")}
              submitted={isSubmitting}
              onChange={(val) => field.onChange({ target: { value: val, name: field.name } })}
            />
          </>
        )}
      </FormField>
      <FormField name="startTime">
        {({ field, meta }) => (
          <StyledFormControl isInvalid={!!meta.error}>
            <Label textStyle="label-small" margin="none">
              {t("form.video.time.start")}
            </Label>
            <InputV3 {...field} placeholder={t("form.video.time.hms")} />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </StyledFormControl>
        )}
      </FormField>
      <ButtonWrapper>
        <ButtonV2 onClick={close}>{t("form.abort")}</ButtonV2>
        <ButtonV2 disabled={!isValid || !formIsDirty} type="submit">
          {t("form.save")}
        </ButtonV2>
      </ButtonWrapper>
    </StyledForm>
  );
};

export default EditVideo;
