/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { FieldHeader } from "@ndla/forms";
import { IAudioSummarySearchResult, IAudioSummary } from "@ndla/types-backend/audio-api";
import { PodcastSeriesFormikType } from "./PodcastSeriesForm";
import AsyncDropdown from "../../../components/Dropdown/asyncDropdown/AsyncDropdown";
import { fetchAudio, postSearchAudio } from "../../../modules/audio/audioApi";
import handleError from "../../../util/handleError";
import ElementList from "../../FormikForm/components/ElementList";

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

  const onUpdateElements = (eps: IAudioSummary[]) => {
    setFieldValue("episodes", eps);
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
      <ElementList
        elements={elements}
        isDraggable={false}
        messages={{
          dragElement: t("conceptpageForm.changeOrder"),
          removeElement: t("conceptpageForm.removeArticle"),
        }}
        onUpdateElements={onUpdateElements}
      />
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
