/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ImageForm from './components/ImageForm';
import { ImageApiType, UpdatedImageMetadata } from '../../modules/image/imageApiInterfaces';
import { fetchImage, updateImage } from '../../modules/image/imageApi';
import { useLicenses } from '../Licenses/LicensesProvider';
import { useMessages } from '../Messages/MessagesProvider';
import { createFormData } from '../../util/formDataHelper';

interface Props {
  imageId?: string;
  imageLanguage?: string;
  isNewlyCreated?: boolean;
}

const EditImage = ({ imageId, imageLanguage, isNewlyCreated }: Props) => {
  const { i18n } = useTranslation();
  const { licenses } = useLicenses();
  const { applicationError, createMessage } = useMessages();
  const [image, setImage] = useState<ImageApiType | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (imageId) {
        const img = await fetchImage(parseInt(imageId), imageLanguage);
        setImage(img);
      }
    })();
  }, [imageLanguage, imageId]);

  const onUpdate = async (updatedImage: UpdatedImageMetadata, image: string | Blob) => {
    const formData = await createFormData(image, updatedImage);

    try {
      const res = await updateImage(updatedImage, formData);
      setImage(res);
    } catch (e) {
      applicationError(e);
      createMessage(e.messages);
    }
  };

  return (
    <ImageForm
      language={imageLanguage ?? i18n.language}
      image={image}
      onUpdate={onUpdate}
      isNewlyCreated={isNewlyCreated}
      licenses={licenses}
    />
  );
};

export default EditImage;
