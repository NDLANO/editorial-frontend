/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { LocaleContext } from '../App/App';
import ImageForm from './components/ImageForm';
import { createFormData } from '../../util/formDataHelper';
import * as imageApi from '../../modules/image/imageApi';
import { toEditImage } from '../../util/routeHelpers';
import { License } from '../../interfaces';
import { ImageApiType, NewImageMetadata } from '../../modules/image/imageApiInterfaces';
import { fetchLicenses } from '../../modules/draft/draftApi';
import { draftLicensesToImageLicenses } from '../../modules/draft/draftApiUtils';

interface Props extends RouteComponentProps {
  isNewlyCreated?: boolean;
  editingArticle?: boolean;
  onImageCreated?: (image: ImageApiType) => void;
  closeModal?: () => void;
  inModal?: boolean;
}

const CreateImage = ({
  history,
  isNewlyCreated,
  editingArticle,
  onImageCreated,
  inModal,
  closeModal,
}: Props) => {
  const locale: string = useContext(LocaleContext);
  const [licenses, setLicenses] = useState<License[]>([]);

  useEffect(() => {
    getLicenses();
  }, []);

  const getLicenses = async () => {
    const license = await fetchLicenses();
    setLicenses(license);
  };

  const onCreateImage = async (imageMetadata: NewImageMetadata, image: string | Blob) => {
    const formData = await createFormData(image, imageMetadata);
    const createdImage = await imageApi.postImage(formData);
    onImageCreated?.(createdImage);
    if (!editingArticle && createdImage.id) {
      history.push(toEditImage(createdImage.id, imageMetadata.language));
    }
  };

  return (
    <ImageForm
      language={locale}
      inModal={inModal}
      isNewlyCreated={isNewlyCreated}
      licenses={draftLicensesToImageLicenses(licenses)}
      onUpdate={onCreateImage}
      closeModal={closeModal}
    />
  );
};

export default withRouter(CreateImage);
