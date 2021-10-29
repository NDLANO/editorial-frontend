/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ImageForm from './components/ImageForm';
import { createFormData } from '../../util/formDataHelper';
import * as imageApi from '../../modules/image/imageApi';
import { toEditImage } from '../../util/routeHelpers';
import { NewImageMetadata } from '../../modules/image/imageApiInterfaces';
import { useLicenses } from '../Licenses/LicensesProvider';

interface Props extends RouteComponentProps {
  isNewlyCreated?: boolean;
  showSaved?: boolean;
}

const CreateImage = ({ history, isNewlyCreated, showSaved }: Props) => {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const { imageLicenses } = useLicenses();

  const onCreateImage = async (imageMetadata: NewImageMetadata, image: string | Blob) => {
    const formData = await createFormData(image, imageMetadata);
    const createdImage = await imageApi.postImage(formData);
    if (!imageMetadata.id) {
      history.push(toEditImage(createdImage.id, imageMetadata.language));
    }
  };

  return (
    <ImageForm
      image={{ language: locale }}
      inModal={false}
      isLoading={false}
      isNewlyCreated={isNewlyCreated}
      licenses={imageLicenses}
      onUpdate={onCreateImage}
    />
  );
};

export default withRouter(CreateImage);
