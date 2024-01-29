/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormikHandlers, useFormikContext } from "formik";
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ButtonV2 } from "@ndla/button";
import { FieldHeader } from "@ndla/forms";
import { ModalBody, ModalCloseButton, Modal, ModalHeader, ModalTrigger, ModalContent } from "@ndla/modal";
import { IImageMetaInformationV3, IUpdateImageMetaInformation } from "@ndla/types-backend/image-api";
import MetaImageField from "./components/MetaImageField";
import ImageSearchAndUploader from "../../components/ControlledImageSearchAndUploader";
import HowToHelper from "../../components/HowTo/HowToHelper";
import { postImage, updateImage, searchImages, fetchImage, onError } from "../../modules/image/imageApi";
import { createFormData } from "../../util/formDataHelper";

interface Props {
  metaImageId: string;
  onChange: FormikHandlers["handleChange"];
  name: string;
  setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void;
  onImageLoad?: (width: number, height: number) => void;
  showRemoveButton: boolean;
  showCheckbox: boolean;
  checkboxAction: (image: IImageMetaInformationV3) => void;
  language?: string;
  podcastFriendly?: boolean;
  disableAltEditing?: boolean;
}

const MetaImageSearch = ({
  name,
  metaImageId,
  showRemoveButton,
  setFieldTouched,
  onChange,
  onImageLoad,
  showCheckbox,
  checkboxAction,
  language,
  podcastFriendly,
  disableAltEditing,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { setFieldValue } = useFormikContext();
  const [showImageSelect, setShowImageSelect] = useState(false);
  const [image, setImage] = useState<IImageMetaInformationV3 | undefined>(undefined);
  const locale = i18n.language;

  useEffect(() => {
    if (metaImageId) {
      fetchImage(parseInt(metaImageId), language).then((image) => setImage(image));
    } else {
      setImage(undefined);
    }
  }, [metaImageId, language]);

  const onChangeFormik = (id: string | null) => {
    onChange({
      target: {
        name,
        value: id,
      },
    });
  };
  const onImageSelectClose = useCallback(() => setShowImageSelect(false), []);

  const onImageSet = (image: IImageMetaInformationV3) => {
    setShowImageSelect(false);
    setImage(image);
    setFieldValue(name, image.id);
    setFieldValue("metaImageAlt", disableAltEditing ? "" : image.alttext.alttext.trim(), true);
    setTimeout(() => {
      setFieldTouched("metaImageAlt", true, true);
      setFieldTouched(name, true, true);
    }, 0);
  };

  const onImageRemove = () => {
    setShowImageSelect(false);
    setImage(undefined);
    onChangeFormik(null);
  };

  const onImageUpdate = async (image: IUpdateImageMetaInformation, file: string | Blob | undefined, id?: number) => {
    if (id) {
      const updatedImage = await updateImage(id, image);
      onImageSet(updatedImage);
    } else {
      const formData = await createFormData(file, image);
      const createdImage = await postImage(formData);
      onImageSet(createdImage);
    }
  };

  return (
    <div>
      <FieldHeader title={t("form.metaImage.title")}>
        <HowToHelper pageId="MetaImage" tooltip={t("form.metaImage.helpLabel")} />
      </FieldHeader>
      <Modal open={showImageSelect} onOpenChange={setShowImageSelect}>
        {!image && (
          <ModalTrigger>
            <ButtonV2>{t("form.metaImage.add")}</ButtonV2>
          </ModalTrigger>
        )}
        <ModalContent size={{ width: "large", height: "large" }}>
          <ModalHeader>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <ImageSearchAndUploader
              inModal={true}
              onImageSelect={onImageSet}
              locale={locale}
              language={language}
              closeModal={onImageSelectClose}
              fetchImage={(id) => fetchImage(id, language)}
              searchImages={searchImages}
              onError={onError}
              updateImage={onImageUpdate}
              image={image}
              showCheckbox={showCheckbox}
              checkboxAction={checkboxAction}
              podcastFriendly={podcastFriendly}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      {!showImageSelect && image && (
        <MetaImageField
          image={image}
          onImageRemove={onImageRemove}
          showRemoveButton={showRemoveButton}
          onImageLoad={onImageLoad}
          disableAltEditing={disableAltEditing}
        />
      )}
    </div>
  );
};

export default MetaImageSearch;
