/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldHeader } from '@ndla/forms';
import { FieldProps, FormikHelpers, FormikValues } from 'formik';
import Button from '@ndla/button';
import { ImageEmbed } from '../../../interfaces';
import VisualElementSearch from '../../VisualElement/VisualElementSearch';
import SubjectpageBannerImage from './SubjectpageBannerImage';
import Lightbox from '../../../components/Lightbox';
import { ImageApiType } from '../../../modules/image/imageApiInterfaces';

interface Props {
  field: FieldProps<ImageApiType | undefined>['field'];
  form: {
    setFieldTouched: FormikHelpers<FormikValues>['setFieldTouched'];
  };
  title: string;
}

const SubjectpageBanner = ({ field, form, title }: Props) => {
  const { t } = useTranslation();
  const [showImageSelect, setShowImageSelect] = useState(false);

  const onImageChange = (image: ImageEmbed) => {
    updateFormik(image);
    onImageSelectClose();
  };

  const updateFormik = (value?: ImageEmbed) => {
    form.setFieldTouched(field.name, true, false);
    field.onChange({
      target: {
        name: field.name,
        value: value || null,
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
      {showImageSelect && (
        <Lightbox display appearance={'big'} onClose={onImageSelectClose}>
          <VisualElementSearch
            selectedResource={'image'}
            handleVisualElementChange={onImageChange}
            closeModal={onImageSelectClose}
          />
        </Lightbox>
      )}
      {field.value ? (
        <SubjectpageBannerImage image={field.value} onImageSelectOpen={onImageSelectOpen} />
      ) : (
        <Button onClick={onImageSelectOpen}>{t('subjectpageForm.addBanner')}</Button>
      )}
    </>
  );
};

export default SubjectpageBanner;
