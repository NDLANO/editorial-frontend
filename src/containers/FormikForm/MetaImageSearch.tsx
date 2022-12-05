/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldHeader } from '@ndla/forms';
import { IImageMetaInformationV3, IUpdateImageMetaInformation } from '@ndla/types-image-api';
import Button from '@ndla/button';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { FormikHandlers, useFormikContext } from 'formik';
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

interface Props {
  metaImageId: string;
  onChange: FormikHandlers['handleChange'];
  name: string;
  setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void;
  onImageLoad?: (event: SyntheticEvent<HTMLImageElement, Event>) => void;
  showRemoveButton: boolean;
  showCheckbox: boolean;
  checkboxAction: (image: IImageMetaInformationV3) => void;
  language?: string;
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
}: Props) => {
  const { t, i18n } = useTranslation();
  const { setFieldValue } = useFormikContext();
  const [showImageSelect, setShowImageSelect] = useState(false);
  const [image, setImage] = useState<IImageMetaInformationV3 | undefined>(undefined);
  const locale = i18n.language;

  useEffect(() => {
    if (metaImageId) {
      fetchImage(parseInt(metaImageId), language).then(image => setImage(image));
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
  const onImageSelectClose = () => {
    setShowImageSelect(false);
  };

  const onImageSet = (image: IImageMetaInformationV3) => {
    onImageSelectClose();
    setImage(image);
    setFieldValue(name, image.id);
    setFieldValue('metaImageAlt', image.alttext.alttext.trim(), true);
    setTimeout(() => {
      setFieldTouched('metaImageAlt', true, true);
      setFieldTouched(name, true, true);
    }, 0);
  };

  const onImageRemove = () => {
    onImageSelectClose();
    setImage(undefined);
    onChangeFormik(null);
  };

  const onImageSelectOpen = () => {
    setShowImageSelect(true);
  };

  const onImageUpdate = async (
    image: IUpdateImageMetaInformation,
    file: string | Blob | undefined,
    id?: number,
  ) => {
    if (id) {
      const updatedImage = await updateImage(id, image);
      onImageSet(updatedImage);
    } else {
      const formData = await createFormData(file, image);
      const createdImage = await postImage(formData);
      onImageSet(createdImage);
    }
  };

  const buttonId = 'popupMetaImageModal';

  return (
    <div>
      <FieldHeader title={t('form.metaImage.title')}>
        <HowToHelper pageId="MetaImage" tooltip={t('form.metaImage.helpLabel')} />
      </FieldHeader>
      <Modal
        labelledBy={buttonId}
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
                language={language}
                closeModal={onImageSelectClose}
                fetchImage={id => fetchImage(id, language)}
                searchImages={searchImages}
                onError={onError}
                updateImage={onImageUpdate}
                image={image}
                showCheckbox={showCheckbox}
                checkboxAction={checkboxAction}
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
        <Button id={buttonId} onClick={onImageSelectOpen}>
          {t('form.metaImage.add')}
        </Button>
      )}
    </div>
  );
};

export default MetaImageSearch;
