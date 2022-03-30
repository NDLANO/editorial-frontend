/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ISeriesSummary } from '@ndla/types-audio-api';
import { toEditPodcastSeries } from '../../../../util/routeHelpers';
import { SeriesResultShape } from '../../../../shapes';
import { searchClasses } from '../../SearchContainer';

interface Props {
  series: ISeriesSummary;
}

const SearchPodcastSeries = ({ series }: Props) => {
  const { t } = useTranslation();
  return (
    <div {...searchClasses('result')}>
      <div {...searchClasses('image')}>
        <img src={series.coverPhoto.url + '?width=200'} alt={`${series.coverPhoto.altText}`} />
      </div>
      <div {...searchClasses('content')}>
        <Link to={toEditPodcastSeries(series.id, series.title.language)}>
          <h1 {...searchClasses('title')}>{series.title.title || t('podcastSearch.noTitle')}</h1>
        </Link>
        <p {...searchClasses('description')}>
          {`${t('searchPage.language')}: `}
          {series.supportedLanguages?.map(lang => (
            <span key={lang} {...searchClasses('other-link')}>
              {t(`language.${lang}`)}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};

SearchPodcastSeries.propTypes = {
  series: SeriesResultShape.isRequired,
};

export default SearchPodcastSeries;
