/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useField } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ComboboxLabel } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { AudioMetaInformationDTO } from "@ndla/types-backend/audio-api";
import { GenericComboboxInput, GenericComboboxItemContent } from "../../../components/abstractions/Combobox";
import { GenericSearchCombobox } from "../../../components/Form/GenericSearchCombobox";
import ListResource from "../../../components/Form/ListResource";
import { FormContent } from "../../../components/FormikForm";
import { fetchAudio } from "../../../modules/audio/audioApi";
import { useSearchAudio } from "../../../modules/audio/audioQueries";
import { routes } from "../../../util/routeHelpers";
import { usePaginatedQuery } from "../../../util/usePaginatedQuery";

const StyledList = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxsmall",
    listStyle: "none",
  },
});

interface Props {
  language: string;
  seriesId: number | undefined;
  initialEpisodes: AudioMetaInformationDTO[] | undefined;
}

const PodcastEpisodes = ({ language, seriesId, initialEpisodes = [] }: Props) => {
  const { query, delayedQuery, setQuery, page, setPage } = usePaginatedQuery();
  const { t } = useTranslation();
  const [field, , helpers] = useField<number[]>("episodes");
  const [apiEpisodes, setApiEpisodes] = useState<AudioMetaInformationDTO[]>(initialEpisodes);

  const searchQuery = useSearchAudio(
    { query: delayedQuery, language, page, audioType: "podcast" },
    {
      placeholderData: (prev) => prev,
    },
  );

  const onValueChange = async (newValue: number) => {
    if (field.value.includes(newValue)) {
      helpers.setValue(field.value.filter((val) => val !== newValue));
      setApiEpisodes(apiEpisodes.filter((c) => c.id !== newValue));
    } else {
      helpers.setValue(field.value.concat(newValue));
      const newAudio = await fetchAudio(newValue, language);
      setApiEpisodes((prev) => prev.concat(newAudio));
    }
  };

  return (
    <FormContent>
      <GenericSearchCombobox
        value={field.value.map((c) => c.toString())}
        onValueChange={(details) => {
          const newValue = parseInt(details.value[0]);
          if (!newValue) return;
          onValueChange(newValue);
        }}
        items={searchQuery.data?.results ?? []}
        itemToValue={(item) => item.id.toString()}
        itemToString={(item) => item.title.title}
        isItemDisabled={(item) =>
          // Disable item if it exists in another series
          item.series?.id !== undefined && item.series.id !== seriesId
        }
        closeOnSelect={false}
        selectionBehavior="preserve"
        isSuccess={searchQuery.isSuccess}
        paginationData={searchQuery.data}
        inputValue={query}
        onInputValueChange={(details) => setQuery(details.inputValue)}
        onPageChange={(details) => setPage(details.page)}
        renderItem={(item) => (
          <GenericComboboxItemContent
            title={item.title.title}
            image={item.podcastMeta?.coverPhoto}
            useFallbackImage
            description={
              item.series?.id !== undefined && item.series.id !== seriesId
                ? t("podcastSeriesForm.alreadyPartOfSeries")
                : undefined
            }
          />
        )}
      >
        <ComboboxLabel>{t("form.relatedConcepts.articlesTitle")}</ComboboxLabel>
        <GenericComboboxInput
          placeholder={t("form.content.relatedArticle.placeholder")}
          isFetching={searchQuery.isFetching}
        />
      </GenericSearchCombobox>
      <StyledList>
        {apiEpisodes.map((element) => (
          <li key={element.id}>
            <ListResource
              title={element.title.title}
              metaImage={element.podcastMeta?.coverPhoto}
              url={routes.audio.edit(element.id, language)}
              onDelete={() => onValueChange(element.id)}
              removeElementTranslation={t("conceptpageForm.removeArticle")}
            />
          </li>
        ))}
      </StyledList>
    </FormContent>
  );
};

export default PodcastEpisodes;
