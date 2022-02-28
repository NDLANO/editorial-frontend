/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldHeader } from '@ndla/forms';
import { IArticleSummaryV2 as ArticleSearchSummaryApiType } from '@ndla/types-article-api';
import { ISeries as PodcastSeriesApiType } from '@ndla/types-audio-api';
import { isEmptyArray, useFormikContext } from 'formik';
import { fetchSeries, searchSeries } from '../../../modules/audio/audioApi';
import ElementList from '../../FormikForm/components/ElementList';
import { PodcastFormValues } from '../../../modules/audio/audioApiInterfaces';
import handleError from '../../../util/handleError';
import AsyncDropdown from '../../../components/Dropdown/asyncDropdown/AsyncDropdown';
import { SearchResultBase } from '../../../interfaces';

type element = Omit<PodcastSeriesApiType, 'revision'> &
  Pick<ArticleSearchSummaryApiType, 'metaImage' | 'articleType'>;

const PodcastSeriesInformation = () => {
  const { t } = useTranslation();
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

  const onAddSeries = async (series: element) => {
    try {
      const newSeries = await fetchSeries(series.id, language || 'nb');
      delete newSeries.episodes;
      setFieldValue('series', newSeries);
    } catch (e) {
      handleError(e);
    }
  };

  const onUpdateSeries = (seriesValue: element) => {
    if (isEmptyArray(seriesValue)) {
      setFieldValue('series', null);
    } else {
      setFieldValue('series', seriesValue);
    }
  };

  const searchForSeries = async (input: string): Promise<SearchResultBase<element>> => {
    const searchResult = await searchSeries({
      query: input,
      language: language,
    });
    const results = searchResult.results.map(result => {
      return {
        ...result,
        revision: 1,
        metaImage: {
          url: result.coverPhoto.url,
          alt: result.coverPhoto.altText,
        },
        articleType: 'series',
      };
    });
    //@ts-ignore
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
      <AsyncDropdown
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

export default PodcastSeriesInformation;
