/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IImageMetaInformationV2, INewImageMetaInformationV2 } from '@ndla/types-image-api';
import ImageForm from './components/ImageForm';
import { createFormData } from '../../util/formDataHelper';
import { postImage } from '../../modules/image/imageApi';
import { toEditImage } from '../../util/routeHelpers';
import { useLicenses } from '../../modules/draft/draftQueries';
import { draftLicensesToImageLicenses } from '../../modules/draft/draftApiUtils';

interface Props {
  isNewlyCreated?: boolean;
  editingArticle?: boolean;
  onImageCreated?: (image: IImageMetaInformationV2) => void;
  closeModal?: () => void;
  inModal?: boolean;
}

const CreateImage = ({
  isNewlyCreated,
  editingArticle,
  onImageCreated,
  inModal,
  closeModal,
}: Props) => {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const { data: licenses } = useLicenses({ placeholderData: [] });
  const imageLicenses = draftLicensesToImageLicenses(licenses!);
  const navigate = useNavigate();

  const onCreateImage = async (imageMetadata: INewImageMetaInformationV2, image: string | Blob) => {
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
      inModal={inModal}
      isNewlyCreated={isNewlyCreated}
      licenses={imageLicenses}
      onSubmitFunc={onCreateImage}
      closeModal={closeModal}
    />
  );
};

export default CreateImage;
