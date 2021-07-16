/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import { FieldHeader } from '@ndla/forms';
import { fetchSeries, searchSeries } from 'modules/audio/audioApi';
import { isEmptyArray, useFormikContext } from 'formik';
import ElementList from '../../FormikForm/components/ElementList';
import {
  PodcastFormValues,
  PodcastSeriesApiType,
  SeriesSearchResult,
  SeriesSearchSummary,
} from '../../../modules/audio/audioApiInterfaces';

import { AsyncDropdown } from '../../../components/Dropdown';
import handleError from '../../../util/handleError';

const PodcastSeriesInformation = ({ t }: tType) => {
  const { values, setFieldValue } = useFormikContext<PodcastFormValues>();
  const { series, language } = values;

  const onAddSeries = async (series: SeriesSearchSummary) => {
    try {
      const newSeries = await fetchSeries(series.id, language);
      if (newSeries !== undefined) {
        setFieldValue('series', newSeries);
      }
    } catch (e) {
      handleError(e);
    }
  };

  const onUpdateSeries = (series: PodcastSeriesApiType) => {
    if (isEmptyArray(series)) {
      setFieldValue('series', null);
    } else {
      setFieldValue('series', series);
    }
  };

  const searchForSeries = async (input: string): Promise<SeriesSearchResult> => {
    const searchResult = await searchSeries({
      query: input,
      language: language,
    });
    return searchResult;
  };

  let element:
    | (PodcastSeriesApiType & {
        metaImage: {
          alt: string;
          url: string;
          language?: string;
        };
        articleType: string;
      })
    | {} = {};

  if (series) {
    element = {
      ...series,
      metaImage: {
        alt: series?.coverPhoto.altText,
        url: series?.coverPhoto.url,
        language,
      },
      articleType: 'series',
    };
  }

  return (
    <>
      <FieldHeader title={t('podcastForm.fields.series')} />
      {Object.keys(element).length > 0 ? (
        <ElementList
          elements={[element]}
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
        selectedItems={[element]}
        idField="id"
        name="relatedSeriesSearch"
        labelField="title"
        placeholder={t('form.content.relatedArticle.placeholder')}
        label="label"
        apiAction={searchForSeries}
        onClick={(event: Event) => event.stopPropagation()}
        onChange={(series: SeriesSearchSummary) => onAddSeries(series)}
        multiSelect
        disableSelected
        clearInputField
      />
    </>
  );
};

export default injectT(PodcastSeriesInformation);
