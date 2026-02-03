/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DialogOpenChangeDetails, Portal } from "@ark-ui/react";
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
import { Formik, useFormikContext } from "formik";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { ImageUploadFormElement } from "../../containers/ImageUploader/components/ImageUploadFormElement";
import { ImageFormikType } from "../../containers/ImageUploader/imageTransformers";
import { useMessages } from "../../containers/Messages/MessagesProvider";
import { useCloneImageMutation } from "../../modules/image/imageMutations";
import { NdlaErrorPayload } from "../../util/resolveJsonOrRejectWithError";
import { toEditImage } from "../../util/routeHelpers";
import { DialogCloseButton } from "../DialogCloseButton";
import { Form, FormActionsContainer } from "../FormikForm";
import validateFormik from "../formikValidationSchema";

interface Props {
  imageId: number;
}

interface FormikValuesType extends Partial<ImageFormikType> {
  imageFile: Blob | string | undefined;
}

const formikRules = { imageFile: { required: true } };
const initialValues: FormikValuesType = {
  imageFile: undefined,
};

export const CloneImageDialog = ({ imageId }: Props) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const { createMessage, applicationError } = useMessages();
  const cloneImage = useCloneImageMutation();
  const navigate = useNavigate();
  const parentFormikContext = useFormikContext<unknown>();
  const parentFormIsDirty = parentFormikContext.dirty;

  const onOpenChange = useCallback(
    (details: DialogOpenChangeDetails) => {
      if (parentFormIsDirty) {
        createMessage({
          translationKey: "form.mustSaveFirst",
          severity: "danger",
          timeToLive: 0,
        });
      } else {
        setOpen(details.open);
      }
    },
    [createMessage, parentFormIsDirty],
  );
  const handleSubmit = useCallback(
    async (values: FormikValuesType) => {
      try {
        if (values.imageFile instanceof Blob) {
          const newImage = await cloneImage.mutateAsync({ imageId, imageFile: values.imageFile });
          navigate(toEditImage(newImage.id, newImage.title.language));
        }
      } catch (e) {
        const err = e as NdlaErrorPayload;
        applicationError(err);
      }
    },
    [cloneImage, imageId, navigate, applicationError],
  );

  return (
    <DialogRoot role="alertdialog" open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="small" variant="tertiary" loading={cloneImage.isPending}>
          {t("form.workflow.saveAsNew")}
        </Button>
      </DialogTrigger>
      <Portal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("imageForm.copyImageTitle")}</DialogTitle>
            <DialogCloseButton />
          </DialogHeader>
          <DialogBody>
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validate={(values) => validateFormik(values, formikRules, t)}
            >
              {({ dirty, submitForm, isValid }) => {
                return (
                  <Form>
                    <Text>{t("imageForm.copyDescription")}</Text>
                    <ImageUploadFormElement language={i18n.language} />
                    <FormActionsContainer>
                      <Button disabled={!dirty || !isValid} loading={cloneImage.isPending} onClick={submitForm}>
                        {t("save")}
                      </Button>
                    </FormActionsContainer>
                  </Form>
                );
              }}
            </Formik>
          </DialogBody>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};
