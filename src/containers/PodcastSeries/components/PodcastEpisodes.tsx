/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { FieldHeader } from '@ndla/forms';
import { useFormikContext } from 'formik';
import ElementList from '../../FormikForm/components/ElementList';
import { AsyncDropdown } from '../../../components/Dropdown';
import handleError from '../../../util/handleError';

import {
  AudioSearchResult,
  AudioSearchResultType,
} from '../../../modules/audio/audioApiInterfaces';
import { PodcastSeriesFormikType } from './PodcastSeriesForm';
import { fetchAudio, searchAudio } from '../../../modules/audio/audioApi';

const PodcastEpisodes = () => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<PodcastSeriesFormikType>();
  const { episodes, language } = values;
  const onAddEpisodeToList = async (audio: AudioSearchResultType) => {
    try {
      const newAudio = await fetchAudio(audio.id, language);
      if (newAudio !== undefined) {
        setFieldValue('episodes', [...episodes, newAudio]);
      }
    } catch (e) {
      handleError(e);
    }
  };

  const onUpdateElements = (eps: AudioSearchResultType[]) => {
    setFieldValue('episodes', eps);
  };

  const searchForPodcasts = async (
    input: string,
  ): Promise<AudioSearchResult & { disabledText?: string; image?: string; alt?: string }> => {
    const searchResult = await searchAudio({
      query: input,
      language: language,
      'audio-type': 'podcast',
    });

    const results = searchResult.results.map(result => {
      const usedByOther = result.series?.id !== undefined && result.series?.id !== values.id;
      const disabledText = usedByOther ? t('podcastSeriesForm.alreadyPartOfSeries') : undefined;
      return {
        ...result,
        disabledText,
        image: result.podcastMeta?.coverPhoto.url,
        alt: result.podcastMeta?.coverPhoto.altText,
      };
    });

    return { ...searchResult, results };
  };

  const elements = episodes.map(ep => ({
    ...ep,
    metaImage: {
      alt: ep.podcastMeta?.coverPhoto.altText,
      url: ep.podcastMeta?.coverPhoto.url,
      language,
    },
    articleType: 'audio',
  }));

  return (
    <>
      <FieldHeader
        title={t('form.podcastEpisodesSection')}
        subTitle={t('form.podcastEpisodesTypeName')}
      />
      <ElementList
        elements={elements}
        isOrderable={false}
        messages={{
          dragElement: t('conceptpageForm.changeOrder'),
          removeElement: t('conceptpageForm.removeArticle'),
        }}
        onUpdateElements={onUpdateElements}
      />
      <AsyncDropdown
        selectedItems={elements}
        idField="id"
        name="relatedArticleSearch"
        labelField="title"
        placeholder={t('form.content.relatedArticle.placeholder')}
        label="label"
        apiAction={searchForPodcasts}
        onClick={(event: Event) => event.stopPropagation()}
        onChange={(audio: AudioSearchResultType) => onAddEpisodeToList(audio)}
        multiSelect
        disableSelected
        clearInputField
      />
    </>
  );
};

export default PodcastEpisodes;
