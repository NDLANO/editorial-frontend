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
import {
  StyledSearchContent,
  StyledSearchDescription,
  StyledSearchImageContainer,
  StyledSearchOtherLink,
  StyledSearchResult,
  StyledSearchTitle,
} from '../form/StyledSearchComponents';

interface Props {
  series: ISeriesSummary;
}

const SearchPodcastSeries = ({ series }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledSearchResult>
      <StyledSearchImageContainer>
        <img src={series.coverPhoto.url + '?width=200'} alt={`${series.coverPhoto.altText}`} />
      </StyledSearchImageContainer>
      <StyledSearchContent>
        <Link to={toEditPodcastSeries(series.id, series.title.language)}>
          <StyledSearchTitle>{series.title.title || t('podcastSearch.noTitle')}</StyledSearchTitle>
        </Link>
        <StyledSearchDescription>
          {`${t('searchPage.language')}: `}
          {series.supportedLanguages?.map(lang => (
            <StyledSearchOtherLink key={lang}>{t(`language.${lang}`)}</StyledSearchOtherLink>
          ))}
        </StyledSearchDescription>
      </StyledSearchContent>
    </StyledSearchResult>
  );
};

export default SearchPodcastSeries;
