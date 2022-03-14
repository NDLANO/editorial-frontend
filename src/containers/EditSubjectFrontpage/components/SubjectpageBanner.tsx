/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldHeader } from '@ndla/forms';
import { useField, useFormikContext } from 'formik';
import Button from '@ndla/button';
import { ImageEmbed } from '../../../interfaces';
import VisualElementSearch from '../../VisualElement/VisualElementSearch';
import SubjectpageBannerImage from './SubjectpageBannerImage';
import Lightbox from '../../../components/Lightbox';

interface Props {
  title: string;
  fieldName: string;
}

const SubjectpageBanner = ({ title, fieldName }: Props) => {
  const { t } = useTranslation();
  const { setFieldTouched } = useFormikContext();
  const [FieldInputProps] = useField<ImageEmbed>(fieldName);
  const { onChange, value: fieldValue } = FieldInputProps;
  const [showImageSelect, setShowImageSelect] = useState(false);

  const onImageChange = (image: ImageEmbed) => {
    updateFormik(image);
    onImageSelectClose();
  };

  const updateFormik = (value?: ImageEmbed) => {
    onChange({ target: { name: fieldName, value: value } });
    setFieldTouched(fieldName, true, false);
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
            handleVisualElementChange={rt =>
              rt.type === 'embed' ? onImageChange(rt.value as ImageEmbed) : null
            }
            closeModal={onImageSelectClose}
          />
        </Lightbox>
      )}
      {fieldValue ? (
        <SubjectpageBannerImage image={fieldValue} onImageSelectOpen={onImageSelectOpen} />
      ) : (
        <Button onClick={onImageSelectOpen}>{t('subjectpageForm.addBanner')}</Button>
      )}
    </>
  );
};

export default SubjectpageBanner;
