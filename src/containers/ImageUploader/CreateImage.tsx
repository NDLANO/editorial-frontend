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
import { NewImageMetadata } from '../../modules/image/imageApiInterfaces';
import { fetchLicenses } from '../../modules/draft/draftApi';
import { draftLicensesToImageLicenses } from '../../modules/draft/draftApiUtils';

interface Props extends RouteComponentProps {
  isNewlyCreated?: boolean;
  showSaved?: boolean;
}

const CreateImage = ({ history, isNewlyCreated, showSaved }: Props & RouteComponentProps) => {
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
    if (!imageMetadata.id) {
      history.push(toEditImage(createdImage.id, imageMetadata.language));
    }
  };

  return (
    <ImageForm
      image={{ language: locale }}
      inModal={false}
      isNewlyCreated={isNewlyCreated}
      licenses={draftLicensesToImageLicenses(licenses)}
      onUpdate={onCreateImage}
    />
  );
};

export default withRouter(CreateImage);
