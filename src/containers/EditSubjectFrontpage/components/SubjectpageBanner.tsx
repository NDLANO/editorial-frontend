/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useField, useFormikContext } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ButtonV2 } from "@ndla/button";
import { ModalBody, Modal, ModalTrigger, ModalContent } from "@ndla/modal";
import { IImageMetaInformationV3 } from "@ndla/types-backend/image-api";
import { ImageEmbedData } from "@ndla/types-embed";
import SubjectpageBannerImage from "./SubjectpageBannerImage";
import FieldHeader from "../../../components/Field/FieldHeader";
import ImageSearchAndUploader from "../../../components/ImageSearchAndUploader";
import { fetchImage, onError, postSearchImages } from "../../../modules/image/imageApi";
import { SubjectPageFormikType } from "../../../util/subjectHelpers";

interface Props {
  title: string;
  fieldName: "desktopBannerId" | "mobileBannerId";
}

const SubjectpageBanner = ({ title, fieldName }: Props) => {
  const { t, i18n } = useTranslation();
  const { setFieldTouched } = useFormikContext();
  const [image, setImage] = useState<IImageMetaInformationV3 | undefined>(undefined);
  const [FieldInputProps] = useField<ImageEmbedData>(fieldName);
  const { onChange } = FieldInputProps;
  const [showImageSelect, setShowImageSelect] = useState(false);
  const { values } = useFormikContext<SubjectPageFormikType>();

  useEffect(() => {
    (async () => {
      if ((!image && values[fieldName]) || (image && parseInt(image.id) !== values[fieldName])) {
        const fetchedImage = await fetchImage(values[fieldName] as number, values.language);
        setImage(fetchedImage);
      }
    })();
  }, [image, values, fieldName]);

  const onImageChange = (image: IImageMetaInformationV3) => {
    setImage(image);
    updateFormik(parseInt(image.id));
    setShowImageSelect(false);
  };

  const updateFormik = (value?: number) => {
    onChange({ target: { name: fieldName, value: value } });
    setFieldTouched(fieldName, true, false);
  };

  const onImageSelectClose = useCallback(() => {
    setShowImageSelect(false);
  }, []);

  const onImageSelectOpen = useCallback(() => {
    setShowImageSelect(true);
  }, []);

  return (
    <Modal open={showImageSelect} onOpenChange={setShowImageSelect}>
      <FieldHeader title={title} />
      {image && <SubjectpageBannerImage image={image} onImageSelectOpen={onImageSelectOpen} />}
      {!image && (
        <ModalTrigger>
          <ButtonV2>{t("subjectpageForm.addBanner")}</ButtonV2>
        </ModalTrigger>
      )}
      <ModalContent size="large">
        <ModalBody>
          <ImageSearchAndUploader
            inModal
            locale={i18n.language}
            language={values.language}
            closeModal={onImageSelectClose}
            fetchImage={(id) => fetchImage(id, values.language)}
            searchImages={postSearchImages}
            onError={onError}
            onImageSelect={onImageChange}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SubjectpageBanner;
