/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';
import * as messageActions from '../Messages/messagesActions';
import ImageForm from './components/ImageForm';
import { ImageApiType, UpdatedImageMetadata } from '../../modules/image/imageApiInterfaces';
import { License } from '../../interfaces';
import { fetchLicenses } from '../../modules/draft/draftApi';
import { fetchImage, updateImage } from '../../modules/image/imageApi';
import { NewReduxMessage } from '../Messages/messagesSelectors';

interface BaseProps {
  imageId?: string;
  imageLanguage?: string;
  isNewlyCreated?: boolean;
}

type Props = BaseProps & PropsFromRedux;

const EditImage = ({
  imageId,
  imageLanguage,
  isNewlyCreated,
  applicationError,
  createMessage,
}: Props) => {
  const { i18n } = useTranslation();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [image, setImage] = useState<ImageApiType | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const lic = await fetchLicenses();
      setLicenses(lic);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (imageId) {
        const img = await fetchImage(parseInt(imageId), imageLanguage);
        setImage(img);
      }
    })();
  }, [imageLanguage, imageId]);

  const onUpdate = async (updatedImage: UpdatedImageMetadata) => {
    try {
      const res = await updateImage(updatedImage);
      setImage(res);
    } catch (e) {
      applicationError(e);
      createMessage(e.messages);
    }
  };

  return (
    <ImageForm
      language={imageLanguage ?? i18n.language}
      image={image}
      onUpdate={onUpdate}
      isNewlyCreated={isNewlyCreated}
      licenses={licenses}
    />
  );
};

const mapDispatchToProps = {
  createMessage: (message: NewReduxMessage) => messageActions.addMessage(message),
  applicationError: messageActions.applicationError,
};

const reduxConnector = connect(undefined, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof reduxConnector>;

export default reduxConnector(EditImage);
