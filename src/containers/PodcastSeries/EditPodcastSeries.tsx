/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useContext, useEffect, useState } from 'react';
import { LocaleContext } from '../App/App';
import * as audioApi from '../../modules/audio/audioApi';
import { transformSeries } from '../../util/audioHelpers';
import Spinner from '../../components/Spinner';
import { FlattenedPodcastSeries, NewPodcastSeries } from '../../modules/audio/audioApiInterfaces';
import PodcastSeriesForm from './components/PodcastSeriesForm';

interface Props {
  podcastSeriesId: number;
  podcastSeriesLanguage: string;
  isNewlyCreated: boolean;
}

const EditPodcastSeries = ({ podcastSeriesId, podcastSeriesLanguage, isNewlyCreated }: Props) => {
  const locale: string = useContext(LocaleContext);
  const [podcastSeries, setPodcastSeries] = useState<FlattenedPodcastSeries | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  const onUpdate = async (newSeries: NewPodcastSeries): Promise<void> => {
    const updatedSeries = await audioApi.updateSeries(podcastSeriesId, newSeries);
    const transformed = transformSeries(updatedSeries, podcastSeriesLanguage);
    setPodcastSeries(transformed);
  };

  useEffect(() => {
    const fetchSeries = async () => {
      if (podcastSeriesId) {
        setLoading(true);
        const apiSeries = await audioApi.fetchSeries(podcastSeriesId, podcastSeriesLanguage);
        const transformed = transformSeries(apiSeries, podcastSeriesLanguage);
        setPodcastSeries(transformed);
        setLoading(false);
      }
    };
    fetchSeries();
  }, [podcastSeriesId, podcastSeriesLanguage]);

  if (loading) {
    return <Spinner />;
  }

  if (podcastSeries === undefined) {
    return null;
  }

  const language = podcastSeriesLanguage ?? locale;

  return (
    <PodcastSeriesForm
      podcastSeries={{ ...podcastSeries, language }}
      onUpdate={onUpdate}
      isNewlyCreated={isNewlyCreated}
    />
  );
};

export default EditPodcastSeries;
