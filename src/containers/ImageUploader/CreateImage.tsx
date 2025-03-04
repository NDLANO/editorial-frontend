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
import { draftLicensesToImageLicenses } from "../../modules/draft/draftApiUtils";
import { useLicenses } from "../../modules/draft/draftQueries";
import { postImage } from "../../modules/image/imageApi";
import { createFormData } from "../../util/formDataHelper";
import { toEditImage } from "../../util/routeHelpers";

interface Props {
  isNewlyCreated?: boolean;
  editingArticle?: boolean;
  onImageCreated?: (image: IImageMetaInformationV3DTO) => void;
  closeDialog?: () => void;
  inDialog?: boolean;
}

const CreateImage = ({ isNewlyCreated, editingArticle, onImageCreated, inDialog, closeDialog }: Props) => {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const imageLicenses = draftLicensesToImageLicenses(licenses!);
  const navigate = useNavigate();

  const onCreateImage = async (imageMetadata: INewImageMetaInformationV2DTO, image: string | Blob) => {
    const formData = await createFormData(image, imageMetadata);
    const createdImage = await postImage(formData);
    onImageCreated?.(createdImage);
    if (!editingArticle && createdImage.id) {
      navigate(toEditImage(createdImage.id, imageMetadata.language));
    }
  };

  return (
    <ImageForm
      language={locale}
      inDialog={inDialog}
      isNewlyCreated={isNewlyCreated}
      licenses={imageLicenses}
      onSubmitFunc={onCreateImage}
      closeDialog={closeDialog}
      supportedLanguages={[locale]}
    />
  );
};

export default CreateImage;
