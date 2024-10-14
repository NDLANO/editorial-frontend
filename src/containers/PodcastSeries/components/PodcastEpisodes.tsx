/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { IAudioSummarySearchResult, IAudioSummary } from "@ndla/types-backend/audio-api";
import { PodcastSeriesFormikType } from "./PodcastSeriesForm";
import AsyncDropdown from "../../../components/Dropdown/asyncDropdown/AsyncDropdown";
import FieldHeader from "../../../components/Field/FieldHeader";
import ListResource, { ElementType } from "../../../components/Form/ListResource";
import { fetchAudio, postSearchAudio } from "../../../modules/audio/audioApi";
import handleError from "../../../util/handleError";

const PodcastEpisodes = () => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<PodcastSeriesFormikType>();
  const { episodes, language } = values;

  const onAddEpisodeToList = async (audio: IAudioSummary) => {
    try {
      const newAudio = await fetchAudio(audio.id, language);
      if (newAudio !== undefined) {
        setFieldValue("episodes", [...episodes, newAudio]);
      }
    } catch (e) {
      handleError(e);
    }
  };

  const onDeleteElements = (elements: ElementType[], deleteIndex: number) => {
    const newElements = elements.filter((_, i) => i !== deleteIndex);
    setFieldValue("episodes", newElements);
  };

  const searchForPodcasts = async (input: string, page?: number): Promise<IAudioSummarySearchResult> => {
    const searchResult = await postSearchAudio({
      query: input,
      page,
      language: language,
      audioType: "podcast",
    });

    const results = searchResult.results.map((result) => {
      const usedByOther = result.series?.id !== undefined && result.series?.id !== values.id;
      const disabledText = usedByOther ? t("podcastSeriesForm.alreadyPartOfSeries") : undefined;
      return {
        ...result,
        disabledText,
        image: result.podcastMeta?.coverPhoto.url,
        alt: result.podcastMeta?.coverPhoto.altText,
      };
    });

    return { ...searchResult, results };
  };

  const elements = episodes.map((ep) => ({
    ...ep,
    metaImage: {
      alt: ep.podcastMeta?.coverPhoto.altText,
      url: ep.podcastMeta?.coverPhoto.url,
      language,
    },
    articleType: "audio",
  }));

  return (
    <>
      <FieldHeader title={t("form.podcastEpisodesSection")} subTitle={t("form.podcastEpisodesTypeName")} />
      {elements.map((element, index) => (
        <ListResource
          key={index}
          element={element}
          onDelete={() => onDeleteElements(elements, index)}
          removeElementTranslation={t("conceptpageForm.removeArticle")}
        />
      ))}
      <AsyncDropdown
        selectedItems={elements}
        idField="id"
        labelField="title"
        placeholder={t("form.content.relatedArticle.placeholder")}
        apiAction={searchForPodcasts}
        onClick={(event: Event) => event.stopPropagation()}
        onChange={onAddEpisodeToList}
        multiSelect
        disableSelected
        clearInputField
      />
    </>
  );
};

export default PodcastEpisodes;
