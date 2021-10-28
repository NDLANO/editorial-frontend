/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as audioApi from '../../modules/audio/audioApi';
import { PodcastSeriesPost } from '../../modules/audio/audioApiInterfaces';
import { toEditPodcastSeries } from '../../util/routeHelpers';
import PodcastSeriesForm from './components/PodcastSeriesForm';

interface Props {
  history: RouteComponentProps['history'];
}

const CreatePodcastSeries = ({ history }: Props) => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  const onUpdate = async (newSeries: PodcastSeriesPost): Promise<void> => {
    const createdSeries = await audioApi.postSeries(newSeries);
    history.push(toEditPodcastSeries(createdSeries.id, newSeries.language));
  };

  return <PodcastSeriesForm language={locale} onUpdate={onUpdate} isNewlyCreated={false} />;
};

export default CreatePodcastSeries;
