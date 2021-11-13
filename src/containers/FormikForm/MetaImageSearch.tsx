/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect, SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldHeader } from '@ndla/forms';
import Button from '@ndla/button';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { FormikHandlers } from 'formik';
import { createFormData } from '../../util/formDataHelper';
import {
  postImage,
  updateImage,
  searchImages,
  fetchImage,
  onError,
} from '../../modules/image/imageApi';
import HowToHelper from '../../components/HowTo/HowToHelper';
import ImageSearchAndUploader from '../../components/ControlledImageSearchAndUploader';

import MetaImageField from './components/MetaImageField';
import { ImageApiType, UpdatedImageMetadata } from '../../modules/image/imageApiInterfaces';

interface Props {
  metaImageId: string;
  onChange: FormikHandlers['handleChange'];
  name: string;
  setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void;
  onImageLoad?: (event: SyntheticEvent<HTMLImageElement, Event>) => void;
  showRemoveButton: boolean;
}

const MetaImageSearch = ({
  name,
  metaImageId,
  showRemoveButton,
  setFieldTouched,
  onChange,
  onImageLoad,
}: Props) => {
  const { t, i18n } = useTranslation();
  const [showImageSelect, setShowImageSelect] = useState(false);
  const [image, setImage] = useState<ImageApiType | undefined>(undefined);
  const locale = i18n.language;

  useEffect(() => {
    if (metaImageId) {
      fetchImage(parseInt(metaImageId), locale).then(image => setImage(image));
    } else {
      setImage(undefined);
    }
  }, [metaImageId, locale]);

  const onChangeFormik = (id: string | null) => {
    onChange({
      target: {
        name,
        value: id,
      },
    });
  };
  const onImageSelectClose = () => {
    setFieldTouched('metaImageAlt', true, true);
    setShowImageSelect(false);
  };

  const onImageSet = (image: ImageApiType) => {
    onImageSelectClose();
    setImage(image);
    onChangeFormik(image.id);
  };

  const onImageRemove = () => {
    onImageSelectClose();
    setImage(undefined);
    onChangeFormik(null);
  };

  const onImageSelectOpen = () => {
    setShowImageSelect(true);
  };

  const onImageUpdate = async (image: UpdatedImageMetadata, file: string | Blob | undefined) => {
    if (image.id) {
      const updatedImage = await updateImage(image);
      onImageSet(updatedImage);
    } else {
      const formData = await createFormData(file, image);
      const createdImage = await postImage(formData);
      onImageSet(createdImage);
    }
  };

  return (
    <div>
      <FieldHeader title={t('form.metaImage.title')}>
        <HowToHelper pageId="MetaImage" tooltip={t('form.metaImage.helpLabel')} />
      </FieldHeader>
      <Modal
        controllable
        isOpen={showImageSelect}
        onClose={onImageSelectClose}
        size="large"
        backgroundColor="white"
        minHeight="90vh">
        {() => (
          <>
            <ModalHeader>
              <ModalCloseButton title={t('dialog.close')} onClick={onImageSelectClose} />
            </ModalHeader>
            <ModalBody>
              <ImageSearchAndUploader
                inModal={true}
                onImageSelect={onImageSet}
                locale={locale}
                closeModal={onImageSelectClose}
                fetchImage={id => fetchImage(id, locale)}
                searchImages={searchImages}
                onError={onError}
                updateImage={onImageUpdate}
                image={image}
              />
            </ModalBody>
          </>
        )}
      </Modal>

      {!showImageSelect && image ? (
        <MetaImageField
          image={image}
          onImageSelectOpen={onImageSelectOpen}
          onImageRemove={onImageRemove}
          showRemoveButton={showRemoveButton}
          onImageLoad={onImageLoad}
        />
      ) : (
        <Button onClick={onImageSelectOpen}>{t('form.metaImage.add')}</Button>
      )}
    </div>
  );
};

export default MetaImageSearch;
