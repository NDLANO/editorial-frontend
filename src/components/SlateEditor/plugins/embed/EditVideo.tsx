/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldProps, Form, Formik, FormikProps } from "formik";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { Input } from "@ndla/forms";
import { ModalBody, ModalCloseButton, ModalHeader, ModalTitle } from "@ndla/modal";
import { Text } from "@ndla/typography";
import { SlateVideoWrapper, StyledVideo } from "./SlateVideo";
import { InlineField } from "../../../../containers/FormikForm/InlineField";
import { BrightcoveEmbed } from "../../../../interfaces";
import { inlineContentToEditorValue, inlineContentToHTML } from "../../../../util/articleContentConverter";
import { isFormikFormDirty } from "../../../../util/formHelper";
import { addBrightCoveTimeStampVideoid, getBrightCoveStartTime } from "../../../../util/videoUtil";
import FormikField from "../../../FormikField";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import { RichTextIndicator } from "../../RichTextIndicator";

interface Props {
  embed: BrightcoveEmbed;
  saveEmbedUpdates: (change: { [x: string]: string }) => void;
  activeSrc: string;
  close: () => void;
  setHasError: (hasError: boolean) => void;
}

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
  padding-top: ${spacing.small};
`;

const StyledFormikField = styled(FormikField)`
  margin-top: ${spacing.small};
`;

interface FormValues {
  alttext: string;
  caption: Descendant[];
  videoid?: string;
  startTime: string;
  resource: BrightcoveEmbed["resource"];
}

export const toVideoEmbedFormValues = (embed: BrightcoveEmbed): FormValues => {
  return {
    alttext: embed.alt ?? "",
    caption: inlineContentToEditorValue(embed.caption ?? "", true),
    startTime: getBrightCoveStartTime(embed.videoid),
    resource: embed.resource,
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

const EditVideo = ({ embed, saveEmbedUpdates, activeSrc, close, setHasError }: Props) => {
  const { t } = useTranslation();

  const initialValues = useMemo(() => toVideoEmbedFormValues(embed), [embed]);

  const handleSave = (values: FormValues) => {
    saveEmbedUpdates({
      alt: values.alttext,
      caption: inlineContentToHTML(values.caption),
      videoid: addBrightCoveTimeStampVideoid(embed.videoid, values.startTime),
    });
    close();
  };

  return (
    <>
      <ModalHeader>
        <ModalTitle>{t("form.video.editVideo")}</ModalTitle>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
        <SlateVideoWrapper>
          <StyledVideo
            title={`Video: ${embed.metaData ? embed.metaData.name : ""}`}
            frameBorder="0"
            src={activeSrc}
            allowFullScreen
          />
        </SlateVideoWrapper>
        <Formik
          initialValues={initialValues}
          validate={(values) => validateFormik(values, brightcoveEmbedFormRules, t)}
          validateOnBlur={false}
          validateOnMount
          onSubmit={handleSave}
        >
          {(formik) => <VideoEmbedForm {...formik} setHasError={setHasError} close={close} />}
        </Formik>
      </ModalBody>
    </>
  );
};
interface VideoEmbedFormProps extends FormikProps<FormValues> {
  setHasError: (hasError: boolean) => void;
  close: () => void;
}

const StyledInputTimeWrapper = styled.div`
  display: flex;
  flex-flow: row;
`;

const timeInputCss = css`
  width: 120px;
  margin-right: ${spacing.small};
  label {
    width: auto;
  }
`;

const VideoEmbedForm = ({ setHasError, close, isValid, dirty, initialValues, values }: VideoEmbedFormProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    setHasError(!isValid);
  }, [isValid, setHasError]);

  const formIsDirty = isFormikFormDirty({
    values: values,
    initialValues: initialValues,
    dirty,
  });

  return (
    <Form>
      <StyledFormikField name="caption">
        {({ field, form: { isSubmitting } }) => (
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
      </StyledFormikField>
      <StyledInputTimeWrapper>
        <StyledFormikField name="startTime">
          {({ field }: FieldProps) => (
            <Input
              {...field}
              label={t("form.video.time.start")}
              placeholder={t("form.video.time.hms")}
              white
              customCss={timeInputCss}
            />
          )}
        </StyledFormikField>
      </StyledInputTimeWrapper>
      <ButtonWrapper>
        <ButtonV2 onClick={close}>{t("form.abort")}</ButtonV2>
        <ButtonV2 disabled={!isValid || !formIsDirty} type="submit">
          {t("form.save")}
        </ButtonV2>
      </ButtonWrapper>
    </Form>
  );
};

export default EditVideo;
