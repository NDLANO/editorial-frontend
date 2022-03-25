/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { ISeries, INewSeries } from '@ndla/types-audio-api';

import { fetchSeries, updateSeries } from '../../modules/audio/audioApi';
import Spinner from '../../components/Spinner';
import PodcastSeriesForm from './components/PodcastSeriesForm';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

interface Props {
  isNewlyCreated?: boolean;
}

const EditPodcastSeries = ({ isNewlyCreated }: Props) => {
  const params = useParams<'id' | 'selectedLanguage'>();
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const [podcastSeries, setPodcastSeries] = useState<ISeries | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const seriesId = Number(params.id) || undefined;
  const seriesLanguage = params.selectedLanguage ?? locale;

  useEffect(() => {
    (async () => {
      if (seriesId) {
        setLoading(true);
        const apiSeries = await fetchSeries(seriesId, seriesLanguage);
        setPodcastSeries(apiSeries);
        setLoading(false);
      }
    })();
  }, [seriesId, seriesLanguage]);

  if (loading) {
    return <Spinner />;
  }

  if (!podcastSeries || !seriesId) {
    return <NotFoundPage />;
  }

  const onUpdate = async (newSeries: INewSeries): Promise<void> => {
    const updatedSeries = await updateSeries(seriesId, newSeries);
    setPodcastSeries(updatedSeries);
  };

  return (
    <PodcastSeriesForm
      podcastSeries={podcastSeries}
      language={seriesLanguage}
      onUpdate={onUpdate}
      isNewlyCreated={!!isNewlyCreated}
    />
  );
};

export default EditPodcastSeries;
