/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, FormikProps, useFormikContext } from "formik";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import {
  Button,
  FieldInput,
  FieldErrorMessage,
  FieldLabel,
  FieldRoot,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { BrightcoveEmbedData } from "@ndla/types-embed";
import { VideoWrapper } from "./VideoWrapper";
import config from "../../../../config";
import { InlineField } from "../../../../containers/FormikForm/InlineField";
import { inlineContentToEditorValue } from "../../../../util/articleContentConverter";
import { isFormikFormDirty } from "../../../../util/formHelper";
import { addBrightCoveTimeStampVideoid, getBrightCoveStartTime } from "../../../../util/videoUtil";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { ContentEditableFieldLabel } from "../../../Form/ContentEditableFieldLabel";
import { FormField } from "../../../FormField";
import { FormActionsContainer, FormikForm } from "../../../FormikForm";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import { RichTextIndicator } from "../../RichTextIndicator";

interface Props {
  embed: BrightcoveEmbedData;
  onSave: (values: FormValues) => void;
  onClose: () => void;
  setHasError: (hasError: boolean) => void;
}

const StyledVideo = styled("iframe", {
  base: {
    width: "100%",
    aspectRatio: "16/9",
  },
});

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
      <DialogHeader>
        <DialogTitle>{t("form.video.editVideo")}</DialogTitle>
        <DialogCloseButton />
      </DialogHeader>
      <DialogBody>
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
      </DialogBody>
    </>
  );
};
interface VideoEmbedFormProps extends FormikProps<FormValues> {
  setHasError: (hasError: boolean) => void;
  close: () => void;
}

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
    <FormikForm>
      <FormField name="caption">
        {({ field, meta }) => (
          <FieldRoot invalid={!!meta.error}>
            <ContentEditableFieldLabel>
              {t("form.video.caption.label")}
              <RichTextIndicator />
            </ContentEditableFieldLabel>
            <InlineField
              {...field}
              placeholder={t("form.video.caption.placeholder")}
              submitted={isSubmitting}
              onChange={(val) => field.onChange({ target: { value: val, name: field.name } })}
            />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </FieldRoot>
        )}
      </FormField>
      <FormField name="startTime">
        {({ field, meta }) => (
          <FieldRoot invalid={!!meta.error}>
            <FieldLabel textStyle="label.medium">{t("form.video.time.start")}</FieldLabel>
            <FieldInput {...field} placeholder={t("form.video.time.hms")} />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </FieldRoot>
        )}
      </FormField>
      <FormActionsContainer>
        <Button variant="secondary" onClick={close}>
          {t("form.abort")}
        </Button>
        <Button disabled={!isValid || !formIsDirty} type="submit">
          {t("form.save")}
        </Button>
      </FormActionsContainer>
    </FormikForm>
  );
};

export default EditVideo;
