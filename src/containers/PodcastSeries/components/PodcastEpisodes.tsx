/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import { FieldHeader } from '@ndla/forms';
import { useFormikContext } from 'formik';
import ElementList from '../../FormikForm/components/ElementList';
import { AsyncDropdown } from '../../../components/Dropdown';
import handleError from '../../../util/handleError';

import {
  AudioSearchResultType,
  SeriesSearchResult,
} from '../../../modules/audio/audioApiInterfaces';
import { PodcastSeriesFormikType } from './PodcastSeriesForm';
import { fetchAudio, searchAudio } from '../../../modules/audio/audioApi';

const PodcastEpisodes = ({ t }: tType) => {
  const {
    values: { episodes, language },
    setFieldValue,
  } = useFormikContext<PodcastSeriesFormikType>();
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

  const searchForPodcasts = async (input: string): Promise<SeriesSearchResult> => {
    return searchAudio({
      query: input,
      language: language,
      audioType: 'podcast',
    });
  };

  return (
    <>
      <FieldHeader
        title={t('form.podcastEpisodesSection')}
        subTitle={t('form.podcastEpisodesTypeName')}
      />
      <ElementList
        elements={episodes.map(ep => ({
          ...ep,
          metaImage: {
            alt: ep.podcastMeta?.coverPhoto.altText,
            url: ep.podcastMeta?.coverPhoto.url,
            language,
          },
          articleType: 'audio',
        }))}
        isOrderable={false}
        messages={{
          dragElement: t('conceptpageForm.changeOrder'),
          removeElement: t('conceptpageForm.removeArticle'),
        }}
        onUpdateElements={onUpdateElements}
      />
      <AsyncDropdown
        selectedItems={[]}
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

export default injectT(PodcastEpisodes);
