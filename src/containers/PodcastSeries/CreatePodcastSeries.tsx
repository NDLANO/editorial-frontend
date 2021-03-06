/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { LocaleContext } from '../App/App';
import * as audioApi from '../../modules/audio/audioApi';
import { NewPodcastSeries } from '../../modules/audio/audioApiInterfaces';
import { toEditPodcastSeries } from '../../util/routeHelpers';
import PodcastSeriesForm from './components/PodcastSeriesForm';

interface Props {
  history: RouteComponentProps['history'];
}

const CreatePodcastSeries = ({ history }: Props) => {
  const locale: string = useContext(LocaleContext);

  const onUpdate = async (newSeries: NewPodcastSeries): Promise<void> => {
    const createdSeries = await audioApi.postSeries(newSeries);
    history.push(toEditPodcastSeries(createdSeries.id, newSeries.language));
  };

  return (
    <PodcastSeriesForm
      podcastSeries={{ language: locale }}
      onUpdate={onUpdate}
      isNewlyCreated={false}
    />
  );
};

export default CreatePodcastSeries;
