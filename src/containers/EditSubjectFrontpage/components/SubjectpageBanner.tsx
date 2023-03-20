/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalBody, ModalV2 } from '@ndla/modal';
import { FieldHeader } from '@ndla/forms';
import { useField, useFormikContext } from 'formik';
import { ButtonV2 } from '@ndla/button';
import { Embed, ImageEmbed } from '../../../interfaces';
import VisualElementSearch from '../../VisualElement/VisualElementSearch';
import SubjectpageBannerImage from './SubjectpageBannerImage';
import { isEmbed } from '../../../components/SlateEditor/plugins/blockPicker/SlateVisualElementPicker';

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

  const onImageChange = (image: Embed) => {
    updateFormik(image);
    onImageSelectClose();
  };

  const updateFormik = (value?: Embed) => {
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
      {fieldValue ? (
        <SubjectpageBannerImage image={fieldValue} onImageSelectOpen={onImageSelectOpen} />
      ) : (
        <ButtonV2 onClick={onImageSelectOpen}>{t('subjectpageForm.addBanner')}</ButtonV2>
      )}

      <ModalV2 controlled isOpen={showImageSelect} onClose={onImageSelectClose} size="large">
        {(close) => (
          <ModalBody>
            <VisualElementSearch
              selectedResource={'image'}
              closeModal={close}
              handleVisualElementChange={(rt) => isEmbed(rt) && onImageChange(rt)}
            />
          </ModalBody>
        )}
      </ModalV2>
    </>
  );
};

export default SubjectpageBanner;
