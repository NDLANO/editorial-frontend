/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { Link } from 'react-router-dom';
import { FieldHeader } from '@ndla/forms';
import { DeleteForever } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';
import { fetchSeries, searchSeries } from 'modules/audio/audioApi';
import { StyledButtonIcons } from 'containers/FormikForm/components/ElementListItem';
import { useFormikContext } from 'formik';
import { css } from '@emotion/core';
import isEmpty from 'lodash/fp/isEmpty';
import ElementList from '../../FormikForm/components/ElementList';
import {
  AudioApiType,
  NewPodcastSeries,
  PodcastFormValues,
  PodcastSeriesApiType,
  SeriesSearchResult,
  SeriesSearchSummary,
} from '../../../modules/audio/audioApiInterfaces';

import { AsyncDropdown } from '../../../components/Dropdown';
import handleError from '../../../util/handleError';
import * as audioApi from '../../../modules/audio/audioApi';
import { StyledListItem } from 'containers/FormikForm/components/ElementListItem';


const containerStyle = css`
  display: aflex;
  
`;

const PodcastSeriesInformation = ({ t }: tType) => {
  const { values, setFieldValue } = useFormikContext<PodcastFormValues>();
  const { series, language } = values;

  useEffect(() => {
    if (series !== undefined) {
      if (!isEmpty(series)) {
        try {
          const newSeries = fetchSeries(series.id, language);
          if (newSeries !== undefined) {
            setFieldValue('series.episodes', newSeries.episodes);
          }
        } catch (e) {
          handleError(e);
        }
      }
    } else {
      setFieldValue('series', {});
    }
  }, [series, language, setFieldValue]);

  const onAddSeries = async (series: SeriesSearchSummary) => {
    try {
      const newSeries = await fetchSeries(series.id, language);
      if (newSeries !== undefined) {
        setFieldValue('series', newSeries);
        const newPodcastSeries: NewPodcastSeries = updateSeriesEpisodes(newSeries, false);
        await audioApi.updateSeries(series.id, newPodcastSeries);
      }
    } catch (e) {
      handleError(e);
    }
  };


  const onUpdateElements = (series: PodcastSeriesApiType) => {
    setFieldValue('series', series);
  };

  const updateSeriesEpisodes = (series: PodcastSeriesApiType, remove: boolean) => {
    let podcastEpisodes = series.episodes ? series.episodes!.map((ep: AudioApiType) => ep.id) : [];
    if (remove) {
      const index = podcastEpisodes.indexOf(values.id as number);
      if (index > -1) {
        podcastEpisodes.splice(index, 1);
      }
    } else {
      podcastEpisodes = [...podcastEpisodes, values.id as number];
    }
    const newPodcastSeries: NewPodcastSeries = {
      id: series.id,
      revision: series.revision,
      title: series.title.title,
      description: series.description.description,
      coverPhotoId: series.coverPhoto.id,
      coverPhotoAltText: series.coverPhoto.altText,
      language: series.title.language,
      episodes: podcastEpisodes,
    };
    return newPodcastSeries;
  };

  const onDeleteSeries = async () => {
    try {
      setFieldValue('series', {});
      const newSeries = await fetchSeries(series!.id, language);
      const newPodcastSeries: NewPodcastSeries = updateSeriesEpisodes(newSeries, true);
      await audioApi.updateSeries(series!.id, newPodcastSeries);
    } catch (e) {
      handleError(e);
    }
  };

  const searchForSeries = async (input: string): Promise<SeriesSearchResult> => {
    const searchResult = await searchSeries({
      query: input,
      language: language,
    });

    const results = searchResult.results.map((result: SeriesSearchSummary) => {
      const haveSelected = series?.id !== undefined && series.id !== result.id;
      const disabledText = haveSelected ? ' ' : undefined;
      return {
        ...result,
        disabledText,
      };
    });
    return { ...searchResult, results };
  };

  const elements = [series].map(s =>({
    ...s,
    metaImage: {
      alt: s?.coverPhoto.altText,
      url: s?.coverPhoto.url,
      language,
    },
    articleType: 'series',
  }));


  return (
    <>
      <FieldHeader title={t('podcastForm.fields.series')} />
      {!isEmpty(series) ? (
       <ElementList
        elements={elements}
        isOrderable={false}
        messages={{
          dragElement: t('conceptpageForm.changeOrder'),
          removeElement: t('conceptpageForm.removeArticle'),
        }}
        onUpdateElements={onUpdateElements}
      />
      ) : (
        <p>{t('podcastForm.information.noSeries')}</p>
      )}
      <AsyncDropdown
        selectedItems={[series]}
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
