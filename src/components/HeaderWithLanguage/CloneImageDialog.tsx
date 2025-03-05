/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, useFormikContext } from "formik";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DialogOpenChangeDetails } from "@ark-ui/react";
import {
  DialogContent,
  Button,
  DialogBody,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ImageUploadFormElement } from "../../containers/ImageUploader/components/ImageUploadFormElement";
import { useMessages } from "../../containers/Messages/MessagesProvider";
import * as imageApi from "../../modules/image/imageApi";
import { NdlaErrorPayload } from "../../util/resolveJsonOrRejectWithError";
import { toEditImage } from "../../util/routeHelpers";
import { DialogCloseButton } from "../DialogCloseButton";
import { FormActionsContainer, FormContent } from "../FormikForm";
import validateFormik from "../formikValidationSchema";

interface Props {
  loading: boolean;
  imageId: number;
}

const StyledFormContent = styled(FormContent, {
  base: {
    marginInlineEnd: "large",
    gap: "small",
  },
});

interface FormikValuesType {
  imageFile: Blob | string | undefined;
}

const formikRules = { imageFile: { required: true } };

export const CloneImageDialog = ({ loading, imageId }: Props) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const { createMessage, applicationError } = useMessages();
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();
  const parentFormikContext = useFormikContext<unknown>();
  const parentFormIsDirty = parentFormikContext.dirty;

  const onOpenChange = useCallback((details: DialogOpenChangeDetails) => setOpen(details.open), []);
  const handleSubmit = useCallback(
    async (values: FormikValuesType) => {
      try {
        if (parentFormIsDirty) {
          createMessage({
            translationKey: "form.mustSaveFirst",
            severity: "danger",
            timeToLive: 0,
          });
        } else {
          setUpdating(true);
          const newImage = await imageApi.cloneImage(imageId, values.imageFile);
          navigate(toEditImage(newImage.id, newImage.title.language));
        }
      } catch (e) {
        const err = e as NdlaErrorPayload;
        applicationError(err);
        setUpdating(false);
      }
    },
    [parentFormIsDirty, createMessage, imageId, navigate, applicationError],
  );

  const initialValues: FormikValuesType = {
    imageFile: undefined,
  };

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="small" variant="tertiary" loading={loading}>
          {t("form.workflow.saveAsNew")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("imageForm.copyImageTitle")}</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <DialogBody>
          <Text textStyle="label.small">{t("imageForm.copyDescription")}</Text>
          <Formik
            initialValues={initialValues}
            initialErrors={{}}
            onSubmit={handleSubmit}
            validate={(values) => validateFormik(values, formikRules, t)}
          >
            {({ dirty, submitForm }) => {
              return (
                <StyledFormContent>
                  <ImageUploadFormElement language={i18n.language} />
                  <FormActionsContainer>
                    <Button disabled={!dirty} loading={loading || updating} onClick={submitForm}>
                      {t("save")}
                    </Button>
                  </FormActionsContainer>
                </StyledFormContent>
              );
            }}
          </Formik>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};
