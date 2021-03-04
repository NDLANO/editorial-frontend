/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { FC, useContext, useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { LocaleContext } from '../App/App';

import * as audioApi from '../../modules/audio/audioApi';
import { createFormData } from '../../util/formDataHelper';
import { toEditAudio } from '../../util/routeHelpers';
import AudioForm from '../AudioUploader/components/AudioForm';
import { License } from '../../interfaces';
import { fetchLicenses } from '../../modules/draft/draftApi';
import PodcastForm from './components/PodcastForm';

// Props
//   history: RouteComponentProps['history'];
interface Props {
  history: RouteComponentProps['history'];
}

const CreatePodcast: FC<Props> = ({}) => {
  const locale: string = useContext(LocaleContext);
  const [licenses, setLicenses] = useState<License[]>([]);

  useEffect(() => {
    getLicenses();
  }, []);

  const getLicenses = async () => {
    const license = await fetchLicenses();
    setLicenses(license);
  };

  return (
    <>
      <PodcastForm audio={{ language: locale }} /> // PodcastForm men skal ha mange av de samme
      feltene som Audio
    </>
  );
};

export default CreatePodcast;

// const CreatePodcast = ({ history, locale, }) => {
//   const onCreateAudio = async (newAudio, file) => {
//     const formData = await createFormData(file, newAudio);
//     const createdAudio = await audioApi.postAudio(formData);
//     if (!newAudio.id) {
//       history.push(toEditAudio(createdAudio.id, newAudio.language));
//     }
//   };
// };

// CreateAudio.propTypes = {
//   tags: PropTypes.arrayOf(PropTypes.string).isRequired,
//   licenses: PropTypes.arrayOf(
//     PropTypes.shape({
//       description: PropTypes.string,
//       license: PropTypes.string,
//     }),
//   ).isRequired,
//   history: PropTypes.shape({
//     push: PropTypes.func.isRequired,
//   }).isRequired,
//   locale: PropTypes.string.isRequired,
// };
