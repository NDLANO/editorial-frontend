/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { FieldHeader } from '@ndla/forms';
import Button from '@ndla/button';
import { ModalCloseButton } from '@ndla/modal';
import { LocaleContext } from '../App/App';
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

import FormikMetaImage from './components/FormikMetaImage';

const FormikMetaImageSearch = ({
  name,
  metaImageId,
  showRemoveButton,
  setFieldTouched,
  onChange,
  t,
}) => {
  const [showImageSelect, setShowImageSelect] = useState(false);
  const [image, setImage] = useState(undefined);
  const locale = useContext(LocaleContext);

  const fetchImageWithLocale = id => fetchImage(id, locale);
  useEffect(() => {
    if (metaImageId) {
      fetchImageWithLocale(metaImageId).then(image => setImage(image));
    } else {
      setImage(undefined);
    }
  }, [metaImageId]);

  const onChangeFormik = value => {
    onChange({
      target: {
        name,
        value: value,
      },
    });
  };
  const onImageSelectClose = () => {
    setFieldTouched('metaImageAlt', true, true);
    setShowImageSelect(false);
  };

  const onImageSet = image => {
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

  return (
    <div>
      <FieldHeader title={t('form.metaImage.title')}>
        <HowToHelper pageId="MetaImage" tooltip={t('form.metaImage.helpLabel')} />
      </FieldHeader>
      {showImageSelect && (
        <>
          <ImageSearchAndUploader
            onImageSelect={onImageSet}
            locale={locale}
            closeModal={onImageSelectClose}
            fetchImage={fetchImageWithLocale}
            searchImages={searchImages}
            onError={onError}
            updateImage={(image, file) => {
              if (image.id) {
                updateImage(image).then(updatedImage => onImageSet(updatedImage));
              } else {
                createFormData(file, image).then(formData =>
                  postImage(formData).then(createdImage => {
                    onImageSet({ ...createdImage, language: locale });
                  }),
                );
              }
            }}
            image={image}
          />
        </>
      )}

      {!showImageSelect && image ? (
        <FormikMetaImage
          image={image}
          onImageSelectOpen={onImageSelectOpen}
          onImageRemove={onImageRemove}
          showRemoveButton={showRemoveButton}
        />
      ) : (
        <Button onClick={onImageSelectOpen}>{t('form.metaImage.add')}</Button>
      )}
    </div>
  );
};

FormikMetaImageSearch.propTypes = {
  metaImageId: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  isSavingImage: PropTypes.bool,
  setFieldTouched: PropTypes.func.isRequired,
  showRemoveButton: PropTypes.bool,
};

export default injectT(FormikMetaImageSearch);
