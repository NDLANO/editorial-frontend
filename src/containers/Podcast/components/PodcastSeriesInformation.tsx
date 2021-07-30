/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { FieldHeader } from '@ndla/forms';
import { isEmptyArray, useFormikContext } from 'formik';
import { fetchSeries, searchSeries } from '../../../modules/audio/audioApi';
import ElementList from '../../FormikForm/components/ElementList';
import {
  PodcastFormValues,
  PodcastSeriesApiType,
  SeriesSearchResult,
  SeriesSearchSummary,
} from '../../../modules/audio/audioApiInterfaces';
import handleError from '../../../util/handleError';
import { ArticleSearchSummaryApiType } from '../../../modules/article/articleApiInterfaces';
import AsyncDropdown from '../../../components/Dropdown/asyncDropdown/AsyncDropdown';

type element = PodcastSeriesApiType &
  Pick<ArticleSearchSummaryApiType, 'metaImage' | 'articleType'>;

const PodcastSeriesInformation = ({ t }: tType) => {
  const {
    values: { series, language },
    setFieldValue,
  } = useFormikContext<PodcastFormValues>();
  const [element, setElement] = useState<element[]>([]);

  useEffect(() => {
    if (series) {
      setElement([
        {
          ...series,
          metaImage: {
            alt: series.coverPhoto.altText,
            url: series.coverPhoto.url,
            language: language || 'nb',
          },
          articleType: 'series',
        },
      ]);
    } else {
      setElement([]);
    }
  }, [series, language]);

  const onAddSeries = async (series: PodcastSeriesApiType) => {
    try {
      const newSeries = await fetchSeries(series.id, language || 'nb');
      delete newSeries.episodes;
      setFieldValue('series', newSeries);
    } catch (e) {
      handleError(e);
    }
  };

  const onUpdateSeries = (seriesValue: PodcastSeriesApiType) => {
    if (isEmptyArray(seriesValue)) {
      setFieldValue('series', null);
    } else {
      setFieldValue('series', seriesValue);
    }
  };

  const searchForSeries = async (input: string): Promise<SeriesSearchResult> => {
    const searchResult = await searchSeries({
      query: input,
      language: language,
    });
    const results = searchResult.results.map(result => {
      return {
        ...result,
        metaImage: {
          url: result.coverPhoto.url,
          alt: result.coverPhoto.altText,
        },
      };
    });
    return { ...searchResult, results };
  };

  return (
    <>
      <FieldHeader title={t('podcastForm.fields.series')} />
      {Object.keys(element).length > 0 ? (
        <ElementList
          elements={element}
          isOrderable={false}
          messages={{
            dragElement: t('conceptpageForm.changeOrder'),
            removeElement: t('podcastForm.information.removeSeries'),
          }}
          onUpdateElements={onUpdateSeries}
        />
      ) : (
        <p>{t('podcastForm.information.noSeries')}</p>
      )}
      <AsyncDropdown<SeriesSearchSummary, PodcastSeriesApiType>
        selectedItems={element}
        idField="id"
        labelField="title"
        placeholder={t('form.content.relatedArticle.placeholder')}
        apiAction={searchForSeries}
        onClick={(event: Event) => event.stopPropagation()}
        onChange={onAddSeries}
        multiSelect
        disableSelected
        clearInputField
      />
    </>
  );
};

export default injectT(PodcastSeriesInformation);
