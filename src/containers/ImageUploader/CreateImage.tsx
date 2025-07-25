/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { IImageMetaInformationV3DTO, INewImageMetaInformationV2DTO } from "@ndla/types-backend/image-api";
import ImageForm from "./components/ImageForm";
import { postImage } from "../../modules/image/imageApi";
import { toEditImage } from "../../util/routeHelpers";

interface Props {
  editingArticle?: boolean;
  onImageCreated?: (image: IImageMetaInformationV3DTO) => void;
  closeDialog?: () => void;
  inDialog?: boolean;
}

const CreateImage = ({ editingArticle, onImageCreated, inDialog, closeDialog }: Props) => {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const navigate = useNavigate();

  const onCreateImage = async (imageMetadata: INewImageMetaInformationV2DTO, image: string | Blob) => {
    if (image instanceof Blob) {
      const createdImage = await postImage(imageMetadata, image);
      onImageCreated?.(createdImage);
      if (!editingArticle && createdImage.id) {
        navigate(toEditImage(createdImage.id, imageMetadata.language), { state: { isNewlyCreated: true } });
      }
    }
  };

  return (
    <ImageForm
      language={locale}
      inDialog={inDialog}
      onSubmitFunc={onCreateImage}
      closeDialog={closeDialog}
      translatedFieldsToNN={[]}
    />
  );
};

export default CreateImage;
