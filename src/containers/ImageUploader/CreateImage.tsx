/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ImageForm from './components/ImageForm';
import { createFormData } from '../../util/formDataHelper';
import * as imageApi from '../../modules/image/imageApi';
import { toEditImage } from '../../util/routeHelpers';
import { ImageApiType, NewImageMetadata } from '../../modules/image/imageApiInterfaces';
import { useLicenses } from '../Licenses/LicensesProvider';

interface Props {
  isNewlyCreated?: boolean;
  editingArticle?: boolean;
  onImageCreated?: (image: ImageApiType) => void;
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
  const { imageLicenses } = useLicenses();
  const navigate = useNavigate();

  const onCreateImage = async (imageMetadata: NewImageMetadata, image: string | Blob) => {
    const formData = await createFormData(image, imageMetadata);
    const createdImage = await imageApi.postImage(formData);
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
      onUpdate={onCreateImage}
      closeModal={closeModal}
    />
  );
};

export default CreateImage;
