/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import { Link } from 'react-router-dom';
import { FieldHeader } from '@ndla/forms';
import { toEditPodcastSeries } from '../../../util/routeHelpers';
import { PodcastSeriesApiType } from '../../../modules/audio/audioApiInterfaces';

interface Props {
  podcastSeries: PodcastSeriesApiType | undefined;
  language: string;
}

const PodcastSeriesInformation = ({ podcastSeries, language, t }: Props & tType) => {
  const languageForLink =
    podcastSeries?.supportedLanguages.find(l => l === language) ??
    podcastSeries?.supportedLanguages?.[0] ??
    language;

  if (podcastSeries?.id === undefined) {
    return null;
  }

  return (
    <>
      <FieldHeader title={t('podcastForm.fields.series')} />
      <p>
        {t('podcastForm.information.partOfSeries')}
        {': '}
        <q>
          <Link
            to={toEditPodcastSeries(podcastSeries.id, languageForLink)}
            target="_blank"
            rel="noopener noreferrer">
            {podcastSeries?.title.title}
          </Link>
        </q>
      </p>
    </>
  );
};

export default injectT(PodcastSeriesInformation);
