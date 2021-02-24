/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC, Fragment } from 'react';
import { injectT, tType } from '@ndla/i18n';
import FormikField from '../../../components/FormikField';
import { NewPodcastMeta } from '../../../modules/audio/audioApiInterfaces';
const contributorTypes = ['creators', 'rightsholders', 'processors'];

interface Props extends NewPodcastMeta {}

const PodcastMetaData: FC<Props & tType> = ({
  t,
  header,
  introduction,
  coverPhotoId,
  coverPhotoAltText,
  manuscript,
}) => {
  return (
    <>
      <FormikField
        label={'header'} // TODO text
        name="header"
        title
        noBorder
        placeholder="header"
      />
      <FormikField
        label={'introduction'} // TODO text
        name="introduction"
        noBorder
        placeholder="introduction"
      />
      <FormikField
        label={'coverPhotoId'} // TODO text
        name="coverPhotoId	"
        noBorder
        placeholder="coverPhotoId"
      />
      <FormikField
        label={'heacoverPhotoAltTextder'} // TODO text
        name="coverPhotoAltText"
        noBorder
        placeholder="coverPhotoAltText"
      />
      <FormikField
        label={'manuscript'} // TODO text
        name="manuscript"
        noBorder
        placeholder="manuscript"
      />
    </>
  );
};

export default injectT(PodcastMetaData);
