/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Form, Formik, FormikProps, useFormikContext } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Descendant, Editor, Path, Transforms, Element } from "slate";
import { ReactEditor } from "slate-react";
import styled from "@emotion/styled";
import { ButtonV2, IconButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { FieldErrorMessage, InputV3, Label } from "@ndla/forms";
import { Pencil } from "@ndla/icons/action";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@ndla/modal";
import { BrightcoveEmbedData, BrightcoveMetaData } from "@ndla/types-embed";
import { Text } from "@ndla/typography";
import { VideoWrapper } from "./SlateVideo";
import { BrightcoveEmbedElement, TYPE_EMBED_BRIGHTCOVE } from "./types";
import config from "../../../../config";
import { InlineField } from "../../../../containers/FormikForm/InlineField";
import { inlineContentToEditorValue, inlineContentToHTML } from "../../../../util/articleContentConverter";
import { isFormikFormDirty } from "../../../../util/formHelper";
import { addBrightCoveTimeStampVideoid, getBrightCoveStartTime } from "../../../../util/videoUtil";
import { FormControl, FormField } from "../../../FormField";
import validateFormik, { RulesType } from "../../../formikValidationSchema";
import { RichTextIndicator } from "../../RichTextIndicator";

interface Props {
  embed: BrightcoveMetaData;
  editor: Editor;
  element: BrightcoveEmbedElement;
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

interface FormValues {
  alttext: string;
  caption: Descendant[];
  videoid?: string;
  startTime: string;
  resource: BrightcoveEmbedData["resource"];
}

export const toVideoEmbedFormValues = (embed: BrightcoveEmbedData): FormValues => {
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

const EditVideo = ({ embed, editor, element, setHasError }: Props) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
    ReactEditor.focus(editor);
    const path = ReactEditor.findPath(editor, element);
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => {
        Transforms.select(editor, Path.next(path));
      }, 0);
    }
  };

  const activeSrc = (embed: BrightcoveMetaData) => {
    const { account, videoid } = embed.embedData;
    const startTime = getBrightCoveStartTime(videoid);
    const id = addBrightCoveTimeStampVideoid(videoid, startTime);
    return `https://players.brightcove.net/${account}/${config.brightcoveEdPlayerId}_default/index.html?videoId=${id}`;
  };

  const initialValues = useMemo(() => toVideoEmbedFormValues(embed?.embedData), [embed]);

  const onSave = (values: FormValues) => {
    Transforms.setNodes(
      editor,
      {
        data: {
          ...embed.embedData,
          alt: values.alttext,
          caption: inlineContentToHTML(values.caption),
          videoid: addBrightCoveTimeStampVideoid(embed?.embedData?.videoid, values.startTime),
        },
      },
      {
        match: (node) => Element.isElement(node) && node.type === TYPE_EMBED_BRIGHTCOVE,
        at: ReactEditor.findPath(editor, element),
      },
    );
    onClose();
  };

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>
        <IconButtonV2 aria-label={t("form.video.editVideo")} title={t("form.video.editVideo")} colorTheme="light">
          <Pencil />
        </IconButtonV2>
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{t("form.video.editVideo")}</ModalTitle>
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <VideoWrapper>
            <StyledVideo title={`Video: ${embed.embedData.title}`} src={activeSrc(embed)} allowFullScreen />
          </VideoWrapper>
          <Formik
            initialValues={initialValues}
            validate={(values) => validateFormik(values, brightcoveEmbedFormRules, t)}
            validateOnBlur={false}
            validateOnMount
            onSubmit={onSave}
          >
            {(field) => <VideoEmbedForm {...field} setHasError={setHasError} close={() => setOpen(false)} />}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
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
