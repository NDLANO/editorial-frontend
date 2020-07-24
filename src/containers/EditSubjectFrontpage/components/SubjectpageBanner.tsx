import React, { FC, Fragment, useEffect, useState } from 'react';
import { injectT } from '@ndla/i18n';
import { FieldHeader } from '@ndla/forms';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { FieldProps, FormikHelpers, FormikValues } from 'formik';
import Button from '@ndla/button';
import { TranslateType, VisualElement } from '../../../interfaces';
import * as api from '../../../modules/image/imageApi';
import { Image } from '../../../interfaces';
import VisualElementSearch from '../../VisualElement/VisualElementSearch';
import SubjectpageBannerImage from './SubjectpageBannerImage';

interface Props {
  t: TranslateType;
  field: FieldProps<Image>['field'];
  form: {
    setFieldTouched: FormikHelpers<FormikValues>['setFieldTouched'];
  };
  bannerId: string;
  locale: string;
  isSavingImage: boolean;
  title: string;
}

const SubjectpageBanner: FC<Props> = ({
  t,
  field,
  form,
  bannerId,
  locale,
  title,
}) => {
  const [showImageSelect, setShowImageSelect] = useState(false);
  const [image, setImage] = useState<Image>();

  useEffect(() => {
    onImageFetch();
  }, []);

  const onImageFetch = async () => {
    if (bannerId) {
      const fetchedImage = await api.fetchImage(bannerId, locale);
      setImage(fetchedImage);
    }
  };

  const onImageChange = (image: VisualElement) => {
    setImage(image.metaData);
    updateFormik(image.metaData);
    onImageSelectClose();
  };

  const updateFormik = (value: Image | undefined) => {
    form.setFieldTouched(field.name, true, false);
    field.onChange({
      target: {
        name: field.name,
        value: value?.id || null,
      },
    });
  };

  const onImageSelectClose = () => {
    setShowImageSelect(false);
  };

  const onImageSelectOpen = () => {
    setShowImageSelect(true);
  };

  return (
    <>
      <FieldHeader title={title} />
      <Modal
        controllable
        isOpen={showImageSelect}
        onClose={onImageSelectClose}
        size="large"
        backgroundColor="white"
        minHeight="90vh">
        {() => (
          <Fragment>
            <ModalHeader>
              <ModalCloseButton
                title={t('dialog.close')}
                onClick={onImageSelectClose}
              />
            </ModalHeader>
            <ModalBody>
              <VisualElementSearch
                //TODO Upload image funker ikke, noe jeg mangler med redux?
                // Staten med uploaded image blir borte i stedet for å lagres når den rerendrer
                selectedResource={'image'}
                handleVisualElementChange={onImageChange}
                closeModal={onImageSelectClose}
              />
            </ModalBody>
          </Fragment>
        )}
      </Modal>
      {image ? (
        <SubjectpageBannerImage
          image={image}
          onImageSelectOpen={onImageSelectOpen}
        />
      ) : (
        <Button onClick={onImageSelectOpen}>
          {t('subjectpageForm.addBanner')}
        </Button>
      )}
    </>
  );
};

export default injectT(SubjectpageBanner);
