/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalBody, Modal } from '@ndla/modal';
import { FieldHeader } from '@ndla/forms';
import { useField, useFormikContext } from 'formik';
import { ButtonV2 } from '@ndla/button';
import { IImageMetaInformationV3 } from '@ndla/types-backend/image-api';
import { ImageEmbed } from '../../../interfaces';
import SubjectpageBannerImage from './SubjectpageBannerImage';
import ImageSearchAndUploader from '../../../components/ImageSearchAndUploader';
import { fetchImage, onError, searchImages } from '../../../modules/image/imageApi';
import { SubjectPageFormikType } from '../../../util/subjectHelpers';

interface Props {
  title: string;
  fieldName: 'desktopBannerId' | 'mobileBannerId';
}

const SubjectpageBanner = ({ title, fieldName }: Props) => {
  const { t, i18n } = useTranslation();
  const { setFieldTouched } = useFormikContext();
  const [image, setImage] = useState<IImageMetaInformationV3 | undefined>(undefined);
  const [FieldInputProps] = useField<ImageEmbed>(fieldName);
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
    onImageSelectClose();
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
    <>
      <FieldHeader title={title} />
      {image ? (
        <SubjectpageBannerImage image={image} onImageSelectOpen={onImageSelectOpen} />
      ) : (
        <ButtonV2 onClick={onImageSelectOpen}>{t('subjectpageForm.addBanner')}</ButtonV2>
      )}

      <Modal controlled isOpen={showImageSelect} onClose={onImageSelectClose} size="large">
        {(close) => (
          <ModalBody>
            <ImageSearchAndUploader
              inModal
              locale={i18n.language}
              language={values.language}
              closeModal={close}
              fetchImage={(id) => fetchImage(id, values.language)}
              searchImages={searchImages}
              onError={onError}
              onImageSelect={onImageChange}
            />
          </ModalBody>
        )}
      </Modal>
    </>
  );
};

export default SubjectpageBanner;
