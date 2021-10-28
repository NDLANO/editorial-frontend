/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as audioApi from '../../modules/audio/audioApi';
import Spinner from '../../components/Spinner';
import { PodcastSeriesApiType, PodcastSeriesPut } from '../../modules/audio/audioApiInterfaces';
import PodcastSeriesForm from './components/PodcastSeriesForm';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

interface Props {
  podcastSeriesId: number;
  podcastSeriesLanguage: string;
  isNewlyCreated: boolean;
}

const EditPodcastSeries = ({ podcastSeriesId, podcastSeriesLanguage, isNewlyCreated }: Props) => {
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const [podcastSeries, setPodcastSeries] = useState<PodcastSeriesApiType | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const onUpdate = async (newSeries: PodcastSeriesPut): Promise<void> => {
    const updatedSeries = await audioApi.updateSeries(podcastSeriesId, newSeries);
    setPodcastSeries(updatedSeries);
  };

  useEffect(() => {
    const fetchSeries = async () => {
      if (podcastSeriesId) {
        setLoading(true);
        const apiSeries = await audioApi.fetchSeries(podcastSeriesId, podcastSeriesLanguage);
        setPodcastSeries(apiSeries);
        setLoading(false);
      }
    };
    fetchSeries();
  }, [podcastSeriesId, podcastSeriesLanguage]);

  if (loading) {
    return <Spinner />;
  }

  if (!podcastSeries) {
    return <NotFoundPage />;
  }

  const language = podcastSeriesLanguage ?? locale;

  return (
    <PodcastSeriesForm
      podcastSeries={podcastSeries}
      language={language}
      onUpdate={onUpdate}
      isNewlyCreated={isNewlyCreated}
    />
  );
};

export default EditPodcastSeries;
